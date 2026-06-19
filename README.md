# Spotify Analytics Platform

[![Live Demo](https://img.shields.io/badge/Live_Demo-View_App-1DB954?style=for-the-badge&logo=spotify&logoColor=white)](https://spotify-analytics-platform.vercel.app)
[![CI Pipeline](https://github.com/SINGHALOK28/spotify-analytics-platform/actions/workflows/ci.yml/badge.svg)](https://github.com/SINGHALOK28/spotify-analytics-platform/actions/workflows/ci.yml)

<p align="center">
  <img src="docs/dashboard-screenshot.png" alt="Dashboard Screenshot" width="100%" />
</p>

### 🎥 Quick Video Tour
https://github.com/SINGHALOK28/spotify-analytics-platform/raw/main/docs/dashboard-screenrecording.mp4

> **Live URLs:**
> - **Frontend (Vercel):** [https://spotify-analytics-platform.vercel.app](https://spotify-analytics-platform.vercel.app)
> - **Backend API (Render):** [https://spotify-analytics-platform.onrender.com/docs](https://spotify-analytics-platform.onrender.com/docs)
> 
> *Note: The backend is hosted on Render's free tier. The first load may take 30-60 seconds if the server has been idle. Subsequent requests are fast.*

## Overview
This platform uncovers deep insights, predicts hit songs using Machine Learning, and explores track similarity.

## Tech Stack
- **Frontend:** React, Vite, Tailwind CSS, Framer Motion
- **Backend:** FastAPI, Python, SQLAlchemy, Scikit-Learn
- **Database:** PostgreSQL (Neon)
- **Data Pipeline:** Apache Airflow
- **Deployment:** Vercel (Frontend), Render (Backend API), Docker Compose (Local)

## Observability & CI/CD Architecture

### CI/CD Pipeline (GitHub Actions)
The project uses GitHub Actions to automate testing and building. The pipeline triggers on pushes and pull requests to `main`.
```mermaid
graph LR
    A[Push/PR to main] --> B(Backend CI)
    A --> C(Frontend CI)
    A --> D(Docker Validation)
    B --> E{Tests Pass?}
    C --> F{Build Succeeds?}
    D --> G{Images Build?}
```

### Logging Architecture
- **Centralized Logging:** All application events (auth, predictions, recommendations) and API requests are logged via standard Python logging.
- **Middleware:** A FastAPI `RequestLoggerMiddleware` logs incoming requests, methods, statuses, and response times.
- **Outputs:** Logs are streamed to the console and to `logs/app.log`.

### Monitoring Architecture
- **System Metrics:** A `system_metrics` table tracks daily aggregate counts of API requests, predictions, recommendations, and login events.
- **ETL Monitoring:** Airflow ETL runs are tracked in an `etl_logs` table, storing run durations, rows processed, and success/failure status.
- **Admin Dashboard:** A dedicated `/admin/monitoring` frontend page visualizes these metrics in real-time.

## Screenshots
### Dashboard
![Dashboard Screenshot](docs/dashboard-screenshot.png)

### Monitoring Dashboard
*(Placeholder for Monitoring Dashboard Screenshot)*
![Monitoring Screenshot](docs/monitoring-placeholder.png)

## Deployment Documentation
Please see [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md) for full architecture details, environment variables, and deployment instructions.
