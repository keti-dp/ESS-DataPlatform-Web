from rest_framework_simplejwt.authentication import JWTTokenUserAuthentication


class CustomJWTTokenUserAuthentication(JWTTokenUserAuthentication):
    def authenticate(self, request):
        access_token_query_param = request.query_params.get("access-token")

        # Support to access token in request url or header
        if access_token_query_param:
            raw_token = access_token_query_param
        else:
            header = self.get_header(request)

            if header is None:
                raw_token = request.COOKIES.get("access_token") or None
            else:
                raw_token = self.get_raw_token(header)

        validated_token = self.get_validated_token(raw_token)

        return self.get_user(validated_token), validated_token
