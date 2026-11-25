import React, { useState } from 'react';
import TopBar from './components/TopBar';
import LoginScreen from './components/LoginScreen';
import LandingPage from './components/LandingPage';
import HrSidebar from './components/hr/HrSidebar';
import AiAssistantView from './components/hr/AiAssistantView';
import RequisitionsView from './components/hr/RequisitionsView';
import CandidatesView from './components/hr/CandidatesView';
import ApprovalsView from './components/hr/ApprovalsView';
import InterviewAnalyticsView from './components/hr/InterviewAnalyticsView';
import AuditLogsView from './components/hr/AuditLogsView';
import CandidatePortal from './components/candidate/CandidatePortal';
import {
  INITIAL_AUDIT_LOGS,
  INITIAL_CANDIDATES,
  INITIAL_CHAT_THREADS,
  INITIAL_PAST_INTERVIEWS,
  INITIAL_REQUISITIONS,
  INITIAL_UPCOMING_INTERVIEWS,
} from './data/mockData';

function currentTimeStr() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function App() {
  const [workspace, setWorkspace] = useState('landing'); // landing | login | hr | candidate
  const [loginRole, setLoginRole] = useState('');
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'signup'
  const [userEmail, setUserEmail] = useState('hr.operations@veyra.ai');
  const [candidateName, setCandidateName] = useState('Sarah');
  const [hrTab, setHrTab] = useState('chat'); // chat | requisitions | candidates | approvals | interviews | analytics | audit
  const [selectedCandidateReportId, setSelectedCandidateReportId] = useState(null);

  const [requisitions, setRequisitions] = useState(INITIAL_REQUISITIONS);
  const [candidates, setCandidates] = useState(INITIAL_CANDIDATES);
  const [auditLogs, setAuditLogs] = useState(INITIAL_AUDIT_LOGS);
  const [upcomingInterviews, setUpcomingInterviews] = useState(INITIAL_UPCOMING_INTERVIEWS);
  const [pastInterviews, setPastInterviews] = useState(INITIAL_PAST_INTERVIEWS);

  // Chat state
  const [chatThreads, setChatThreads] = useState(INITIAL_CHAT_THREADS);
  const [activeThread, setActiveThread] = useState(null);
  const [messages, setMessages] = useState([]);
  const [editingReqId, setEditingReqId] = useState(false);
  const [chatReqCard, setChatReqCard] = useState({
    title: 'Data Engineer',
    department: 'Engineering',
    location: 'Bangalore',
    salary: '₹6-15 LPA',
    openings: 1,
    level: 'Mid-level',
    date: '24/11/2025',
    skills: ['Python', 'JavaScript', 'Ruby', 'Java', 'Apache Kafka', 'RabbitMQ', 'Amazon SQS'],
  });
  const [copiedPrompt, setCopiedPrompt] = useState(null);

  const appendAudit = (actor, action, module, status = 'Logged') => {
    setAuditLogs((prev) => [
      {
        id: `LOG-${105 + prev.length}`,
        timestamp: new Date().toLocaleString(),
        actor,
        action,
        module,
        status,
      },
      ...prev,
    ]);
  };

  const handleLoginSuccess = (role, email, fullName) => {
    setUserEmail(email);
    setSelectedCandidateReportId(null);
    if (role === 'candidate') {
      if (fullName) setCandidateName(fullName.split(' ')[0]);
      setWorkspace('candidate');
      appendAudit(
        `${fullName || 'Sarah Johnson'} (Candidate)`,
        'Signed into Candidate Portal',
        'Auth',
        'Verified'
      );
    } else {
      setWorkspace('hr');
      setHrTab('chat');
      appendAudit(
        `${fullName || 'HR Official'}`,
        'Signed into HR Platform',
        'Auth',
        'Verified'
      );
    }
  };

  const goToLogin = (preferredRole = '', mode = 'login') => {
    setLoginRole(preferredRole);
    setAuthMode(mode);
    setWorkspace('login');
  };

  const handleCreateRequisition = (form) => {
    const newReq = {
      id: `REQ-00${requisitions.length + 1}`,
      jobTitle: form.jobTitle,
      department: form.department || 'Engineering',
      location: form.location || 'Bangalore',
      openings: form.openings || 1,
      createdOn: '25/11/2025',
      hiringManager: form.hiringManager || 'Sarah Johnson',
      status: form.status || 'Approved',
      salary: form.salary || '₹12-18 LPA',
      experience: form.experience || '2-5 years',
      workType: form.workType || 'Hybrid',
      skills: (form.skills || 'React, TypeScript')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    };
    setRequisitions((prev) => [newReq, ...prev]);
    appendAudit(
      'HR Official',
      `Created requisition for ${newReq.jobTitle} (${newReq.location})`,
      'Requisitions',
      newReq.status
    );
  };

  const handleApproveCandidate = (candId, viaChat = false) => {
    const target = candidates.find((c) => c.id === candId);
    setCandidates((prev) =>
      prev.map((c) => (c.id === candId ? { ...c, status: 'Approved' } : c))
    );
    if (target) {
      appendAudit('Hiring Manager', `Approved candidate ${target.name}`, 'Approvals', 'Approved');
    }
    if (viaChat) {
      setMessages((prev) => [
        ...prev,
        {
          id: `user-${Date.now()}`,
          sender: 'user',
          time: currentTimeStr(),
          text: 'The candidate has been evaluated and approved. Their skills align with our needs, and we believe they will be a good fit',
        },
      ]);
    }
  };

  const handleRejectCandidate = (candId, viaChat = false) => {
    const target = candidates.find((c) => c.id === candId);
    setCandidates((prev) =>
      prev.map((c) => (c.id === candId ? { ...c, status: 'Unapproved' } : c))
    );
    if (target) {
      appendAudit('Hiring Manager', `Rejected candidate ${target.name}`, 'Approvals', 'Rejected');
    }
    if (viaChat) {
      setMessages((prev) => [
        ...prev,
        {
          id: `user-${Date.now()}`,
          sender: 'user',
          time: currentTimeStr(),
          text: 'The candidate has been rejected. We feel they may not align well with our needs.',
        },
      ]);
    }
  };

  const handleSendMessage = (text) => {
    const now = currentTimeStr();
    const userMsg = { id: `u-${Date.now()}`, sender: 'user', text, time: now };
    const lower = text.toLowerCase();

    if (!activeThread) {
      const threadTitle = text.length > 32 ? `${text.slice(0, 32)}...` : text;
      setChatThreads((prev) => [threadTitle, ...prev]);
      setActiveThread(threadTitle);
    }

    if (editingReqId && lower !== 'edit') {
      let updatedLocation = chatReqCard.location;
      const toMatch = text.match(/to\s+([A-Za-z\s]+)$/i);
      if (toMatch) {
        updatedLocation = toMatch[1].trim();
      } else if (lower.includes('hyderabad')) {
        updatedLocation = 'Hyderabad';
      }
      const nextCard = { ...chatReqCard, location: updatedLocation };
      setChatReqCard(nextCard);
      setEditingReqId(false);
      appendAudit(
        'HR Official',
        `Updated ${nextCard.title} requisition location to ${updatedLocation}`,
        'AI Assistant'
      );
      setMessages((prev) => [
        ...prev,
        userMsg,
        {
          id: `ai-${Date.now() + 1}`,
          sender: 'ai',
          time: now,
          text: 'Here is the edited Requisition',
          requisitionCard: nextCard,
        },
      ]);
      return;
    }

    if (lower === 'edit') {
      setEditingReqId(true);
      setMessages((prev) => [
        ...prev,
        userMsg,
        {
          id: `ai-${Date.now() + 1}`,
          sender: 'ai',
          time: now,
          text: 'What you want to edit in this requisition',
        },
      ]);
      return;
    }

    if (lower.includes('create') || lower.includes('requisition') || lower.includes('developer')) {
      const locMatch = text.match(/\bin\s+([A-Za-z]+)/i);
      const loc = locMatch ? locMatch[1] : 'Bangalore';
      const title = lower.includes('frontend') ? 'Senior Frontend Developer' : 'Data Engineer';
      const createdCard = {
        ...chatReqCard,
        title,
        location: loc,
      };
      setChatReqCard(createdCard);
      handleCreateRequisition({
        jobTitle: title,
        department: 'Engineering',
        location: loc,
        salary: '₹6-15 LPA',
        skills: createdCard.skills.join(', '),
        status: 'Approved',
      });
      setMessages((prev) => [
        ...prev,
        userMsg,
        {
          id: `ai-${Date.now() + 1}`,
          sender: 'ai',
          time: now,
          text: `Requisition created for a ${title} position in ${loc}.`,
          requisitionCard: createdCard,
        },
      ]);
      return;
    }

    if (lower.includes('approval')) {
      const pending = candidates.filter(
        (c) => c.status === 'Pending' || c.status === 'In Progress'
      );
      const list = pending.length > 0 ? pending.slice(0, 2) : candidates.slice(0, 1);
      setMessages((prev) => [
        ...prev,
        userMsg,
        {
          id: `ai-${Date.now() + 1}`,
          sender: 'ai',
          time: now,
          text: 'Here are the pending approvals',
          candidateCards: list,
        },
      ]);
      return;
    }

    if (lower.includes('candidate') || lower.includes('applicant')) {
      setMessages((prev) => [
        ...prev,
        userMsg,
        {
          id: `ai-${Date.now() + 1}`,
          sender: 'ai',
          time: now,
          text: 'Here are the candidates for this requisition',
          candidateCards: candidates.slice(0, 2),
        },
      ]);
      return;
    }

    if (lower.includes('activity') || lower.includes('hour')) {
      setMessages((prev) => [
        ...prev,
        userMsg,
        {
          id: `ai-${Date.now() + 1}`,
          sender: 'ai',
          time: now,
          text: 'Here is the recent platform activity:',
          auditItems: auditLogs.slice(0, 4),
        },
      ]);
      return;
    }

    setMessages((prev) => [
      ...prev,
      userMsg,
      {
        id: `ai-${Date.now() + 1}`,
        sender: 'ai',
        time: now,
        text: 'I can help you create requisitions, review candidates, inspect pending approvals, or view recent audit activity. Try clicking a suggested prompt or asking directly.',
      },
    ]);
  };

  const handleCompleteCandidateInterview = (interview) => {
    if (!interview) return;
    setUpcomingInterviews((prev) => prev.filter((i) => i.id !== interview.id));
    setPastInterviews((prev) => [
      {
        id: `PAST-${Date.now()}`,
        role: interview.role,
        company: interview.company,
        status: 'Completed',
        marks: '85.0',
        completedDate: 'Nov 25, 2025',
        timeTaken: '12 minutes',
      },
      ...prev,
    ]);
    appendAudit(
      'Sarah Johnson (Candidate)',
      `Completed AI interview for ${interview.role}`,
      'Candidate Portal',
      'Completed'
    );
  };

  const pendingApprovalsCount = candidates.filter(
    (c) => c.status === 'Pending' || c.status === 'In Progress'
  ).length;

  if (workspace === 'login') {
    return (
      <LoginScreen
        initialRole={loginRole}
        initialMode={authMode}
        onLoginSuccess={handleLoginSuccess}
        onViewOverview={() => setWorkspace('landing')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F7FC] text-[#1E293B]">
      <TopBar
        workspace={workspace}
        userEmail={userEmail}
        onGoToLogin={goToLogin}
        onSignOut={() => goToLogin(workspace === 'candidate' ? 'candidate' : 'hr')}
        onOpenOverview={() => {
          setWorkspace('landing');
          setSelectedCandidateReportId(null);
        }}
        notificationsCount={pendingApprovalsCount}
        auditLogs={auditLogs}
      />

      {workspace === 'landing' && (
        <LandingPage
          onEnterHr={() => goToLogin('hr')}
          onEnterCandidate={() => goToLogin('candidate')}
        />
      )}

      {workspace === 'hr' && (
        <div className="flex flex-col md:flex-row">
          <HrSidebar
            activeTab={hrTab}
            onSelectTab={(tab) => {
              setHrTab(tab);
              setSelectedCandidateReportId(null);
            }}
            onNewChat={() => {
              setHrTab('chat');
              setActiveThread(null);
              setMessages([]);
              setEditingReqId(false);
            }}
            chatThreads={chatThreads}
            activeThread={activeThread}
            onSelectThread={(thread) => {
              setHrTab('chat');
              setActiveThread(thread);
            }}
            pendingApprovalsCount={pendingApprovalsCount}
          />

          <main className="min-w-0 flex-1">
            {hrTab === 'chat' && (
              <AiAssistantView
                messages={messages}
                candidates={candidates}
                onSendMessage={handleSendMessage}
                onApproveCandidate={handleApproveCandidate}
                onRejectCandidate={handleRejectCandidate}
                onOpenCandidateReport={(candId) => {
                  setSelectedCandidateReportId(candId);
                  setHrTab('analytics');
                }}
                onOpenRequisitions={() => setHrTab('requisitions')}
                editingReqId={editingReqId}
                copiedText={copiedPrompt}
                onCopyPrompt={(txt) => {
                  navigator.clipboard?.writeText(txt);
                  setCopiedPrompt(txt);
                  setTimeout(() => setCopiedPrompt(null), 1500);
                }}
              />
            )}

            {hrTab === 'requisitions' && (
              <RequisitionsView
                requisitions={requisitions}
                onCreateRequisition={handleCreateRequisition}
              />
            )}

            {hrTab === 'candidates' && (
              <CandidatesView
                candidates={candidates}
                onOpenReport={(candId) => {
                  setSelectedCandidateReportId(candId);
                  setHrTab('analytics');
                }}
              />
            )}

            {hrTab === 'approvals' && (
              <ApprovalsView
                candidates={candidates}
                onApprove={(id) => handleApproveCandidate(id, false)}
                onReject={(id) => handleRejectCandidate(id, false)}
                onOpenReport={(candId) => {
                  setSelectedCandidateReportId(candId);
                  setHrTab('analytics');
                }}
              />
            )}

            {(hrTab === 'interviews' || hrTab === 'analytics') && (
              <InterviewAnalyticsView
                mode={hrTab}
                candidates={candidates}
                requisitions={requisitions}
                selectedCandidateId={selectedCandidateReportId}
                onSelectCandidate={setSelectedCandidateReportId}
              />
            )}

            {hrTab === 'audit' && <AuditLogsView logs={auditLogs} />}
          </main>
        </div>
      )}

      {workspace === 'candidate' && (
        <CandidatePortal
          candidateName={candidateName}
          upcomingInterviews={upcomingInterviews}
          pastInterviews={pastInterviews}
          onCompleteInterview={handleCompleteCandidateInterview}
          candidateReportData={candidates[0]}
        />
      )}
    </div>
  );
}
