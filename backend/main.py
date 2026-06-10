from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict
import uvicorn
import asyncio

from middleware import AegisRateLimiterMiddleware

app = FastAPI(
    title="Automated API Rate-Limiter Gateway Infrastructure",
    description="Asynchronous core proxy infrastructure orchestrating packet filtration matrices.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TelemetryConnectionManager:
    def __init__(self):
        self.active_sockets: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_sockets.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_sockets:
            self.active_sockets.remove(websocket)

    async def broadcast_telemetry(self, data: dict):
        for socket in self.active_sockets:
            try:
                await socket.send_json(data)
            except Exception:
                # Silently prune disconnected socket frames during thread broadcasts
                pass

manager = TelemetryConnectionManager()
global_traffic_history_store: Dict[str, List[float]] = {}

app.add_middleware(
    AegisRateLimiterMiddleware,
    window_seconds=60,
    max_requests=10,
    connection_manager=manager,
    traffic_history=global_traffic_history_store
)

@app.get("/api/v1/data-stream")
async def sample_endpoint_resource_payload():
    await asyncio.sleep(0.02)  # Simulate small database I/O overhead latency
    return {"status": "success", "message": "Transactional log packets securely processed."}

@app.websocket("/ws/telemetry")
async def socket_tunnel_registration_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # Persistent background keep-alive monitoring ring
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
