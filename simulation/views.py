import json
import uuid
from django.core.files.storage import default_storage
from rest_framework.views import APIView, Response
from rest_framework import status


class SimulationView(APIView):
    def post(self, request):
        data = request.data
        file_name = f"simulation_{uuid.uuid4()}.json"

        with default_storage.open(f"simulation/run/{file_name}", "w") as f:
            json_data = json.dumps(data)
            f.write(json_data)

        return Response(data, status.HTTP_201_CREATED)
