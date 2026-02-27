import React, { useState } from 'react';
import { useDashboard } from '../context/DashboardContext';

export default function TransparencyFlags() {
  const { state, dispatch } = useDashboard();
  const { flags } = state;
  const [justificationInputs, setJustificationInputs] = useState({});
  const [expandedFlag, setExpandedFlag] = useState(null);
  const [filter, setFilter] = useState('all');

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#3b82f6';
      default: return '#94a3b8';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'high': return '🔴';
      case 'medium': return '🟡';
      case 'low': return '🔵';
      default: return '⚪';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'pre-hackathon': return '⏰';
      case 'inactivity': return '😴';
      case 'location': return '📍';
      case 'contribution': return '⚖️';
      default: return '🚩';
    }
  };

  const handleSubmitJustification = (flagId) => {
    const text = justificationInputs[flagId];
    if (!text || text.trim() === '') return;
    dispatch({ type: 'SUBMIT_JUSTIFICATION', payload: { flagId, text: text.trim() } });
    setJustificationInputs((prev) => ({ ...prev, [flagId]: '' }));
  };

  const handleResolve = (flagId) => {
    dispatch({ type: 'RESOLVE_FLAG', payload: flagId });
  };

  const filteredFlags = flags.filter((f) => {
    if (filter === 'all') return true;
    if (filter === 'unresolved') return !f.resolved;
    if (filter === 'resolved') return f.resolved;
    return f.severity === filter;
  });

  return (
    <div className="section">
      <div className="section-header">
        <h2>🚩 Transparency & Flags</h2>
        <div className="flag-stats">
          <span className="flag-stat">Total: {flags.length}</span>
          <span className="flag-stat text-red">Unresolved: {flags.filter((f) => !f.resolved).length}</span>
          <span className="flag-stat text-green">Resolved: {flags.filter((f) => f.resolved).length}</span>
        </div>
      </div>

      <div className="filter-bar">
        {['all', 'unresolved', 'resolved', 'high', 'medium', 'low'].map((f) => (
          <button
            key={f}
            className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="flags-list">
        {filteredFlags.map((flag) => (
          <div
            key={flag.id}
            className={`flag-card ${flag.resolved ? 'flag-resolved' : ''}`}
            style={{ borderLeftColor: getSeverityColor(flag.severity) }}
          >
            <div className="flag-header" onClick={() => setExpandedFlag(expandedFlag === flag.id ? null : flag.id)}>
              <div className="flag-title-row">
                <span className="flag-type-icon">{getTypeIcon(flag.type)}</span>
                <h4>{flag.title}</h4>
                <span className="severity-badge" style={{ background: getSeverityColor(flag.severity) }}>
                  {getSeverityIcon(flag.severity)} {flag.severity.toUpperCase()}
                </span>
                {flag.resolved && <span className="resolved-badge">✅ Resolved</span>}
              </div>
              <button className="expand-btn">
                {expandedFlag === flag.id ? '▲' : '▼'}
              </button>
            </div>

            <p className="flag-description">{flag.description}</p>
            <p className="flag-timestamp">
              Detected: {new Date(flag.timestamp).toLocaleString()}
            </p>

            {expandedFlag === flag.id && (
              <div className="flag-details animate-in">
                <div className="flag-reason">
                  <h5>📝 Reason for Flag</h5>
                  <p>{flag.description}</p>
                </div>

                {flag.justification ? (
                  <div className="justification-submitted">
                    <h5>📄 Submitted Justification</h5>
                    <p className="justification-text">{flag.justification}</p>
                    <span className="justification-status">
                      Status: {flag.justificationStatus === 'submitted' ? '📨 Under Review' : '✅ Accepted'}
                    </span>
                  </div>
                ) : (
                  !flag.resolved && (
                    <div className="justification-form">
                      <h5>Submit Justification</h5>
                      <p className="form-hint">
                        Explain the reason (e.g., offline brainstorming, design work, technical issues)
                      </p>
                      <textarea
                        className="justification-input"
                        placeholder="Enter your justification here..."
                        value={justificationInputs[flag.id] || ''}
                        onChange={(e) =>
                          setJustificationInputs((prev) => ({ ...prev, [flag.id]: e.target.value }))
                        }
                        rows={3}
                      />
                      <div className="justification-actions">
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => handleSubmitJustification(flag.id)}
                          disabled={!justificationInputs[flag.id]?.trim()}
                        >
                          📤 Submit Justification
                        </button>
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={() => handleResolve(flag.id)}
                        >
                          ✅ Mark as Resolved
                        </button>
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        ))}

        {filteredFlags.length === 0 && (
          <div className="empty-state">
            <span className="empty-icon">🎉</span>
            <p>No flags match the selected filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}
