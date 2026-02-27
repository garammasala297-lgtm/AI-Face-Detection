import React, { useRef, useEffect, useState } from 'react';
import { useDashboard } from '../context/DashboardContext';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement, PointElement, LineElement,
  Title, Tooltip, Legend, Filler,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export default function CommitActivity() {
  const { state } = useDashboard();
  const { commits } = state;
  const [chartType, setChartType] = useState('bar');

  const hourlyData = {
    labels: commits.timeline.map((t) => t.time),
    datasets: [
      {
        label: 'Commits',
        data: commits.timeline.map((t) => t.commits),
        backgroundColor: 'rgba(99, 102, 241, 0.6)',
        borderColor: '#6366f1',
        borderWidth: 2,
        borderRadius: 6,
        fill: chartType === 'line',
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1e1e2e',
        titleColor: '#e2e8f0',
        bodyColor: '#e2e8f0',
        padding: 12,
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(255,255,255,0.05)' },
        ticks: { color: '#94a3b8', maxRotation: 45 },
      },
      y: {
        grid: { color: 'rgba(255,255,255,0.05)' },
        ticks: { color: '#94a3b8' },
        beginAtZero: true,
      },
    },
  };

  const outsidePercent = (100 - commits.insidePercentage).toFixed(1);

  return (
    <div className="section">
      <div className="section-header">
        <h2>📊 Commit Activity</h2>
        <div className="chart-toggle">
          <button
            className={`btn btn-sm ${chartType === 'bar' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setChartType('bar')}
          >
            Bar Chart
          </button>
          <button
            className={`btn btn-sm ${chartType === 'line' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setChartType('line')}
          >
            Line Chart
          </button>
        </div>
      </div>

      <div className="stats-row">
        <div className="stat-card stat-primary">
          <div className="stat-number">{commits.total}</div>
          <div className="stat-label">Total Commits</div>
        </div>
        <div className="stat-card stat-success">
          <div className="stat-number">{commits.insideWindow}</div>
          <div className="stat-label">Inside Window</div>
          <div className="stat-sub">{commits.insidePercentage}%</div>
        </div>
        <div className="stat-card stat-warning">
          <div className="stat-number">{commits.outsideWindow}</div>
          <div className="stat-label">Outside Window</div>
          <div className="stat-sub">{outsidePercent}%</div>
        </div>
        <div className="stat-card stat-info">
          <div className="stat-number">{(commits.total / 36).toFixed(1)}</div>
          <div className="stat-label">Commits/Hour (avg)</div>
        </div>
      </div>

      <div className="card">
        <h3>Hour-wise Commit Timeline</h3>
        <div className="chart-container">
          {chartType === 'bar' ? (
            <Bar data={hourlyData} options={chartOptions} />
          ) : (
            <Line data={hourlyData} options={chartOptions} />
          )}
        </div>
      </div>

      <div className="card">
        <h3>📅 Window Compliance</h3>
        <div className="compliance-bar-container">
          <div className="compliance-bar">
            <div
              className="compliance-fill compliance-good"
              style={{ width: `${commits.insidePercentage}%` }}
            >
              ✅ {commits.insidePercentage}% Inside
            </div>
            <div
              className="compliance-fill compliance-bad"
              style={{ width: `${outsidePercent}%` }}
            >
              ⚠️ {outsidePercent}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
