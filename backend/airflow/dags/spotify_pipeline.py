import os
import sys
from datetime import datetime, timedelta
from airflow import DAG
from airflow.operators.python import PythonOperator

# Add the backend path to sys.path so modules can be imported
sys.path.insert(0, '/opt/airflow/backend')

default_args = {
    'owner': 'airflow',
    'retries': 3,
    'retry_delay': timedelta(minutes=5),
    'email_on_failure': True,
    'email_on_retry': False,
}

def run_extract(**kwargs):
    from etl.extract import extract_data
    df, count = extract_data()
    return count  # automatically pushed to XCom

def run_transform(**kwargs):
    from etl.extract import extract_data
    from etl.transform import transform_data
    
    # Read fresh data
    df_raw, _ = extract_data()
    df_clean = transform_data(df_raw)
    
    # Save the transformed data to a temporary file for the load task
    # Since Airflow tasks run in separate processes, they cannot share DataFrames in memory.
    interim_path = '/opt/airflow/backend/data/clean_data.csv'
    os.makedirs(os.path.dirname(interim_path), exist_ok=True)
    df_clean.to_csv(interim_path, index=False)

def run_load(**kwargs):
    import pandas as pd
    from etl.load import load_data
    
    ti = kwargs['ti']
    extracted_count = ti.xcom_pull(task_ids='extract_task')
    
    # Load the cleaned data from the intermediate file
    interim_path = '/opt/airflow/backend/data/clean_data.csv'
    df_clean = pd.read_csv(interim_path)
    
    load_data(df_clean, datetime.utcnow(), extracted_count)

def run_train(**kwargs):
    from app.ml.train import train_model
    train_model()

with DAG(
    dag_id='spotify_daily_pipeline',
    default_args=default_args,
    schedule_interval='@daily',
    start_date=datetime.utcnow() - timedelta(days=1),
    catchup=False,
    max_active_runs=1,
) as dag:

    extract_task = PythonOperator(
        task_id='extract_task',
        python_callable=run_extract
    )

    transform_task = PythonOperator(
        task_id='transform_task',
        python_callable=run_transform
    )

    load_task = PythonOperator(
        task_id='load_task',
        python_callable=run_load
    )

    train_model_task = PythonOperator(
        task_id='train_model_task',
        python_callable=run_train
    )

    # Task dependencies
    extract_task >> transform_task >> load_task >> train_model_task
