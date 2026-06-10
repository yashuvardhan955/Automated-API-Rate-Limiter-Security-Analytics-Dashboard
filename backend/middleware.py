import time
import uuid
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
from typing import Dict, List, Any

class AegisRateLimiterMiddleware(BaseHTTPMiddleware):
    def __init__(self, app: Any, window_seconds: int, max_requests: int, connection_manager: Any, traffic_history: Dict[str, List[float]]):
        super().__init__(app)
        self.window_seconds = window_seconds
        self.max_requests = max_requests
        self.manager = connection_manager
        self.traffic_history = traffic_history

    async def dispatch(self, request: Request, call_next: Any) -> Response:
        # Exclude active WebSocket routing boundaries from sliding frame logic calculations
        if request.url.path.startswith("/ws") or request.url.path == "/favicon.ico":
            return await call_next(request)

        client_ip = request.client.host if request.client else "127.0.0.1"
        current_execution_epoch = time.time()

        if client_ip not in self.traffic_history:
            self.traffic_history[client_ip] = []

        # Perform atomic baseline collection cleanup to prune expired entries
        active_window_history = self.traffic_history[client_ip]
        cleaned_history = [t for t in active_window_history if current_execution_epoch - t < self.window_seconds]
        self.traffic_history[client_ip] = cleaned_history

        if len(cleaned_history) >= self.max_requests:
            block_telemetry_payload = {
                "id": str(uuid.uuid4()),
                "timestamp": current_execution_epoch,
                "ip": client_ip,
                "path": request.url.path,
                "status": "BLOCKED",
                "count": len(cleaned_history) + 1
            }
            await self.manager.broadcast_telemetry(block_telemetry_payload)
            
            return Response(
                content="Rate Limit Exceeded - Automated AegisFlow Mitigation Layer Active", 
                status_code=429,
                headers={"X-RateLimit-Limit": str(self.max_requests), "X-RateLimit-Remaining": "0"}
            )

        self.traffic_history[client_ip].append(current_execution_epoch)
        allow_telemetry_payload = {
            "id": str(uuid.uuid4()),
            "timestamp": current_execution_epoch,
            "ip": client_ip,
            "path": request.url.path,
            "status": "ALLOWED",
            "count": len(self.traffic_history[client_ip])
        }
        await self.manager.broadcast_telemetry(allow_telemetry_payload)
        
        response = await call_next(request)
        response.headers["X-RateLimit-Limit"] = str(self.max_requests)
        response.headers["X-RateLimit-Remaining"] = str(self.max_requests - len(self.traffic_history[client_ip]))
        return response
