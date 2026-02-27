import React, { useState } from 'react';
import { useDashboard } from '../context/DashboardContext';

export default function LocationCompliance() {
  const { state } = useDashboard();
  const { locationData } = state;
  const [showRulesDetail, setShowRulesDetail] = useState(false);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'on-site': return '✅';
      case 'mixed': return '⚠️';
      case 'off-site': return '❌';
      default: return '❓';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'on-site': return '#22c55e';
      case 'mixed': return '#f59e0b';
      case 'off-site': return '#ef4444';
      default: return '#94a3b8';
    }
  };

  const getComplianceLevel = (pct) => {
    if (pct >= 90) return { label: 'Excellent', color: '#22c55e', icon: '✅' };
    if (pct >= 70) return { label: 'Acceptable', color: '#f59e0b', icon: '⚠️' };
    return { label: 'Non-Compliant', color: '#ef4444', icon: '❌' };
  };

  const overall = getComplianceLevel(locationData.compliancePercentage);

  return (
    <div className="section">
      <div className="section-header">
        <h2>📍 Location Compliance</h2>
        <span
          className="status-indicator"
          style={{ background: getStatusColor(locationData.status) }}
        >
          {getStatusIcon(locationData.status)} {locationData.status.toUpperCase()}
        </span>
      </div>

      <div className="stats-row">
        <div className="stat-card stat-success">
          <div className="stat-number">{locationData.onSiteCommits}</div>
          <div className="stat-label">On-Site Commits</div>
        </div>
        <div className="stat-card stat-warning">
          <div className="stat-number">{locationData.offSiteCommits}</div>
          <div className="stat-label">Off-Site Commits</div>
        </div>
        <div className="stat-card" style={{ borderColor: overall.color }}>
          <div className="stat-number" style={{ color: overall.color }}>
            {locationData.compliancePercentage}%
          </div>
          <div className="stat-label">Compliance Rate</div>
          <div className="stat-sub">{overall.icon} {overall.label}</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header-row">
          <h3>📊 Per-Member Location Breakdown</h3>
        </div>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Member</th>
                <th>On-Site</th>
                <th>Off-Site</th>
                <th>Compliance</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {locationData.locations.map((loc, idx) => {
                const level = getComplianceLevel(loc.compliance);
                return (
                  <tr key={idx}>
                    <td><strong>{loc.member}</strong></td>
                    <td className="text-green">{loc.onSite}</td>
                    <td className="text-red">{loc.offSite}</td>
                    <td>
                      <div className="mini-progress">
                        <div className="mini-progress-fill" style={{ width: `${loc.compliance}%`, background: level.color }}></div>
                        <span>{loc.compliance.toFixed(1)}%</span>
                      </div>
                    </td>
                    <td>
                      <span className="status-pill" style={{ background: level.color }}>
                        {level.icon} {level.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <div className="card-header-row">
          <h3>🔒 Geo-Fencing Rules</h3>
          <button
            className="btn btn-sm btn-outline"
            onClick={() => setShowRulesDetail(!showRulesDetail)}
          >
            {showRulesDetail ? 'Hide Details' : 'Show Details'}
          </button>
        </div>
        <div className="rules-summary">
          {locationData.geofenceRules.map((rule, idx) => (
            <div key={idx} className="rule-item">
              <span className="rule-bullet">📌</span>
              <span>{rule}</span>
            </div>
          ))}
        </div>
        {showRulesDetail && (
          <div className="rules-detail animate-in">
            <div className="detail-box">
              <h4>Geo-fence Configuration</h4>
              <p><strong>Center:</strong> Hackathon Venue - Convention Center Hall A</p>
              <p><strong>Radius:</strong> 500 meters</p>
              <p><strong>Tolerance:</strong> 10% off-site commits allowed</p>
              <p><strong>Verification:</strong> IP geolocation + GPS metadata from commit tools</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
