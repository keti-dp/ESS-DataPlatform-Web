# ESS DataPlatform Web

ESS(에너지 저장 장치) 데이터플랫폼 웹 프로젝트

## Prerequisite
- Ubuntu Linux 20.04LTS
- python3 (>=3.8)
- python3-venv

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