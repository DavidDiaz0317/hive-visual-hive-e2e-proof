from dataclasses import asdict, dataclass


@dataclass(frozen=True)
class Metrics:
    active_jobs: int
    gpu_utilization: int
    queue_depth: int
    energy_efficiency: int

    def __post_init__(self) -> None:
        if self.active_jobs < 0 or self.queue_depth < 0:
            raise ValueError("job counts cannot be negative")
        for field_name in ("gpu_utilization", "energy_efficiency"):
            value = getattr(self, field_name)
            if not 0 <= value <= 100:
                raise ValueError(f"{field_name} must be between 0 and 100")

    def as_api_payload(self) -> dict[str, int]:
        values = asdict(self)
        return {
            "activeJobs": values["active_jobs"],
            "gpuUtilization": values["gpu_utilization"],
            "queueDepth": values["queue_depth"],
            "energyEfficiency": values["energy_efficiency"],
        }


def fallback_metrics() -> Metrics:
    return Metrics(
        active_jobs=12,
        gpu_utilization=87,
        queue_depth=4,
        energy_efficiency=91,
    )
