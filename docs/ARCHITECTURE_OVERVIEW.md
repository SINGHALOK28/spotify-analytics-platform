# Spotify Analytics Platform: Architecture & Data Flow Overview

This document provides a high-level summary of the Spotify Analytics Platform. It explains the main components of the system, their responsibilities, and how they connect to deliver a seamless user experience.

---

## 1. The Core Components

The application follows a modern, decoupled architecture split into four primary pillars:

### A. The Data Pipeline (ETL & Airflow)
**What it does:** It acts as the engine that feeds data into the platform. It takes raw, messy data and turns it into clean, structured, and ML-ready information.
- **Apache Airflow:** Orchestrates the workflow on a schedule.
- **Extract, Transform, Load (ETL):** Python scripts (using `pandas` and `scikit-learn`) clean the raw Spotify CSV data, normalize numerical features, and establish relationships between tracks, artists, and genres.

### B. The Database (PostgreSQL via Neon)
**What it does:** The permanent, highly-structured storage system for the application.
- **Relational Structure:** Stores data across normalized tables (e.g., `tracks`, `artists`, `genres`, `users`). 
- **Cloud Hosted:** Hosted on Neon, making it accessible from anywhere and keeping the data persistent regardless of server restarts.

### C. The Backend API (FastAPI / Python)
**What it does:** Acts as the "brain" and the secure middleman of the application. The frontend never talks to the database directly; it asks the backend to do it.
- **REST Endpoints:** Exposes routes (like `/api/tracks/search` or `/api/analytics/top-tracks`) for the frontend to consume.
- **Machine Learning & AI:** Hosts the pre-trained Scikit-Learn model in memory to run real-time popularity predictions. It also executes complex matrix math (Cosine Similarity) for the AI recommendation engine.
- **Security:** Handles user registration, password hashing (bcrypt), and issues JWT (JSON Web Tokens) to secure protected routes.

### D. The Frontend UI (React / Vite)
**What it does:** The visual interface that the user interacts with in their browser.
- **React & Tailwind CSS:** Builds dynamic, interactive, and beautiful user interfaces.
- **State & Routing:** Manages what the user sees without reloading the page (Single Page Application). It handles temporary session storage for authentication.
- **Data Fetching:** Uses Axios to send requests across the internet to the backend API and renders the resulting JSON data into charts, lists, and forms.

---

## 2. Connected Workflows (How they talk to each other)

Here is how these components interact in real-world scenarios:

### Flow 1: Data Ingestion (The Setup)
Before a user even visits the site, data must be prepared.
1. **Airflow** triggers the daily `spotify_etl_dag`.
2. The **Python Pipeline** reads raw CSV data, normalizes the audio features, and scales the numbers.
3. The pipeline uses **SQLAlchemy** to connect to the **PostgreSQL Database** and safely inserts 100,000+ tracks, artists, and genres into their respective tables.

### Flow 2: A User Browses the Dashboard
When a user navigates to the Analytics Dashboard (`/dashboard`):
1. The **React Frontend** mounts the page components and immediately fires off HTTP GET requests (e.g., to `GET /api/analytics/feature-trends`).
2. The **FastAPI Backend** receives the request and asks the **Database** (via SQLAlchemy) to run complex SQL aggregations (averaging energy, danceability, etc., grouped by genre).
3. The **Database** returns the calculated numbers to the **Backend**.
4. The **Backend** formats these numbers into a clean JSON response and sends them back across the internet.
5. The **Frontend** receives the JSON and dynamically renders the interactive Recharts visualizations.

### Flow 3: A User Uses the AI Recommendation Engine
When a user logs in and wants custom song recommendations:
1. The **Frontend** gathers the user's custom audio feature settings (from the interactive sliders) and the target genre.
2. The **Frontend** attaches the user's secret JWT token and sends a `POST /api/recommendations/custom` request.
3. The **FastAPI Backend** verifies the JWT token. If valid, it queries the **Database** for thousands of candidate tracks.
4. The **Backend** converts the tracks into mathematical vectors and computes the **Cosine Similarity** between the user's custom settings and every track in the database to find the closest 10 matches.
5. The **Backend** returns the top 10 tracks as JSON.
6. The **Frontend** displays these tracks as interactive `TrackCards`.

### Flow 4: The Machine Learning Predictor
When an artist wants to predict if their new demo will be a hit:
1. The user inputs their song's tempo, energy, and danceability on the **Frontend** and clicks "Predict".
2. The **Frontend** sends this numerical array to the **Backend** via `POST /api/predict`.
3. The **Backend** feeds this array into the pre-loaded `model.pkl` (a Random Forest Classifier trained by the ETL pipeline).
4. The model instantly outputs a predicted popularity score (0-100).
5. The **Backend** returns the score to the **Frontend**, which animates a circular progress gauge to reveal the result to the user.
