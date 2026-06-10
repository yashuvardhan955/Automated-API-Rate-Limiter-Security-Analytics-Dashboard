from pydantic import BaseModel, Field, validator
import time

class TelemetryLogPayload(BaseModel):
    id: str = Field(
        ..., 
        description="Unique UUID string configuration signature identifying the trace packet execution bounds seamlessly."
    )
    timestamp: float = Field(
        ..., 
        description="Unix epoch execution fractional timestamp registering structural packet ingress intervals."
    )
    ip: str = Field(
        ..., 
        description="Remote source client IP address string parameter tracking structural infrastructure requests securely."
    )
    path: str = Field(
        ..., 
        description="Target routing path location endpoint processing incoming application data packages."
    )
    status: str = Field(
        ..., 
        description="Security mitigation proxy checkpoint determination outcome value vector: ALLOWED or BLOCKED."
    )
    count: int = Field(
        ..., 
        description="Aggregated atomic frequency computation value mapped within active token buckets."
    )

    @validator("status")
    def validate_enforcement_status_string(cls, value):
        normalized_status = value.upper()
        allowed_states = {"ALLOWED", "BLOCKED"}
        if normalized_status not in allowed_states:
            raise ValueError(f"Enforcement parameter state '{value}' falls outside expected array parameters.")
        return normalized_status

    @validator("timestamp")
    def check_temporal_bounds_consistency(cls, value):
        current_epoch_time = time.time()
        if value > current_epoch_time + 300:
            raise ValueError("Telemetry tracking timestamp registers chronological synchronization variations.")
        return value

    def to_serialized_dictionary_payload(self) -> dict:
        return {
            "id": self.id,
            "timestamp": self.timestamp,
            "ip_address_context": self.ip,
            "target_endpoint_routing_path": self.path,
            "proxy_enforcement_status": self.status,
            "sliding_window_saturation_index": self.count
        }
