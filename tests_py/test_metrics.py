import pytest

from service.metrics import Metrics, fallback_metrics


def test_fallback_metrics_match_the_local_demo_contract() -> None:
    assert fallback_metrics().as_api_payload() == {
        "activeJobs": 12,
        "gpuUtilization": 87,
        "queueDepth": 4,
        "energyEfficiency": 91,
    }


@pytest.mark.parametrize("field", ["gpu_utilization", "energy_efficiency"])
def test_percentage_metrics_reject_values_above_one_hundred(field: str) -> None:
    values = {
        "active_jobs": 1,
        "gpu_utilization": 50,
        "queue_depth": 2,
        "energy_efficiency": 50,
    }
    values[field] = 101

    with pytest.raises(ValueError, match="must be between 0 and 100"):
        Metrics(**values)


def test_queue_depth_cannot_be_negative() -> None:
    with pytest.raises(ValueError, match="job counts cannot be negative"):
        Metrics(active_jobs=1, gpu_utilization=50, queue_depth=-1, energy_efficiency=50)
