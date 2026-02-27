import React, { useState } from 'react';
import { useDashboard } from '../context/DashboardContext';

export default function BasicInfo() {
  const { state } = useDashboard();
  const { teamInfo } = state;
  const [copied, setCopied] = useState(false);

  const start = new Date(teamInfo.startTime);
  const end = new Date(teamInfo.endTime);
  const now = new Date();
  const totalDuration = end - start;
  const elapsed = Math.min(now - start, totalDuration);
  const progressPercent = state.hackathonEnded ? 100 : Math.max(0, Math.min(100, (elapsed / totalDuration) * 100));

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleString('en-US', {
      weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  const copyRepoLink = () => {
    navigator.clipboard.writeText(teamInfo.repoUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const hoursRemaining = state.hackathonEnded
    ? 0
    : Math.max(0, Math.ceil((end - now) / (1000 * 60 * 60)));

  return (
    <div className="section">
      <div className="section-header">
        <h2>📋 Basic Information</h2>
        <span className={`status-badge ${state.hackathonEnded ? 'status-ended' : 'status-active'}`}>
          {state.hackathonEnded ? '🏁 Ended' : '🟢 Active'}
        </span>
      </div>

      <div className="info-grid">
        <div className="info-card">
          <div className="info-card-icon">🏆</div>
          <div className="info-card-content">
            <label>Team Name</label>
            <p className="info-value">{teamInfo.teamName}</p>
          </div>
        </div>

        <div className="info-card">
          <div className="info-card-icon">🎯</div>
          <div className="info-card-content">
            <label>Hackathon</label>
            <p className="info-value">{teamInfo.hackathonName}</p>
          </div>
        </div>

        <div className="info-card">
          <div className="info-card-icon">⏱️</div>
          <div className="info-card-content">
            <label>Time Remaining</label>
            <p className="info-value">{state.hackathonEnded ? 'Completed' : `${hoursRemaining} hours`}</p>
          </div>
        </div>

        <div className="info-card">
          <div className="info-card-icon">👥</div>
          <div className="info-card-content">
            <label>Team Size</label>
            <p className="info-value">{teamInfo.members.length} Members</p>
          </div>
        </div>
      </div>

      <div className="card">
        <h3>📂 GitHub Repository</h3>
        <div className="repo-link-container">
          <a href={teamInfo.repoUrl} target="_blank" rel="noopener noreferrer" className="repo-link">
            {teamInfo.repoUrl}
          </a>
          <button className="btn btn-sm btn-outline" onClick={copyRepoLink}>
            {copied ? '✅ Copied!' : '📋 Copy'}
          </button>
          <a href={teamInfo.repoUrl} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-primary">
            🔗 Open Repo
          </a>
        </div>
      </div>

      <div className="card">
        <h3>⏰ Hackathon Timeline</h3>
        <div className="timeline-info">
          <div className="timeline-point">
            <span className="timeline-label">Start</span>
            <span className="timeline-date">{formatDate(teamInfo.startTime)}</span>
          </div>
          <div className="progress-bar-container">
            <div className="progress-bar" style={{ width: `${progressPercent}%` }}>
              <span className="progress-text">{progressPercent.toFixed(1)}%</span>
            </div>
          </div>
          <div className="timeline-point">
            <span className="timeline-label">End</span>
            <span className="timeline-date">{formatDate(teamInfo.endTime)}</span>
          </div>
        </div>
      </div>

      <div className="card">
        <h3>👥 Team Members</h3>
        <div className="members-grid">
          {teamInfo.members.map((member, idx) => (
            <div key={idx} className="member-card">
              <div className="member-avatar">{member.avatar}</div>
              <div className="member-info">
                <h4>{member.name}</h4>
                <p className="member-role">{member.role}</p>
                <a
                  href={`https://github.com/${member.github}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="member-github"
                >
                  @{member.github}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
