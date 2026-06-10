import React, { useState, useEffect, useCallback } from 'react';
import MetricsGrid from './components/MetricsGrid';

export default function App() {
  const [logs, setLogs] = useState([]);
  const [metrics, setMetrics] = useState({ total: 0, allowed: 0, blocked: 0 });
  const [connectionState, setConnectionState] = useState('DISCONNECTED');

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8000/ws/telemetry');
    setConnectionState('CONNECTING');

    socket.onopen = () => setConnectionState('ACTIVE');
    
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setLogs((prev) => [data, ...prev.slice(0, 19)]);
      setMetrics((m) => {
        const isBlocked = data.status === 'BLOCKED';
        return {
          total: m.total + 1,
          allowed: m.allowed + (isBlocked ? 0 : 1),
          blocked: m.blocked + (isBlocked ? 1 : 0),
        };
      });
    };

    socket.onclose = () => setConnectionState('DISCONNECTED');
    return () => socket.close();
  }, []);

  const triggerSpikeCluster = useCallback(async () => {
    const requests = Array.from({ length: 6 }, () => 
      fetch('http://localhost:8000/api/v1/data-stream').catch((err) => console.error("Network loop trace error:", err))
    );
    await Promise.all(requests);
  }, []);

  return (
    <div className="dashboard-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <header className="main-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #27272a', paddingBottom: '20px', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: '700', color: '#ffffff', margin: '0 0 6px 0' }}>Automated API Rate-Limiter Gateway Dashboard</h1>
          <p style={{ color: '#a1a1aa', margin: 0, fontSize: '14px' }}>Real-time low-overhead sliding window enforcement monitoring ledger configuration workspace</p>
        </div>
        <span style={{ fontSize: '12px', background: connectionState === 'ACTIVE' ? '#064e3b' : '#7f1d1d', color: connectionState === 'ACTIVE' ? '#4ade80' : '#f87171', padding: '6px 12px', borderRadius: '20px', fontFamily: 'monospace', fontWeight: 'bold' }}>
          SOCKET_STATUS: {connectionState}
        </span>
      </header>

      <MetricsGrid metrics={metrics} />

      <div style={{ margin: '32px 0' }}>
        <button onClick={triggerSpikeCluster} className="trigger-btn" style={{ background: '#ffffff', color: '#09090b', border: 'none', padding: '14px 28px', fontWeight: '600', borderRadius: '8px', cursor: 'pointer', transition: 'background 0.2s', fontSize: '14px' }}>
          Inject Real-time Load Vector Burst Sequence
        </button>
      </div>

      <div className="log-container" style={{ background: '#18181b', border: '1px solid #27272a', borderRadius: '12px', padding: '24px' }}>
        <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', color: '#f4f4f5' }}>Live Security Analytics Router Event Stream</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {logs.length === 0 ? (
            <p style={{ color: '#71717a', margin: 0, fontSize: '13px', fontFamily: 'monospace' }}>Awaiting structural boundary evaluations...</p>
          ) : logs.map(log => (
            <div key={log.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '14px', borderRadius: '6px', fontSize: '13px', background: log.status === 'BLOCKED' ? '#271c1c' : '#09090b', borderLeft: `4px solid ${log.status === 'BLOCKED' ? '#f87171' : '#4ade80'}` }}>
              <span><code>{log.ip}</code> ➔ <code style={{ color: '#38bdf8' }}>{log.path}</code></span>
              <strong>{log.status} ({log.count}/10)</strong>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
