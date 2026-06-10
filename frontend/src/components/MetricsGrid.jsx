import React from 'react';

export default function MetricsGrid({ metrics }) {
  const containerStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '24px',
    marginBottom: '32px',
    width: '100%',
    boxSizing: 'border-box'
  };

  const cardBaseStyle = {
    background: '#18181b',
    padding: '24px',
    borderRadius: '12px',
    border: '1px solid #27272a',
    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  };

  return (
    <div style={containerStyle}>
      <div style={{ ...cardBaseStyle, borderLeft: '4px solid #a1a1aa' }}>
        <div style={{ color: '#a1a1aa', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Total Evaluated Streams
        </div>
        <div style={{ fontSize: '38px', fontWeight: '700', marginTop: '12px', color: '#ffffff', fontFamily: 'monospace' }}>
          {metrics.total.toLocaleString()}
        </div>
        <div style={{ fontSize: '11px', color: '#52525b', marginTop: '6px' }}>Aggregate proxy operations count</div>
      </div>

      <div style={{ ...cardBaseStyle, borderLeft: '4px solid #4ade80', background: 'linear-gradient(180deg, #18181b 0%, #112419 100%)' }}>
        <div style={{ color: '#4ade80', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Passed Proxy Packets
        </div>
        <div style={{ fontSize: '38px', fontWeight: '700', marginTop: '12px', color: '#ffffff', fontFamily: 'monospace' }}>
          {metrics.allowed.toLocaleString()}
        </div>
        <div style={{ fontSize: '11px', color: '#22c55e', marginTop: '6px' }}>Legitimate operational tracking flows</div>
      </div>

      <div style={{ ...cardBaseStyle, borderLeft: '4px solid #f87171', background: 'linear-gradient(180deg, #18181b 0%, #2a1414 100%)' }}>
        <div style={{ color: '#f87171', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Mitigated Anomalies
        </div>
        <div style={{ fontSize: '38px', fontWeight: '700', marginTop: '12px', color: '#ffffff', fontFamily: 'monospace' }}>
          {metrics.blocked.toLocaleString()}
        </div>
        <div style={{ fontSize: '11px', color: '#ef4444', marginTop: '6px' }}>Dropped multi-request saturations</div>
      </div>
    </div>
  );
}
