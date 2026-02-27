import React, { useState } from 'react';
import { useDashboard } from '../context/DashboardContext';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement, ArcElement,
  Title, Tooltip, Legend,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

export default function ContributionBreakdown() {
  const { state } = useDashboard();
  const { members } = state;
  const [viewMode, setViewMode] = useState('chart');

  const colors = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444'];

  const commitsData = {
    labels: members.map((m) => m.name.split(' ')[0]),
    datasets: [
      {
        label: 'Commits',
        data: members.map((m) => m.commits),
        backgroundColor: colors.map((c) => c + 'cc'),
        borderColor: colors,
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  const contributionData = {
    labels: members.map((m) => m.name.split(' ')[0]),
    datasets: [
      {
        data: members.map((m) => m.contributionPercent),
        backgroundColor: colors.map((c) => c + 'cc'),
        borderColor: colors,
        borderWidth: 2,
      },
    ],
  };

  const linesData = {
    labels: members.map((m) => m.name.split(' ')[0]),
    datasets: [
      {
        label: 'Lines Added',
        data: members.map((m) => m.linesAdded),
        backgroundColor: 'rgba(34, 197, 94, 0.7)',
        borderColor: '#22c55e',
        borderWidth: 2,
        borderRadius: 6,
      },
      {
        label: 'Lines Deleted',
        data: members.map((m) => m.linesDeleted),
        backgroundColor: 'rgba(239, 68, 68, 0.7)',
        borderColor: '#ef4444',
        borderWidth: 2,
        borderRadius: 6,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#e2e8f0' } },
      tooltip: { backgroundColor: '#1e1e2e', titleColor: '#e2e8f0', bodyColor: '#e2e8f0', padding: 12, cornerRadius: 8 },
    },
    scales: {
      x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } },
      y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' }, beginAtZero: true },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { color: '#e2e8f0', padding: 16 } },
      tooltip: { backgroundColor: '#1e1e2e', titleColor: '#e2e8f0', bodyColor: '#e2e8f0', padding: 12, cornerRadius: 8 },
    },
  };

  return (
    <div className="section">
      <div className="section-header">
        <h2>👥 Contribution Breakdown</h2>
        <div className="chart-toggle">
          <button className={`btn btn-sm ${viewMode === 'chart' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setViewMode('chart')}>
            Charts
          </button>
          <button className={`btn btn-sm ${viewMode === 'table' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setViewMode('table')}>
            Table
          </button>
        </div>
      </div>

      {viewMode === 'chart' ? (
        <>
          <div className="charts-grid">
            <div className="card">
              <h3>Commits per Member</h3>
              <div className="chart-container-sm">
                <Bar data={commitsData} options={barOptions} />
              </div>
            </div>
            <div className="card">
              <h3>Contribution Distribution</h3>
              <div className="chart-container-sm">
                <Doughnut data={contributionData} options={doughnutOptions} />
              </div>
            </div>
          </div>

          <div className="card">
            <h3>Lines of Code (Added vs Deleted)</h3>
            <div className="chart-container">
              <Bar data={linesData} options={barOptions} />
            </div>
          </div>
        </>
      ) : (
        <div className="card">
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Member</th>
                  <th>GitHub</th>
                  <th>Commits</th>
                  <th>Lines Added</th>
                  <th>Lines Deleted</th>
                  <th>Net Lines</th>
                  <th>Contribution %</th>
                </tr>
              </thead>
              <tbody>
                {members.map((m, idx) => (
                  <tr key={idx}>
                    <td>
                      <div className="member-cell">
                        <span className="avatar-sm">{m.avatar}</span>
                        <strong>{m.name}</strong>
                      </div>
                    </td>
                    <td>
                      <a href={`https://github.com/${m.github}`} target="_blank" rel="noopener noreferrer" className="github-link">
                        @{m.github}
                      </a>
                    </td>
                    <td>{m.commits}</td>
                    <td className="text-green">+{m.linesAdded.toLocaleString()}</td>
                    <td className="text-red">-{m.linesDeleted.toLocaleString()}</td>
                    <td>{(m.linesAdded - m.linesDeleted).toLocaleString()}</td>
                    <td>
                      <div className="mini-progress">
                        <div className="mini-progress-fill" style={{ width: `${m.contributionPercent}%`, background: colors[idx] }}></div>
                        <span>{m.contributionPercent}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
