import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";

const metricsPayload = {
  activeJobs: 12,
  gpuUtilization: 87,
  queueDepth: 4,
  energyEfficiency: 91
};

function deterministicMetricsApi(): Plugin {
  const respond = (
    request: { url?: string },
    response: { statusCode: number; setHeader(name: string, value: string): void; end(body: string): void },
    next: () => void
  ) => {
    if (request.url?.split("?")[0] !== "/api/metrics") {
      next();
      return;
    }

    response.statusCode = 200;
    response.setHeader("content-type", "application/json; charset=utf-8");
    response.setHeader("cache-control", "no-store");
    response.end(JSON.stringify(metricsPayload));
  };

  return {
    name: "deterministic-local-metrics-api",
    configureServer(server) {
      server.middlewares.use(respond);
    },
    configurePreviewServer(server) {
      server.middlewares.use(respond);
    }
  };
}

export default defineConfig({
  plugins: [react(), deterministicMetricsApi()],
  build: {
    sourcemap: true
  }
});
