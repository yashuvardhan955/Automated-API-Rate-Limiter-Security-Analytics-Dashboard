# Automated-API-Rate-Limiter-Security-Analytics-Dashboard
An enterprise-grade, real-time web traffic monitoring control center built to manage sub-millisecond API rate enforcement paired with low-overhead client-side telemetry visualization layers.

Business Utility and Frontend Focus:

High-Frequency Telemetry UI: This project functions as a responsive data visualization platform that processes rapid incoming security alert streams without causing interface frame drops.

Bi-Directional Event Logs: Leverages persistent browser WebSocket connections to ingest packet metrics directly into the React component state tree, dropping traditional resource-heavy REST polling patterns entirely.

Project Structure :
    
    ├── backend/
    │   ├── main.py
    │   ├── middleware.py
    │   └── schemas.py
    └── frontend/
    ├── src/
    │   ├── components/
    │   │   └── MetricsGrid.jsx
    │   └── App.jsx
    └── index.html

Core Technical Features:

1.Sliding-Window Aggregator: Custom non-blocking security proxy middleware engineered in Python 3.12 and FastAPI that evaluates remote client IP pools within continuous 60-second windows.

2.Interactive Control Elements: Features a manual load injector element to intentionally test firewall threshold margins, displaying automated visual indicator metrics instantly upon mitigation triggers.

Local Installation and Setup:

Backend Environment:

1.Navigate to the backend directory and set up your dependencies:
cd backend
pip install fastapi uvicorn pydantic starlette

2.Launch the asynchronous engine proxy gateway:
python main.py

Frontend Workspace:

1.Navigate to the frontend workspace directory and install packages:
cd ../frontend
npm install

2.Fire up the local development preview runtime:
npm run dev
