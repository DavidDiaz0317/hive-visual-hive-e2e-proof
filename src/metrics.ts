export type Metrics = {
  activeJobs: number;
  gpuUtilization: number;
  queueDepth: number;
  energyEfficiency: number;
};

export const fallbackMetrics: Metrics = {
  activeJobs: 12,
  gpuUtilization: 87,
  queueDepth: 4,
  energyEfficiency: 91
};

export function percentage(value: number): string {
  if (!Number.isFinite(value) || value < 0 || value > 100) {
    throw new RangeError("percentage must be between 0 and 100");
  }
  return `${value}%`;
}
