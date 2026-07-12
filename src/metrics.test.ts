import { describe, expect, it } from "vitest";

import { fallbackMetrics, percentage } from "./metrics";

describe("metrics", () => {
  it("exposes the fallback metrics used when the API is unavailable", () => {
    expect(fallbackMetrics).toEqual({
      activeJobs: 12,
      gpuUtilization: 87,
      queueDepth: 4,
      energyEfficiency: 91
    });
  });

  it("formats valid percentages and rejects invalid values", () => {
    expect(percentage(87)).toBe("87%");
    expect(() => percentage(101)).toThrowError("percentage must be between 0 and 100");
  });
});
