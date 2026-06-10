# ""

<!-- 프로젝트 이름과 한 줄 소개를 입력하세요 -->
"" 프로젝트로 API와 데이터셋을 제공합니다.

## Prerequisite

- Ubuntu Linux (>=20.04LTS)
- python3 (>=3.8)
- python3-venv
- python3-dev
- libpq-dev

## Installation

- 의존성 패키지 설치

```sh
$ cd ""    # 프로젝트 디렉토리명을 입력하세요
$ python3 -m venv .venv
$ source .venv/bin/activate
(.venv) $ pip install -r requirements.txt
```

- 프로젝트 루트 디렉토리에 '.env' 파일을 추가하거나 운영 체제 환경 변수를 설정
  - DJANGO_SETTINGS_MODULE="config.settings.development" 또는 "config.settings.production"
  - DJANGO_SECRET_KEY=""              # Django SECRET_KEY (랜덤 문자열)
  - DEFAULT_DB_ENGINE=""              # 예: django.db.backends.postgresql
  - DEFAULT_DB_HOST=""                # DB 호스트
  - DEFAULT_DB_PORT=""                # DB 포트 (예: 5432)
  - DEFAULT_DB_NAME=""                # DB 이름
  - DEFAULT_DB_USER=""                # DB 사용자
  - DEFAULT_DB_PASSWORD=""            # DB 비밀번호
  - TEST_DB_NAME=""                   # 테스트용 DB 이름
  - TEST_USER_NAME=""                 # 테스트용 계정 username
  - TEST_USER_PASSWORD=""             # 테스트용 계정 password
  - ALLOWED_HOSTS=""                  # 운영 도메인 (콤마로 구분)
  - DEFAULT_FILE_STORAGE=""           # 예: config.google_cloud_storages.GoogleCloudMediaStorage
  - STATICFILES_STORAGE=""            # 예: config.google_cloud_storages.GoogleCloudStaticStorage
  - GS_BUCKET_NAME=""                 # GCS 버킷 이름
  - API_MANAGEMENT_URL=""             # APIM 시스템 base URL
  - API_MANAGEMENT_DEVELOPER_PORTAL_URL_PATH=""   # APIM Developer Portal API 경로
  - API_MANAGEMENT_ACCESS_TOKEN=""    # APIM 관리자 access token
  - API_MANAGEMENT_TEST_API_ID=""     # 테스트용 API id
  - API_MANAGEMENT_TEST_APPLICATION_ID=""         # 테스트용 application id

## Run

- 기본 환경

```sh
(.venv) $ python manage.py runserver
```

## Test

```sh
(.venv) $ python manage.py test --keepdb
```
