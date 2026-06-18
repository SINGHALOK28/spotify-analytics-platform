import pandas as pd
import os

def extract_data(file_path: str = None):
    if file_path is None:
        # Resolve absolute path relative to this file
        current_dir = os.path.dirname(os.path.abspath(__file__))
        file_path = os.path.join(current_dir, "..", "data", "raw", "spotify_tracks.csv")
    
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"CSV file not found at path: {file_path}")
    
    # Read only 1,000 rows for faster pipeline runs and to prevent database connection timeouts
    df = pd.read_csv(file_path, nrows=1000)
    row_count = len(df)
    print(f"Extracted {row_count} rows from {file_path}")
    return df, row_count
