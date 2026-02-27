import React from 'react';
import { useDashboard } from '../context/DashboardContext';

export default function FairnessIndicator() {
  const { state } = useDashboard();
  const { members } = state;

  const contributions = members.map((m) => m.contributionPercent);
  const idealShare = 100 / members.length;
  const maxContrib = Math.max(...contributions);
  const minContrib = Math.min(...contributions);
  const range = maxContrib - minContrib;

  // Calculate fairness score (100 = perfectly equal)
  const deviations = contributions.map((c) => Math.abs(c - idealShare));
  const avgDeviation = deviations.reduce((a, b) => a + b, 0) / deviations.length;
  const fairnessScore = Math.max(0, Math.round(100 - avgDeviation * 4));

  const dominantMember = members.find((m) => m.contributionPercent === maxContrib);
  const isDominant = maxContrib > 40;
  const isImbalanced = range > 20;

  const getFairnessLevel = (score) => {
    if (score >= 80) return { label: 'Excellent Balance', color: '#22c55e', icon: '✅', desc: 'Team contributions are well-balanced.' };
    if (score >= 60) return { label: 'Acceptable', color: '#f59e0b', icon: '⚠️', desc: 'Minor imbalance detected. Consider redistributing tasks.' };
    return { label: 'Imbalanced', color: '#ef4444', icon: '❌', desc: 'Significant contribution imbalance. Action recommended.' };
  };

  const level = getFairnessLevel(fairnessScore);

  return (
    <div className="section">
      <div className="section-header">
        <h2>⚖️ Fairness Indicator</h2>
      </div>

      <div className="fairness-score-card" style={{ borderColor: level.color }}>
        <div className="score-circle" style={{ borderColor: level.color, color: level.color }}>
          <div className="score-value">{fairnessScore}</div>
          <div className="score-label">/ 100</div>
        </div>
        <div className="score-info">
          <h3 style={{ color: level.color }}>{level.icon} {level.label}</h3>
          <p>{level.desc}</p>
          <div className="score-details">
            <span>Ideal share per member: <strong>{idealShare.toFixed(1)}%</strong></span>
            <span>Contribution range: <strong>{range.toFixed(1)}%</strong></span>
          </div>
        </div>
      </div>

      <div className="card">
        <h3>📊 Contribution Equality</h3>
        <div className="equality-bars">
          {members.map((m, idx) => {
            const deviation = Math.abs(m.contributionPercent - idealShare);
            const deviationColor = deviation > 10 ? '#ef4444' : deviation > 5 ? '#f59e0b' : '#22c55e';
            return (
              <div key={idx} className="equality-row">
                <div className="equality-member">
                  <span className="avatar-sm">{m.avatar}</span>
                  <span>{m.name}</span>
                </div>
                <div className="equality-bar-container">
                  <div className="equality-bar">
                    <div
                      className="equality-fill"
                      style={{ width: `${m.contributionPercent}%`, background: deviationColor }}
                    ></div>
                    <div
                      className="ideal-line"
                      style={{ left: `${idealShare}%` }}
                      title={`Ideal: ${idealShare.toFixed(1)}%`}
                    ></div>
                  </div>
                  <span className="equality-value">{m.contributionPercent}%</span>
                </div>
                <span className="deviation-badge" style={{ color: deviationColor }}>
                  {deviation > 0 ? `±${deviation.toFixed(1)}%` : 'Exact'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {isDominant && (
        <div className="warning-card">
          <div className="warning-icon">⚠️</div>
          <div className="warning-content">
            <h4>Dominance Warning</h4>
            <p>
              <strong>{dominantMember.name}</strong> has contributed <strong>{maxContrib}%</strong> of all work,
              which exceeds the 40% threshold. This may indicate unbalanced workload distribution.
            </p>
            <div className="warning-suggestions">
              <h5>Suggestions:</h5>
              <ul>
                <li>Redistribute remaining tasks more evenly</li>
                <li>Pair program with lower-contributing members</li>
                <li>Review if role assignments match team strengths</li>
                <li>Consider if some members face technical blockers</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {isImbalanced && !isDominant && (
        <div className="warning-card warning-mild">
          <div className="warning-icon">💡</div>
          <div className="warning-content">
            <h4>Mild Imbalance Detected</h4>
            <p>
              The contribution range of <strong>{range.toFixed(1)}%</strong> between highest and lowest
              contributors suggests room for improvement in task distribution.
            </p>
          </div>
        </div>
      )}

      <div className="card">
        <h3>📈 Fairness Metrics Summary</h3>
        <div className="metrics-grid">
          <div className="metric-item">
            <span className="metric-label">Highest Contributor</span>
            <span className="metric-value">{dominantMember?.name} ({maxContrib}%)</span>
          </div>
          <div className="metric-item">
            <span className="metric-label">Lowest Contributor</span>
            <span className="metric-value">
              {members.find((m) => m.contributionPercent === minContrib)?.name} ({minContrib}%)
            </span>
          </div>
          <div className="metric-item">
            <span className="metric-label">Standard Deviation</span>
            <span className="metric-value">{avgDeviation.toFixed(2)}%</span>
          </div>
          <div className="metric-item">
            <span className="metric-label">Team Balance Score</span>
            <span className="metric-value" style={{ color: level.color }}>{fairnessScore}/100</span>
          </div>
        </div>
      </div>
    </div>
  );
}
