import React, { useState } from 'react';
import { useDashboard } from '../context/DashboardContext';

export default function RulesModal({ onClose }) {
  const { state } = useDashboard();
  const { rules } = state;
  const [filterCat, setFilterCat] = useState('all');

  const categoriesSet = [...new Set(rules.map((r) => r.category))];

  const getCategoryIcon = (cat) => {
    const icons = {
      timing: '⏰', team: '👥', code: '💻', fairness: '⚖️',
      location: '📍', integrity: '🛡️', submission: '📦',
      mentorship: '🎓', process: '📋',
    };
    return icons[cat] || '📌';
  };

  const filteredRules = rules.filter((r) => filterCat === 'all' || r.category === filterCat);

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal animate-in">
        <div className="modal-header">
          <h2>📜 Hackathon Rules</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-filter-bar">
          <button
            className={`btn btn-sm ${filterCat === 'all' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setFilterCat('all')}
          >
            All
          </button>
          {categoriesSet.map((cat) => (
            <button
              key={cat}
              className={`btn btn-sm ${filterCat === cat ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setFilterCat(cat)}
            >
              {getCategoryIcon(cat)} {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        <div className="modal-body">
          <div className="rules-list">
            {filteredRules.map((rule) => (
              <div key={rule.id} className="rule-card">
                <span className="rule-number">#{rule.id}</span>
                <span className="rule-category-icon">{getCategoryIcon(rule.category)}</span>
                <div className="rule-content">
                  <p>{rule.rule}</p>
                  <span className="rule-category-badge">{rule.category}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="modal-footer">
          <p className="rules-disclaimer">
            📌 Violation of these rules may result in warnings, point deductions, or disqualification.
          </p>
          <button className="btn btn-primary" onClick={onClose}>
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
}
