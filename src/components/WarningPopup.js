import React from 'react';
import { useDashboard } from '../context/DashboardContext';

export default function WarningPopup() {
  const { state, dispatch } = useDashboard();
  const { warnings } = state;

  if (warnings.length === 0) return null;

  const latestWarning = warnings[warnings.length - 1];

  const getSeverityStyle = (severity) => {
    switch (severity) {
      case 'error': return { bg: '#fef2f2', border: '#ef4444', icon: '🚨' };
      case 'warning': return { bg: '#fffbeb', border: '#f59e0b', icon: '⚠️' };
      case 'info': return { bg: '#eff6ff', border: '#3b82f6', icon: 'ℹ️' };
      default: return { bg: '#f0fdf4', border: '#22c55e', icon: '✅' };
    }
  };

  const style = getSeverityStyle(latestWarning.severity);

  return (
    <div className="warning-popup animate-slide-in">
      <div className="warning-popup-content" style={{ borderColor: style.border }}>
        <div className="warning-popup-header">
          <span className="warning-popup-icon">{style.icon}</span>
          <h4>{latestWarning.title}</h4>
          <button
            className="warning-popup-close"
            onClick={() => dispatch({ type: 'DISMISS_WARNING', payload: latestWarning.id })}
          >
            ✕
          </button>
        </div>
        <p>{latestWarning.message}</p>
        <div className="warning-popup-actions">
          <button
            className="btn btn-sm btn-primary"
            onClick={() => dispatch({ type: 'DISMISS_WARNING', payload: latestWarning.id })}
          >
            Acknowledge
          </button>
        </div>
      </div>
    </div>
  );
}
