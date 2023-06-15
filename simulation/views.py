import kfp
import json
import os
import requests
import uuid
import yaml
from datetime import datetime
from django.core.files.storage import default_storage
from minio import Minio
from rest_framework.decorators import action
from rest_framework.views import APIView, Response
from rest_framework.viewsets import ViewSet
from rest_framework import status
from rest_framework_simplejwt.tokens import AccessToken
from pprint import pprint


HOST = os.getenv("KUBEFLOW_HOST")
USERNAME = os.getenv("KUBEFLOW_USERNAME")
PASSWORD = os.getenv("KUBEFLOW_PASSWORD")
NAMESPACE = os.getenv("KUBEFLOW_NAMESAPCE")

session = requests.Session()
response = session.get(HOST)

headers = {
    "Content-Type": "application/x-www-form-urlencoded",
}

user_data = {"login": USERNAME, "password": PASSWORD}
session.post(response.url, headers=headers, data=user_data)
session_cookie = session.cookies.get_dict()["authservice_session"]

client = kfp.Client(
    host=f"{HOST}/pipeline",
    namespace=f"{NAMESPACE}",
    cookies=f"authservice_session={session_cookie}",
)


class SimulationView(APIView):
    def post(self, request):
        data = request.data
        file_name = f"simulation_{uuid.uuid4()}.json"

        with default_storage.open(f"simulation/run/{file_name}", "w") as f:
            json_data = json.dumps(data)
            f.write(json_data)

        return Response(data, status.HTTP_201_CREATED)


class SimulationPipelineViewSet(ViewSet):
    def list(self, request):
        list_pipelines = client.list_pipelines()

        pipelines = list_pipelines.pipelines

        data = [{"id": pipeline.id, "name": pipeline.name} for pipeline in pipelines]

        return Response(data)

    def retrieve(self, request, pk=None):
        access_key = os.getenv("MINIO_ACCESS_KEY")
        secret_key = os.getenv("MINIO_SECRET_KEY")
        endpoint = os.getenv("MINIO_ENDPOINT")

        minioClient = Minio(endpoint, access_key, secret_key, secure=False)

        pipeline_id = pk
        bucket_name = "mlpipeline"
        object_name = f"pipelines/{pipeline_id}"

        data = minioClient.get_object(bucket_name, object_name)

        data_str = ""

        for ds in data.stream(32 * 1024):
            data_str += ds.decode("utf-8")

        data_dict = yaml.safe_load(data_str)

        simulation_pipeline_spec = data_dict["spec"]

        return Response(simulation_pipeline_spec, status=status.HTTP_200_OK)

    @action(detail=True, methods=["post"])
    def pipeline_run(self, request, pk=None):
        access_key = os.getenv("MINIO_ACCESS_KEY")
        secret_key = os.getenv("MINIO_SECRET_KEY")
        endpoint = os.getenv("MINIO_ENDPOINT")

        minioClient = Minio(endpoint, access_key, secret_key, secure=False)

        pipeline_id = pk
        bucket_name = "mlpipeline"
        object_name = f"pipelines/{pipeline_id}"

        data = minioClient.get_object(bucket_name, object_name)

        data_str = ""

        for ds in data.stream(32 * 1024):
            data_str += ds.decode("utf-8")

        data_dict = yaml.safe_load(data_str)

        changedPipelineTemplates = request.data

        data_dict["spec"]["templates"] = changedPipelineTemplates

        with open("a.yaml", "w") as f:
            yaml.dump(data_dict, f)

        client = kfp.Client(
            host=f"{HOST}/pipeline",
            namespace=f"{NAMESPACE}",
            cookies=f"authservice_session={session_cookie}",
        )

        access_token_str = request.COOKIES.get("access_token")
        access_token = AccessToken(access_token_str)
        username = access_token["name"]

        pipeline = client.create_run_from_pipeline_package(
            pipeline_file="a.yaml", arguments=None, run_name=f"[ESS DataPaltform Web][{username}] {datetime.now()}"
        )
        pprint(pipeline)

        return Response(status=status.HTTP_200_OK)
