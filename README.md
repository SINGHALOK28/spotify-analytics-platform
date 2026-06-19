# Spotify Analytics Platform

![Dashboard Screenshot Placeholder](/docs/dashboard-screenshot.png)

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

## Deployment Documentation
Please see [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md) for full architecture details, environment variables, and deployment instructions.
