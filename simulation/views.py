import json
import kfp
import networkx as nx
import os
import requests
import yaml
from datetime import datetime
from minio import Minio
from rest_framework.decorators import action
from rest_framework.views import APIView, Response
from rest_framework.viewsets import ViewSet
from rest_framework import status
from rest_framework_simplejwt.tokens import AccessToken


KUBERFLOW_HOST = os.getenv("KUBEFLOW_HOST")
KUBEFLOW_USERNAME = os.getenv("KUBEFLOW_USERNAME")
KUBEFLOW_PASSWORD = os.getenv("KUBEFLOW_PASSWORD")
KUBEFLOW_NAMESPACE = os.getenv("KUBEFLOW_NAMESPACE")

session = requests.Session()
response = session.get(KUBERFLOW_HOST)

headers = {
    "Content-Type": "application/x-www-form-urlencoded",
}

user_data = {"login": KUBEFLOW_USERNAME, "password": KUBEFLOW_PASSWORD}
session.post(response.url, headers=headers, data=user_data)
session_cookie = session.cookies.get_dict()["authservice_session"]

kubeflow_client = kfp.Client(
    host=f"{KUBERFLOW_HOST}/pipeline",
    namespace=f"{KUBEFLOW_NAMESPACE}",
    cookies=f"authservice_session={session_cookie}",
)

minio_access_key = os.getenv("MINIO_ACCESS_KEY")
minio_secret_key = os.getenv("MINIO_SECRET_KEY")
minio_endpoint = os.getenv("MINIO_ENDPOINT")

minio_client = Minio(minio_endpoint, minio_access_key, minio_secret_key, secure=False)


def convert_to_dict(args):
    result_dict = {}
    key = None

    for arg in args:
        if arg.startswith("--"):
            if key is not None:
                if len(result_dict[key]) == 1:
                    result_dict[key] = result_dict[key][0]
            key = arg
            result_dict[key] = []
        else:
            result_dict[key].append(arg)
    if key is not None and len(result_dict[key]) == 1:
        result_dict[key] = result_dict[key][0]

    return result_dict


def get_pipeline_entrypoint(pipeline):
    pipeline_spec = pipeline["spec"]
    entrypoint = pipeline_spec["entrypoint"]

    return entrypoint


def get_pipeline_root_component_name(pipeline):
    pipeline_spec = pipeline["spec"]
    entrypoint = pipeline_spec["entrypoint"]
    templates = pipeline_spec["templates"]

    for template in templates:
        if template["name"] == entrypoint:
            dag_tasks = template["dag"]["tasks"]

            for dag_task in dag_tasks:
                if "dependencies" not in dag_task:
                    root_component_name = dag_task["name"]

                    break

    return root_component_name


def get_pipeline_component_level(pipeline_info, root_component_name):
    """Obtain the level of each component.

    Obtain the longest distance (level) for each of the different components in the root component.

    Returns:
        For example:
            graph_nodes = ["a", "b", "c", "d", "e", "f", "g", "h"]
            graph_edges = [
                ("f", "a"), # "f" to "a"
                ("a", "b"),
                ("a", "e"),
                ("b", "c"),
                ("b", "d"),
                ("d", "e"),
                ("f", "c"),
                ("f", "g"),
                ("h", "f"),
            ]

            source_node = "h"

            Result:
                { "h": 0, "f": 1, "a": 2, "g": 2, "b": 3, "c": 4, "d": "4", "e": 5 }
    """

    graph_edges = []

    for key, value in pipeline_info.items():
        component_name = key

        if "dependencies" in value:
            for parent_component_name in value["dependencies"]:
                edge = (parent_component_name, component_name, {"weight": 1})
                graph_edges.append(edge)

    G = nx.DiGraph()
    G.add_edges_from(graph_edges)
    H = nx.DiGraph(G)

    for u, v in H.edges():
        H[u][v]["weight"] *= -1

    component_level = nx.single_source_bellman_ford_path_length(H, root_component_name)

    for key, value in component_level.items():
        positive_level = value * (-1)
        component_level[key] = positive_level

    return component_level


def get_pipeline_info(pipeline):
    pipeline_info = {}
    dag_seq_dict = {}

    # Set 'args' & 'dependencies'

    for template in pipeline["spec"]["templates"]:
        pipeline_info[template["name"]] = {}

        try:
            pipeline_info[template["name"]]["args"] = convert_to_dict(template["container"]["args"])
        except KeyError:
            pass

        try:
            for dag_seq in template["dag"]["tasks"]:
                try:
                    dag_seq_dict[dag_seq["name"]] = dag_seq["dependencies"]
                except KeyError:
                    pass
        except KeyError:
            pass

    for key in dag_seq_dict.keys():
        pipeline_info[key]["dependencies"] = dag_seq_dict[key]

    # Set 'level'

    root_component_name = get_pipeline_root_component_name(pipeline)
    component_level = get_pipeline_component_level(pipeline_info, root_component_name)

    for component, level in component_level.items():
        pipeline_info[component]["level"] = level

    return pipeline_info


class SimulationPipelineViewSet(ViewSet):
    def list(self, request):
        list_pipelines = kubeflow_client.list_pipelines(page_size=10000)

        pipelines = list_pipelines.pipelines

        data = [{"id": pipeline.id, "name": pipeline.name} for pipeline in pipelines]

        return Response(data)

    def retrieve(self, request, pk=None):
        pipeline_id = pk
        bucket_name = "mlpipeline"
        object_name = f"pipelines/{pipeline_id}"

        data = minio_client.get_object(bucket_name, object_name)

        data_str = ""

        for ds in data.stream(32 * 1024):
            data_str += ds.decode("utf-8")

        pipeline = yaml.safe_load(data_str)
        entrypoint = get_pipeline_entrypoint(pipeline)
        root_component_name = get_pipeline_root_component_name(pipeline)
        pipeline_info = get_pipeline_info(pipeline)

        response_data = {
            "entrypoint": entrypoint,
            "root_component_name": root_component_name,
            "pipeline_info": pipeline_info,
        }

        return Response(response_data, status=status.HTTP_200_OK)

    @action(detail=True, methods=["post"])
    def pipeline_run(self, request, pk=None):
        pipeline_id = pk
        pipeline = kubeflow_client.get_pipeline(pipeline_id)
        pipeline_name = pipeline.name

        bucket_name = "mlpipeline"
        object_name = f"pipelines/{pipeline_id}"

        data = minio_client.get_object(bucket_name, object_name)

        data_str = ""

        for ds in data.stream(32 * 1024):
            data_str += ds.decode("utf-8")

        data_dict = yaml.safe_load(data_str)

        component_change_args_dict = request.data

        for index, template in enumerate(data_dict["spec"]["templates"]):
            template_name = template["name"]

            if template_name in component_change_args_dict:
                component_change_args = component_change_args_dict[template_name]
                data_dict["spec"]["templates"][index]["container"]["args"] = component_change_args

        pipeline_temp_file = "pipeline.yaml"

        with open(pipeline_temp_file, "w") as f:
            yaml.dump(data_dict, f)

        access_token_str = request.COOKIES.get("access_token")
        access_token = AccessToken(access_token_str)
        username = access_token["name"]

        pipeline = kubeflow_client.create_run_from_pipeline_package(
            pipeline_file=pipeline_temp_file,
            arguments=None,
            run_name=f"[ESS DP Web][{username}][{pipeline_name}] {datetime.strftime(datetime.now(), '%Y-%m-%dT%H:%M:%S')}",
        )

        run_id = pipeline.run_id

        return Response({"id": run_id}, status=status.HTTP_200_OK)


class SimulationPipelineRunViewSet(ViewSet):
    def retrieve(self, request, pk=None):
        run_id = pk
        run_info = kubeflow_client.get_run(run_id)

        pipeline_runtime = run_info.pipeline_runtime
        pipeline_run_status = run_info.run.status

        workflow_manifest = pipeline_runtime.workflow_manifest
        workflow_manifest_object = json.loads(workflow_manifest)
        nodes = workflow_manifest_object["status"]["nodes"]
        nodes_status = {}

        for key, value in nodes.items():
            if value["type"] == "Pod":
                node_template_name = value["templateName"]
                node_phase = value["phase"]

                nodes_status[node_template_name] = {
                    "phase": node_phase,
                }

                if "outputs" in value:
                    node_outputs = value["outputs"]
                    log_path = node_outputs["artifacts"][-1]["s3"]["key"]
                    nodes_status[node_template_name]["log_path"] = log_path

        response_data = {
            "run_id": run_id,
            "run_status": {"components": nodes_status, "pipeline": pipeline_run_status},
        }

        return Response(response_data, status=status.HTTP_200_OK)


class SimulationPipelineLogView(APIView):
    def get(self, request, pk=None):
        try:
            bucket_name = "mlpipeline"
            object_name = request.query_params.get("log-path")
            response = minio_client.get_object(
                bucket_name,
                object_name,
            )
            response_data = response.read().decode("utf-8")

            return Response({"data": response_data}, status=status.HTTP_200_OK)
        finally:
            response.close()
            response.release_conn()
