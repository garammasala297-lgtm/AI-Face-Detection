import React from 'react';
import { useDashboard } from '../context/DashboardContext';

const navItems = [
  { id: 'basic-info', label: 'Basic Information', icon: '📋' },
  { id: 'commit-activity', label: 'Commit Activity', icon: '📊' },
  { id: 'location-compliance', label: 'Location Compliance', icon: '📍' },
  { id: 'contribution-breakdown', label: 'Contributions', icon: '👥' },
  { id: 'fairness-indicator', label: 'Fairness Indicator', icon: '⚖️' },
  { id: 'transparency-flags', label: 'Transparency & Flags', icon: '🚩' },
  { id: 'mentor-help', label: 'Mentor Help Tickets', icon: '🎓' },
  { id: 'learning-summary', label: 'Learning Summary', icon: '📚' },
];

export default function Sidebar({ activeSection, setActiveSection, onShowRules }) {
  const { state, dispatch } = useDashboard();
  const unresolvedFlags = state.flags.filter((f) => !f.resolved).length;
  const openTickets = state.tickets.filter((t) => t.status === 'open' || t.status === 'in-progress').length;

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="team-avatar">🚀</div>
        <h2>{state.teamInfo.teamName}</h2>
        <p className="hackathon-badge">{state.teamInfo.hackathonName}</p>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
            onClick={() => setActiveSection(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
            {item.id === 'transparency-flags' && unresolvedFlags > 0 && (
              <span className="badge badge-warning">{unresolvedFlags}</span>
            )}
            {item.id === 'mentor-help' && openTickets > 0 && (
              <span className="badge badge-info">{openTickets}</span>
            )}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="btn btn-outline btn-sm btn-full" onClick={onShowRules}>
          📜 View Rules
        </button>
        <button
          className="btn btn-sm btn-full"
          style={{ marginTop: '8px', background: state.hackathonEnded ? '#22c55e' : '#6366f1' }}
          onClick={() => dispatch({ type: 'TOGGLE_HACKATHON_ENDED' })}
        >
          {state.hackathonEnded ? '🔄 Simulate Active' : '🏁 Simulate Ended'}
        </button>
      </div>
    </aside>
  );
}
