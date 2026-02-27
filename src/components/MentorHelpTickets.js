import React, { useState } from 'react';
import { useDashboard } from '../context/DashboardContext';

const categories = [
  { value: 'technical', label: '💻 Technical Guidance', icon: '💻' },
  { value: 'debugging', label: '🐛 Debugging Help', icon: '🐛' },
  { value: 'idea', label: '💡 Idea Validation', icon: '💡' },
  { value: 'design', label: '🎨 Design Review', icon: '🎨' },
  { value: 'other', label: '📋 Other', icon: '📋' },
];

export default function MentorHelpTickets() {
  const { state, dispatch } = useDashboard();
  const { tickets } = state;
  const [showForm, setShowForm] = useState(false);
  const [newTicket, setNewTicket] = useState({ title: '', category: 'technical', description: '' });
  const [filter, setFilter] = useState('all');

  const handleCreateTicket = (e) => {
    e.preventDefault();
    if (!newTicket.title.trim() || !newTicket.description.trim()) return;
    dispatch({ type: 'ADD_TICKET', payload: { ...newTicket } });
    setNewTicket({ title: '', category: 'technical', description: '' });
    setShowForm(false);
  };

  const simulateMentorResponse = (ticketId) => {
    dispatch({
      type: 'UPDATE_TICKET_STATUS',
      payload: {
        id: ticketId,
        status: 'resolved',
        mentorResponse: 'Thanks for reaching out! I\'ve reviewed your issue and here are my suggestions: Break down the problem into smaller components, check your API endpoints, and ensure proper error handling. Let me know if you need a follow-up session.',
      },
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'open': return '🔵';
      case 'in-progress': return '🟡';
      case 'resolved': return '✅';
      default: return '⚪';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return '#3b82f6';
      case 'in-progress': return '#f59e0b';
      case 'resolved': return '#22c55e';
      default: return '#94a3b8';
    }
  };

  const filteredTickets = tickets.filter((t) => {
    if (filter === 'all') return true;
    return t.status === filter;
  });

  return (
    <div className="section">
      <div className="section-header">
        <h2>🎓 Mentor Help Tickets</h2>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✖ Cancel' : '➕ New Ticket'}
        </button>
      </div>

      <div className="stats-row">
        <div className="stat-card stat-info">
          <div className="stat-number">{tickets.length}</div>
          <div className="stat-label">Total Tickets</div>
        </div>
        <div className="stat-card" style={{ borderColor: '#3b82f6' }}>
          <div className="stat-number">{tickets.filter((t) => t.status === 'open').length}</div>
          <div className="stat-label">Open</div>
        </div>
        <div className="stat-card" style={{ borderColor: '#f59e0b' }}>
          <div className="stat-number">{tickets.filter((t) => t.status === 'in-progress').length}</div>
          <div className="stat-label">In Progress</div>
        </div>
        <div className="stat-card stat-success">
          <div className="stat-number">{tickets.filter((t) => t.status === 'resolved').length}</div>
          <div className="stat-label">Resolved</div>
        </div>
      </div>

      {showForm && (
        <div className="card animate-in">
          <h3>📝 Create New Ticket</h3>
          <form onSubmit={handleCreateTicket} className="ticket-form">
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                className="form-input"
                placeholder="Brief summary of your request..."
                value={newTicket.title}
                onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Category</label>
              <div className="category-selector">
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    className={`category-btn ${newTicket.category === cat.value ? 'active' : ''}`}
                    onClick={() => setNewTicket({ ...newTicket, category: cat.value })}
                  >
                    {cat.icon} {cat.label.split(' ').slice(1).join(' ')}
                  </button>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                className="form-input form-textarea"
                placeholder="Describe your issue or question in detail..."
                value={newTicket.description}
                onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                rows={4}
                required
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                📤 Submit Ticket
              </button>
              <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="filter-bar">
        {['all', 'open', 'in-progress', 'resolved'].map((f) => (
          <button
            key={f}
            className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1).replace('-', ' ')}
          </button>
        ))}
      </div>

      <div className="tickets-list">
        {filteredTickets.map((ticket) => (
          <div key={ticket.id} className="ticket-card" style={{ borderLeftColor: getStatusColor(ticket.status) }}>
            <div className="ticket-header">
              <div className="ticket-title-row">
                <span>{categories.find((c) => c.value === ticket.category)?.icon || '📋'}</span>
                <h4>{ticket.title}</h4>
              </div>
              <span className="status-pill" style={{ background: getStatusColor(ticket.status) }}>
                {getStatusIcon(ticket.status)} {ticket.status.replace('-', ' ').toUpperCase()}
              </span>
            </div>
            <p className="ticket-description">{ticket.description}</p>
            <p className="ticket-time">Created: {new Date(ticket.createdAt).toLocaleString()}</p>

            {ticket.mentorResponse && (
              <div className="mentor-response">
                <h5>🎓 Mentor Response</h5>
                <p>{ticket.mentorResponse}</p>
              </div>
            )}

            {ticket.status !== 'resolved' && (
              <div className="ticket-actions">
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => simulateMentorResponse(ticket.id)}
                >
                  🤖 Simulate Mentor Response
                </button>
              </div>
            )}
          </div>
        ))}

        {filteredTickets.length === 0 && (
          <div className="empty-state">
            <span className="empty-icon">📭</span>
            <p>No tickets match the selected filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}
