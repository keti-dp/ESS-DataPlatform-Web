from storages.backends.gcloud import GoogleCloudStorage


class GoogleCloudStaticStorage(GoogleCloudStorage):
    def __init__(self, *args, **kwargs):
        kwargs["location"] = "static"

        super(GoogleCloudStaticStorage, self).__init__(*args, **kwargs)


class GoogleCloudMediaStorage(GoogleCloudStorage):
    def __init__(self, *args, **kwargs):
        kwargs["location"] = "media"

        super(GoogleCloudMediaStorage, self).__init__(*args, **kwargs)
