import os

import kfp
import requests

from django.apps import AppConfig
from minio import Minio

# Kubeflow settings
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

# MinIO settings
minio_access_key = os.getenv("MINIO_ACCESS_KEY")
minio_secret_key = os.getenv("MINIO_SECRET_KEY")
minio_endpoint = os.getenv("MINIO_ENDPOINT")


class SimulationConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'simulation'

    kubeflow_client = kfp.Client(
        host=f"{KUBERFLOW_HOST}/pipeline",
        namespace=f"{KUBEFLOW_NAMESPACE}",
        cookies=f"authservice_session={session_cookie}",
    )

    minio_client = Minio(minio_endpoint, minio_access_key, minio_secret_key, secure=False)
