import logging
import os

import kfp
import requests

from django.apps import apps
from django.conf import settings

from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.interval import IntervalTrigger
from django_apscheduler.jobstores import register_events, DjangoJobStore


logger = logging.getLogger(__name__)

KUBERFLOW_HOST = os.getenv("KUBEFLOW_HOST")
KUBEFLOW_USERNAME = os.getenv("KUBEFLOW_USERNAME")
KUBEFLOW_PASSWORD = os.getenv("KUBEFLOW_PASSWORD")
KUBEFLOW_NAMESPACE = os.getenv("KUBEFLOW_NAMESPACE")

SCHEDULER_INTERVAL_TIME_HOURS = 23


def refresh_simulation_job():
    # Refresh kubeflow client session

    session = requests.Session()
    response = session.get(KUBERFLOW_HOST)

    headers = {
        "Content-Type": "application/x-www-form-urlencoded",
    }

    user_data = {"login": KUBEFLOW_USERNAME, "password": KUBEFLOW_PASSWORD}
    session.post(response.url, headers=headers, data=user_data)
    session_cookie = session.cookies.get_dict()["authservice_session"]

    kubeflow_new_client = kfp.Client(
        host=f"{KUBERFLOW_HOST}/pipeline",
        namespace=f"{KUBEFLOW_NAMESPACE}",
        cookies=f"authservice_session={session_cookie}",
    )

    apps.get_app_config("simulation").kubeflow_client = kubeflow_new_client


def start():
    scheduler = BackgroundScheduler(timezone=settings.TIME_ZONE)
    scheduler.add_jobstore(DjangoJobStore(), "default")
    register_events(scheduler)

    scheduler.add_job(
        refresh_simulation_job,
        trigger=IntervalTrigger(hours=SCHEDULER_INTERVAL_TIME_HOURS),
        id="refresh_simulation_job",
        max_instances=1,
        replace_existing=True,
    )
    logger.info("Added job 'my_job_a'.")

    try:
        logger.info("Starting scheduler...")
        scheduler.start()
    except KeyboardInterrupt:
        logger.info("Stopping scheduler...")
        scheduler.shutdown()
        logger.info("Scheduler shut down successfully!")
