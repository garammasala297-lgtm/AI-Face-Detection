import React from 'react';
import { useDashboard } from '../context/DashboardContext';

export default function InactivityAlert() {
  const { state, dispatch } = useDashboard();
  const { inactivityAlert } = state;

  if (!inactivityAlert) return null;

  return (
    <div className="inactivity-overlay">
      <div className="inactivity-modal animate-in">
        <div className="inactivity-icon">⏰</div>
        <h3>Inactivity Detected</h3>
        <p>{inactivityAlert.message}</p>
        <div className="inactivity-actions">
          <button
            className="btn btn-primary"
            onClick={() => dispatch({ type: 'DISMISS_INACTIVITY' })}
          >
            ✅ I'm Working on It
          </button>
          <button
            className="btn btn-outline"
            onClick={() => {
              dispatch({ type: 'DISMISS_INACTIVITY' });
              dispatch({
                type: 'ADD_TICKET',
                payload: {
                  title: 'Need help - triggered by inactivity alert',
                  category: 'technical',
                  description: 'We received an inactivity alert and would like mentor guidance on how to proceed.',
                },
              });
            }}
          >
            🎓 Request Mentor Help
          </button>
          <button
            className="btn btn-ghost"
            onClick={() => dispatch({ type: 'DISMISS_INACTIVITY' })}
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
