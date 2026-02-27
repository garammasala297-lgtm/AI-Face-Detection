import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { mockData } from '../data/mockData';

const DashboardContext = createContext();

const initialState = {
  teamInfo: mockData.teamInfo,
  commits: mockData.commits,
  members: mockData.members,
  locationData: mockData.locationData,
  flags: mockData.flags,
  tickets: mockData.tickets,
  learningSummary: mockData.learningSummary,
  rules: mockData.rules,
  warnings: [],
  inactivityAlert: null,
  hackathonEnded: false,
  justifications: {},
  dismissedWarnings: [],
};

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_WARNING':
      return {
        ...state,
        warnings: [...state.warnings, { id: Date.now(), ...action.payload }],
      };
    case 'DISMISS_WARNING':
      return {
        ...state,
        warnings: state.warnings.filter((w) => w.id !== action.payload),
        dismissedWarnings: [...state.dismissedWarnings, action.payload],
      };
    case 'SET_INACTIVITY_ALERT':
      return { ...state, inactivityAlert: action.payload };
    case 'DISMISS_INACTIVITY':
      return { ...state, inactivityAlert: null };
    case 'ADD_TICKET':
      return {
        ...state,
        tickets: [...state.tickets, { id: Date.now(), ...action.payload, status: 'open', createdAt: new Date().toISOString() }],
      };
    case 'UPDATE_TICKET_STATUS':
      return {
        ...state,
        tickets: state.tickets.map((t) =>
          t.id === action.payload.id ? { ...t, status: action.payload.status, mentorResponse: action.payload.mentorResponse } : t
        ),
      };
    case 'SUBMIT_JUSTIFICATION':
      return {
        ...state,
        justifications: { ...state.justifications, [action.payload.flagId]: action.payload.text },
        flags: state.flags.map((f) =>
          f.id === action.payload.flagId ? { ...f, justification: action.payload.text, justificationStatus: 'submitted' } : f
        ),
      };
    case 'TOGGLE_HACKATHON_ENDED':
      return { ...state, hackathonEnded: !state.hackathonEnded };
    case 'RESOLVE_FLAG':
      return {
        ...state,
        flags: state.flags.map((f) =>
          f.id === action.payload ? { ...f, resolved: true } : f
        ),
      };
    default:
      return state;
  }
}

export function DashboardProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const triggerInactivityAlert = useCallback(() => {
    dispatch({
      type: 'SET_INACTIVITY_ALERT',
      payload: {
        message: 'No commits detected in the last 2 hours. Need help? Consider raising a mentor ticket!',
        timestamp: new Date().toISOString(),
      },
    });
  }, []);

  useEffect(() => {
    // Simulate malpractice detection after 5 seconds
    const warningTimer = setTimeout(() => {
      const unresolvedFlags = state.flags.filter((f) => !f.resolved && !f.justification);
      if (unresolvedFlags.length > 0) {
        dispatch({
          type: 'ADD_WARNING',
          payload: {
            title: 'Malpractice Alert',
            message: `Detected ${unresolvedFlags.length} unresolved flag(s). Please review and submit justifications if needed.`,
            severity: 'warning',
          },
        });
      }
    }, 5000);

    // Simulate inactivity alert after 15 seconds
    const inactivityTimer = setTimeout(() => {
      triggerInactivityAlert();
    }, 15000);

    return () => {
      clearTimeout(warningTimer);
      clearTimeout(inactivityTimer);
    };
  }, [state.flags, triggerInactivityAlert]);

  return (
    <DashboardContext.Provider value={{ state, dispatch }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) throw new Error('useDashboard must be used within DashboardProvider');
  return context;
}
