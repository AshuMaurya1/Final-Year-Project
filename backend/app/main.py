"""
FastAPI Server Entrypoint.
Serves REST API, CORS middleware, and simulation endpoints for the Traffic Management System.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api.routes import router

app = FastAPI(
    title="AI-Based Traffic Congestion Prediction & Dynamic Signal Control System",
    description="AKGEC Final-Year Project: Real-time traffic monitoring, ML congestion prediction, and adaptive signal timing.",
    version="1.0.0"
)

# Enable CORS for local React development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api")

@app.get("/")
def root():
    return {
        "system": "AI-Based Traffic Congestion Prediction & Dynamic Signal Control System",
        "institution": "Ajay Kumar Garg Engineering College (AKGEC)",
        "status": "Online",
        "api_docs": "/docs",
        "endpoints": [
            "/api/intersection/status",
            "/api/intersection/observations",
            "/api/predictions",
            "/api/signals/decisions",
            "/api/metrics/comparison",
            "/api/metrics/analytics",
            "/api/model/performance",
            "/api/alerts",
            "/api/simulation/control"
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
