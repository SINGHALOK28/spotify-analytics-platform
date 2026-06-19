# Deployment Documentation

## Live URLs
- **Frontend (Vercel):** https://spotify-analytics-platform.vercel.app
- **Backend API (Render):** https://spotify-analytics-platform.onrender.com
- **API Docs (Swagger):** https://spotify-analytics-platform.onrender.com/docs

## Architecture
Browser → Vercel CDN → React App → Render API → Neon PostgreSQL

## Deployment Process
- **Push to `main` branch** triggers automatic CI/CD:
  - Render auto-deploys backend (approx. 2 min)
  - Vercel auto-deploys frontend (approx. 90 sec)

## Environment Variables Required

### Backend (`.env`)
- `DATABASE_URL`: Connection string for Neon PostgreSQL database.
- `POSTGRES_USER`: Database username.
- `POSTGRES_PASSWORD`: Database password.
- `POSTGRES_DB`: Database name.
- `SECRET_KEY`: Secret key for JWT token generation and hashing.
- `ALGORITHM`: Algorithm used for JWT encoding (e.g., HS256).
- `ACCESS_TOKEN_EXPIRE_MINUTES`: Expiration time for JWT access tokens.
- `SPOTIFY_CLIENT_ID`: Spotify Developer App Client ID.
- `SPOTIFY_CLIENT_SECRET`: Spotify Developer App Client Secret.

### Frontend (`.env.production`)
- `VITE_API_URL`: The deployed URL of the Render backend API.

## Known Limitations
- **Render Free Tier:** Cold start requires 30–60 seconds after 15 minutes of idle time. The frontend handles this gracefully by displaying a "Waking up server" loading indicator.
- **Neon Free Tier:** Limited to 0.5 GB storage and 190 compute hours/month.
- **Airflow:** Currently configured to run locally via Docker (not deployed to cloud).

## Local Development
To spin up the entire stack locally:
```bash
docker compose up --build
```
