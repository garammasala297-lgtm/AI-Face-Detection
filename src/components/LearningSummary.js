import React, { useState } from 'react';
import { useDashboard } from '../context/DashboardContext';

export default function LearningSummary() {
  const { state } = useDashboard();
  const { learningSummary, hackathonEnded } = state;
  const [activeTab, setActiveTab] = useState('strengths');

  if (!hackathonEnded) {
    return (
      <div className="section">
        <div className="section-header">
          <h2>📚 Learning Summary</h2>
        </div>
        <div className="locked-section">
          <div className="lock-icon">🔒</div>
          <h3>Available After Hackathon Ends</h3>
          <p>
            The learning summary with feedback, strengths, and improvement suggestions
            will be available once the hackathon concludes.
          </p>
          <p className="hint-text">
            💡 Use the "Simulate Ended" button in the sidebar to preview this section.
          </p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'strengths', label: '💪 Strengths', icon: '💪' },
    { id: 'improvements', label: '📈 Improvements', icon: '📈' },
    { id: 'collaboration', label: '🤝 Collaboration', icon: '🤝' },
  ];

  const getTabContent = () => {
    switch (activeTab) {
      case 'strengths':
        return learningSummary.strengths.map((item, idx) => (
          <div key={idx} className="feedback-item feedback-strength">
            <span className="feedback-icon">✅</span>
            <p>{item}</p>
          </div>
        ));
      case 'improvements':
        return learningSummary.improvements.map((item, idx) => (
          <div key={idx} className="feedback-item feedback-improvement">
            <span className="feedback-icon">💡</span>
            <p>{item}</p>
          </div>
        ));
      case 'collaboration':
        return learningSummary.collaborationInsights.map((item, idx) => (
          <div key={idx} className="feedback-item feedback-collaboration">
            <span className="feedback-icon">🤝</span>
            <p>{item}</p>
          </div>
        ));
      default:
        return null;
    }
  };

  return (
    <div className="section">
      <div className="section-header">
        <h2>📚 Learning Summary</h2>
        <span className="status-badge status-ended">🏁 Post-Hackathon</span>
      </div>

      <div className="overall-score-card">
        <div className="overall-score-circle">
          <svg viewBox="0 0 120 120" className="score-svg">
            <circle cx="60" cy="60" r="52" className="score-bg-circle" />
            <circle
              cx="60" cy="60" r="52"
              className="score-fg-circle"
              style={{
                strokeDasharray: `${(learningSummary.overallScore / 100) * 327} 327`,
              }}
            />
          </svg>
          <div className="score-center-text">
            <span className="score-num">{learningSummary.overallScore}</span>
            <span className="score-den">/100</span>
          </div>
        </div>
        <div className="overall-score-info">
          <h3>Overall Performance Score</h3>
          <p>Based on code quality, collaboration, commit patterns, and compliance metrics.</p>
        </div>
      </div>

      <div className="tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="card">
        <div className="feedback-list">{getTabContent()}</div>
      </div>

      <div className="card">
        <h3>📊 Summary Overview</h3>
        <div className="summary-grid">
          <div className="summary-item">
            <h4>💪 Strengths Identified</h4>
            <span className="summary-count">{learningSummary.strengths.length}</span>
          </div>
          <div className="summary-item">
            <h4>📈 Areas to Improve</h4>
            <span className="summary-count">{learningSummary.improvements.length}</span>
          </div>
          <div className="summary-item">
            <h4>🤝 Collaboration Notes</h4>
            <span className="summary-count">{learningSummary.collaborationInsights.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
