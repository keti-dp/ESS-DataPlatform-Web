from flask import Flask, request, jsonify
import psycopg2
import docker
import json
import os
from psycopg2.extras import Json
import traceback
import logging
from concurrent.futures import ThreadPoolExecutor
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
app = Flask(__name__)

# Docker client 초기화
docker_client = docker.from_env()

# PostgreSQL 연결 설정 (민감 정보는 별도로 관리)
DB_NAME = "PUBLIC_DB"
USER = "postgres"
PASSWORD = "your_password"
HOST = "your_host"
PORT = "your_port"

# ThreadPoolExecutor를 사용하여 다중 클라이언트 요청을 처리
executor = ThreadPoolExecutor(max_workers=10)
def get_or_create_set_id_and_run_container(tag_set):
    try:
        # 데이터베이스 연결
        conn = psycopg2.connect(
            dbname=DB_NAME, user=USER, password=PASSWORD, host=HOST, port=PORT
        )
        cursor = conn.cursor()
        # 딕셔너리 형태의 tag_set을 Json 어댑터를 사용하여 JSON 문자열로 변환
        tag_set_json = Json(tag_set)
        # TAG_SET 값에 해당하는 SET_ID를 찾는 쿼리
        select_query = """
            SELECT "SET_ID" 
            FROM tag_combination_map
            WHERE "TAG_SET" = %s::jsonb
        """
        cursor.execute(select_query, (tag_set_json,))
        result = cursor.fetchone()
        if result:
            # TAG_SET이 존재하면 SET_ID 반환
            set_id = result[0]
            logger.info(f"기존 SET_ID 반환: {set_id}")
            run_container_flag = False
        else:
            # 해당 TAG_SET이 없으면 새로운 행을 삽입하여 SET_ID 자동 생성
            insert_query = """
                INSERT INTO tag_combination_map ("TAG_SET")
                VALUES (%s)
                RETURNING "SET_ID"
            """
            cursor.execute(insert_query, (tag_set_json,))
            result = cursor.fetchone()
            if result:
                set_id = result[0]
                conn.commit()
                logger.info(f"새로운 SET_ID 생성 및 반환: {set_id}")
                run_container_flag = True
            else:
                # INSERT 실패 시 예외 처리
                conn.rollback()
                raise Exception("데이터 삽입에 실패하였습니다.")
        cursor.close()
        conn.close()
        if run_container_flag:
            # Docker 컨테이너 실행
            image = "sos_container:latest"  # Docker 이미지 이름
            container_name = f"integrated_sos_{set_id}"  # 실행할 컨테이너 이름
            # 컨테이너 환경 변수 설정
            environment = {
                "TAG_SET": json.dumps(tag_set),
                "SET_ID": str(set_id),
            }
            return run_container(image, container_name, environment), set_id
        else:
            return {"status": "skipped", "message": "TAG_SET already exists."}, set_id
    except Exception as e:
        logger.error(f"오류 발생: {e}")
        traceback.print_exc()
        return {"status": "error", "message": str(e)}, None

# 컨테이너 실행 함수
def run_container(image, container_name, environment):
    try:
        # env_file의 내용을 읽어서 environment에 추가
        env_file_path = "/path/to/env/file"
        if os.path.exists(env_file_path):
            with open(env_file_path) as f:
                lines = f.readlines()
                env_vars = dict(
                    line.strip().split("=", 1) for line in lines if "=" in line
                )
                environment.update(env_vars)
        print(environment)
        container = docker_client.containers.run(
            image=image,
            name=container_name,
            environment=environment,  # 모든 환경 변수 추가
            detach=True,
        )
        return {"status": "success", "container_id": container.id}
    except docker.errors.DockerException as e:
        return {"status": "error", "message": str(e)}

# 웹훅 처리 엔드포인트
@app.route("/webhook", methods=["POST"])
def handle_webhook():
    # 웹훅으로 받은 JSON 데이터
    data = request.json
    # TAG_SET 파라미터 가져오기
    tag_set = data.get("tag_set")  # 요청에서 받는 TAG_SET 값 (리스트 형태)
    if not tag_set:
        return jsonify({"status": "error", "message": "TAG_SET not provided"}), 400
    # 비동기로 컨테이너 생성 작업 실행
    future = executor.submit(get_or_create_set_id_and_run_container, tag_set)
    result, set_id = future.result()
    if set_id is None:
        return (
            jsonify({"status": "error", "message": "DB error"}),
            500,
        )
    # 결과 반환, SET_ID 포함
    result["set_id"] = set_id
    return jsonify(result)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
