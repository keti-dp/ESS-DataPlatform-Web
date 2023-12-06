# ESS DataPlatform Web

ESS(에너지 저장 장치) 데이터플랫폼 웹 프로젝트

## Prerequisite

- Ubuntu Linux 20.04LTS
- python3 (>=3.8)
- python3-venv
- python3-dev
- libpq-dev

## Installation

- 의존성 패키지 설치

```sh
$ cd ESS-DataPlatform-Web
$ python3 -m venv .venv
$ source .venv/bin/activate
(.venv) $ pip install -r requirements.txt
```

- 프로젝트 루트 디렉토리에 '.env' 파일 필요
  - DJANGO_SETTINGS_MODULE="your-dev-or-prod-settings-file-path"
  - SECRET_KEY="your-django-app-key"
  - DATABASES="your-databases-settings"
  - ...

## Run

- 기본 환경

```sh
(.venv) $ python manage.py runserver
```

- Docker 환경

```sh
root $ docker build -t web .
root $ docker run -i -p 8002:8002 web
```

## Test

- 다양한 데이터베이스를 사용하여 테스트 시간이 오래걸리므로 마이그레이션을 비활성화
  - 'django-test-without-migrations' 패키지 필요
  - '--nomigrations' 명령어를 추가로 입력

```sh
(.venv) $ python manage.py test --keepdb --nomigrations
```

...
