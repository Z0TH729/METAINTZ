from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="METAINTZ API",
    description="Authorized file metadata inspection API.",
    version="0.1.0",
)

# Development origins only. Restrict this list before production deployment.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5500", "http://localhost:5500"],
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)


@app.get("/api/health")
def health_check() -> dict[str, str]:
    """Return a basic status response for local development checks."""
    return {"status": "ok", "application": "METAINTZ", "version": "0.1.0"}
