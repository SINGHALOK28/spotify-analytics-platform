import pandas as pd
import logging

logger = logging.getLogger(__name__)

def transform_data(df: pd.DataFrame) -> pd.DataFrame:
    # Step A - Remove duplicates
    df = df.drop_duplicates(subset=["track_id"], keep="first").copy()
    
    # Step B - Handle missing values
    df = df.dropna(subset=["track_name", "artists", "track_genre"])
    numeric_cols = ["popularity", "duration_ms", "danceability", "energy", "key", 
                    "loudness", "mode", "speechiness", "acousticness", 
                    "instrumentalness", "liveness", "valence", "tempo", "time_signature"]
    for col in numeric_cols:
        if col in df.columns:
            df[col] = df[col].fillna(df[col].median())
            
    # Step C - Normalize column names
    df.columns = df.columns.str.lower().str.replace(" ", "_")
    
    # Step D - Validate and cast data types
    df["popularity"] = df["popularity"].astype(int)
    if df["explicit"].dtype == object:
        df["explicit"] = df["explicit"].astype(str).str.lower().map({"true": True, "false": False, "1": True, "0": False})
    df["explicit"] = df["explicit"].fillna(False).astype(bool)
    df["duration_ms"] = df["duration_ms"].astype(int)
    
    audio_features = ["danceability", "energy", "loudness", "speechiness", "acousticness", 
                      "instrumentalness", "liveness", "valence", "tempo"]
    for col in audio_features:
        if col in df.columns:
            df[col] = df[col].astype(float)
            
    # Step E - Engineer new columns (in exact order)
    df["duration_minutes"] = round(df["duration_ms"] / 60000, 2)
    
    def get_energy_level(energy):
        if energy < 0.4: return "Low"
        elif energy <= 0.7: return "Medium"
        else: return "High"
    df["energy_level"] = df["energy"].apply(get_energy_level)
    
    def get_danceability_level(danceability):
        if danceability < 0.4: return "Low"
        elif danceability <= 0.7: return "Medium"
        else: return "High"
    df["danceability_level"] = df["danceability"].apply(get_danceability_level)
    
    def get_tempo_category(tempo):
        if tempo < 90: return "Slow"
        elif tempo <= 140: return "Medium"
        else: return "Fast"
    df["tempo_category"] = df["tempo"].apply(get_tempo_category)
    
    def get_popularity_bucket(pop):
        if pop <= 30: return "Low"
        elif pop <= 60: return "Medium"
        elif pop <= 80: return "Popular"
        else: return "Hit"
    df["popularity_bucket"] = df["popularity"].apply(get_popularity_bucket)
    
    # Step F - Final validation
    critical_cols = ["track_id", "track_name", "artists", "track_genre"]
    if df[critical_cols].isnull().any().any():
        raise ValueError("Nulls remain in critical columns")
        
    if not df["popularity"].between(0, 100).all():
        raise ValueError("Popularity not between 0 and 100")
        
    normalized_audio_features = ["danceability", "energy", "speechiness", "acousticness", 
                                 "instrumentalness", "liveness", "valence"]
    for col in normalized_audio_features:
        if col in df.columns:
            if not df[col].between(-0.01, 1.01).all(): # tiny float tolerance
                raise ValueError(f"{col} not between 0 and 1")
                
    logger.info(f"Rows Transformed: {len(df)}")
    print(f"Data transformation complete. Survived rows: {len(df)}")
    return df
