import { useEffect, useState } from "react";
import axios from "../api/axios";

function StatCard({ title, children }) {
  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h3 className="font-semibold text-gray-800 mb-3">{title}</h3>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function StatRow({ label, value }) {
  return (
    <div className="flex justify-between text-sm py-1 border-b last:border-b-0">
      <span className="text-gray-600">{label}</span>
      <span className="font-medium text-gray-900">{value}</span>
    </div>
  );
}

export default function Health() {
  const [health, setHealth] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [cbState, setCbState] = useState(null);

  const fetchHealth = async () => {
    try {
      const res = await axios.get("/health");
      setHealth(res.data);
      setMetrics(res.data.metrics ?? null);
    } catch {
      setHealth(null);
      setMetrics(null);
    }
  };

  const fetchCircuit = async () => {
    try {
      const res = await axios.get("/admin/circuitbreaker", {
        withCredentials: true
      });
      setCbState(res.data.state); // OPEN | CLOSED
    } catch (err) {
      if (err.response?.status === 503) {
        setCbState("OPEN");
      } else {
        setCbState(null);
      }
    }
  };

  useEffect(() => {
    fetchHealth();
    fetchCircuit();

    const healthInterval = setInterval(fetchHealth, 30000);
    const circuitInterval = setInterval(fetchCircuit, 15000);

    return () => {
      clearInterval(healthInterval);
      clearInterval(circuitInterval);
    };
  }, []);

  const isSystemDown = cbState === "OPEN";

  return (
    <div className="space-y-6">
      {isSystemDown && (
        <div className="bg-red-600 text-white p-4 rounded-xl font-bold text-center animate-pulse">
          🚨 SYSTEM DEGRADED — CIRCUIT BREAKER AKTİF
        </div>
      )}

      <div>
        <h1 className="text-3xl font-bold text-gray-800">System Health</h1>
        <p className="text-sm text-gray-500">
          Canlı sistem durumu ve performans metrikleri
        </p>
      </div>

      {!health && (
        <div className="text-gray-500">Veriler alınıyor…</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {health && (
          <StatCard title="Application">
            <StatRow label="Uptime" value={health.app_uptime ?? "-"} />
            <StatRow label="CPU (%)" value={health.cpu_usage_percent ?? "-"} />
            <StatRow
              label="RAM (MB)"
              value={`${health.ram_used_mb ?? "-"} / ${health.ram_total_mb ?? "-"}`}
            />
            <StatRow label="Goroutines" value={health.goroutine_count ?? "-"} />
            <StatRow label="WebSockets" value={health.active_websockets ?? "-"} />
          </StatCard>
        )}

        {health?.db_connection_stats && (
          <StatCard title="Database Pool">
            <StatRow label="Max Open" value={health.db_connection_stats.max_open_conns ?? "-"} />
            <StatRow label="Open" value={health.db_connection_stats.open_conns ?? "-"} />
            <StatRow label="In Use" value={health.db_connection_stats.in_use ?? "-"} />
            <StatRow label="Idle" value={health.db_connection_stats.idle ?? "-"} />
          </StatCard>
        )}

        {metrics && (
          <StatCard title="Traffic & Errors">
            <StatRow label="Total Requests" value={metrics.total_requests ?? "-"} />
            <StatRow label="Avg Response (ms)" value={metrics.avg_response_time_ms ?? "-"} />
            <StatRow label="Error Rate" value={metrics.error_rate ?? "-"} />
          </StatCard>
        )}

        <StatCard title="Circuit Breaker">
          <StatRow
            label="State"
            value={
              cbState
                ? cbState === "OPEN"
                  ? "❌ OPEN"
                  : "✅ CLOSED"
                : "-"
            }
          />
        </StatCard>
      </div>
    </div>
  );
}