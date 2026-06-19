import time
from datetime import datetime
from etl.extract import extract_data
from etl.transform import transform_data
from etl.load import load_data
import logging

logger = logging.getLogger(__name__)

def run_etl():
    logger.info("Starting ETL pipeline...")
    print("Starting ETL pipeline...")
    start_time_dt = datetime.utcnow()
    start_time = time.time()
    
    try:
        # Extract
        df_raw, row_count_extracted = extract_data()
        
        # Transform
        df_clean = transform_data(df_raw)
        
        # Load
        records_loaded = load_data(df_clean, start_time_dt, row_count_extracted)
        
        end_time = time.time()
        duration = end_time - start_time
        logger.info(f"ETL completed. {records_loaded} records loaded in {duration:.2f} seconds.")
        print(f"ETL completed. {records_loaded} records loaded in {duration:.2f} seconds.")
    except Exception as e:
        logger.error(f"ETL failed: {e}")
        print(f"ETL failed: {e}")

if __name__ == "__main__":
    run_etl()
