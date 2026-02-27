import React, { useState } from 'react';
import { DashboardProvider } from './context/DashboardContext';
import Sidebar from './components/Sidebar';
import BasicInfo from './components/BasicInfo';
import CommitActivity from './components/CommitActivity';
import LocationCompliance from './components/LocationCompliance';
import ContributionBreakdown from './components/ContributionBreakdown';
import FairnessIndicator from './components/FairnessIndicator';
import TransparencyFlags from './components/TransparencyFlags';
import MentorHelpTickets from './components/MentorHelpTickets';
import LearningSummary from './components/LearningSummary';
import WarningPopup from './components/WarningPopup';
import InactivityAlert from './components/InactivityAlert';
import RulesModal from './components/RulesModal';

function App() {
  const [activeSection, setActiveSection] = useState('basic-info');
  const [showRules, setShowRules] = useState(false);

  const renderSection = () => {
    switch (activeSection) {
      case 'basic-info': return <BasicInfo />;
      case 'commit-activity': return <CommitActivity />;
      case 'location-compliance': return <LocationCompliance />;
      case 'contribution-breakdown': return <ContributionBreakdown />;
      case 'fairness-indicator': return <FairnessIndicator />;
      case 'transparency-flags': return <TransparencyFlags />;
      case 'mentor-help': return <MentorHelpTickets />;
      case 'learning-summary': return <LearningSummary />;
      default: return <BasicInfo />;
    }
  };

  return (
    <DashboardProvider>
      <div className="app-container">
        <Sidebar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          onShowRules={() => setShowRules(true)}
        />
        <main className="main-content">
          <header className="main-header">
            <h1>Participant Dashboard</h1>
            <div className="header-actions">
              <button className="btn btn-outline" onClick={() => setShowRules(true)}>
                📋 Hackathon Rules
              </button>
              <button className="btn btn-primary" onClick={() => window.location.reload()}>
                🔄 Refresh Data
              </button>
            </div>
          </header>
          <div className="content-area">
            {renderSection()}
          </div>
        </main>
        <WarningPopup />
        <InactivityAlert />
        {showRules && <RulesModal onClose={() => setShowRules(false)} />}
      </div>
    </DashboardProvider>
  );
}

export default App;
