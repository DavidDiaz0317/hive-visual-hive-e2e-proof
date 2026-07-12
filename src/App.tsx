import { useEffect, useState } from "react";
import { fallbackMetrics, percentage, type Metrics } from "./metrics";

const jobs = [
  { id: "sim-1042", workload: "Climate ensemble", cluster: "Atlas", state: "Running", progress: "72%" },
  { id: "train-883", workload: "Materials model", cluster: "Orion", state: "Running", progress: "41%" },
  { id: "viz-219", workload: "Flow rendering", cluster: "Atlas", state: "Queued", progress: "Pending" }
] as const;

function useMetrics() {
  const [metrics, setMetrics] = useState<Metrics>(fallbackMetrics);
  const [requestError, setRequestError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    void fetch("/api/metrics", { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`Metrics request failed with status ${response.status}`);
        }
        return (await response.json()) as Metrics;
      })
      .then((payload) => {
        setMetrics(payload);
        setRequestError("");
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        setMetrics(fallbackMetrics);
        setRequestError(error instanceof Error ? error.message : "Metrics request failed");
      });

    return () => controller.abort();
  }, []);

  return { metrics, requestError };
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-shell">
      <header className="topbar" data-testid="app-header">
        <a className="brand" href="/" aria-label="HPC Operations home">
          <span className="brand-mark" aria-hidden="true">H</span>
          <span>
            <strong>HPC Operations</strong>
            <small>Unified compute control</small>
          </span>
        </a>
        <nav aria-label="Primary navigation">
          <a href="/" aria-current={window.location.pathname === "/" ? "page" : undefined}>Overview</a>
          <a href="/jobs" aria-current={window.location.pathname === "/jobs" ? "page" : undefined}>Jobs</a>
        </nav>
        <span className="environment-badge" data-testid="environment-badge">Production mirror</span>
      </header>
      <main>{children}</main>
      <footer>
        <span>Deterministic demo data</span>
        <span>Last synchronized 09:30 UTC</span>
      </footer>
    </div>
  );
}

function Dashboard() {
  const { metrics, requestError } = useMetrics();
  const cards = [
    { label: "Active jobs", value: String(metrics.activeJobs), detail: "Across 2 clusters" },
	{ label: "GPU utilization", value: percentage(metrics.gpuUtilization), detail: "Within target band" },
    { label: "Queue depth", value: String(metrics.queueDepth), detail: "Median wait 6 min" },
	{ label: "Energy efficiency", value: percentage(metrics.energyEfficiency), detail: "Up 3% this week" }
  ];

  return (
    <Shell>
      <section className="page" data-testid="dashboard-page">
        <div className="page-heading">
          <div>
            <p className="eyebrow">Fleet overview</p>
            <h1>Compute health at a glance</h1>
            <p>Capacity, throughput, and job movement from a deterministic local data source.</p>
          </div>
          <a className="primary-action" href="/jobs" data-testid="critical-action-button">Review jobs</a>
        </div>

        {requestError ? (
          <p className="sr-only" role="status" data-testid="metrics-error-marker">{requestError}</p>
        ) : null}

        <div className="metric-grid" data-testid="metric-grid">
          {cards.map((card) => (
            <article className="metric-card" data-testid="dashboard-card" key={card.label}>
              <span>{card.label}</span>
              <strong>{card.value}</strong>
              <small>{card.detail}</small>
            </article>
          ))}
        </div>

        <div className="dashboard-grid">
          <section className="panel" aria-labelledby="throughput-title">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Throughput</p>
                <h2 id="throughput-title">Seven-day workload trend</h2>
              </div>
              <span className="healthy-pill">Healthy</span>
            </div>
            <div className="chart" role="img" aria-label="Workload throughput is stable between 64 and 91 completed jobs">
              {[64, 70, 68, 82, 76, 91, 87].map((value, index) => (
                <div className="bar-group" key={value + index}>
                  <span className="bar" style={{ height: `${value}%` }} />
                  <small>{["M", "T", "W", "T", "F", "S", "S"][index]}</small>
                </div>
              ))}
            </div>
          </section>

          <aside className="panel" aria-labelledby="alerts-title">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Operations</p>
                <h2 id="alerts-title">Attention queue</h2>
              </div>
            </div>
            <ul className="attention-list">
              <li><span className="status-dot warning" />Atlas maintenance window <strong>18:00</strong></li>
              <li><span className="status-dot good" />Orion checkpoint health <strong>Nominal</strong></li>
              <li><span className="status-dot good" />Storage replication <strong>Complete</strong></li>
            </ul>
          </aside>
        </div>
      </section>
    </Shell>
  );
}

function Jobs() {
  return (
    <Shell>
      <section className="page" data-testid="jobs-page">
        <div className="page-heading">
          <div>
            <p className="eyebrow">Scheduler</p>
            <h1>Workload jobs</h1>
            <p>Current queue state across Atlas and Orion.</p>
          </div>
          <button className="secondary-action" type="button">New workload</button>
        </div>
        <section className="panel jobs-panel" aria-labelledby="jobs-title">
          <div className="panel-heading">
            <h2 id="jobs-title">Active queue</h2>
            <span className="healthy-pill">3 visible</span>
          </div>
          <div className="table-scroll">
            <table data-testid="jobs-table">
              <thead>
                <tr><th scope="col">Job</th><th scope="col">Workload</th><th scope="col">Cluster</th><th scope="col">State</th><th scope="col">Progress</th></tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job.id}>
                    <th scope="row">{job.id}</th>
                    <td>{job.workload}</td>
                    <td>{job.cluster}</td>
                    <td><span className={`job-state ${job.state.toLowerCase()}`}>{job.state}</span></td>
                    <td>{job.progress}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </section>
    </Shell>
  );
}

function NotFound() {
  return (
    <Shell>
      <section className="page empty-page">
        <p className="eyebrow">404</p>
        <h1>Route not found</h1>
        <a className="primary-action" href="/">Return to overview</a>
      </section>
    </Shell>
  );
}

export function App() {
  if (window.location.pathname === "/") return <Dashboard />;
  if (window.location.pathname === "/jobs") return <Jobs />;
  return <NotFound />;
}
