import React, { useState } from 'react';
import GoogleIcon from '../GoogleIcon';
import { INTERVIEW_QUESTIONS } from '../../data/mockData';

export default function InterviewAnalyticsView({
  mode = 'analytics',
  candidates,
  requisitions,
  selectedCandidateId,
  onSelectCandidate,
}) {
  const [reportTab, setReportTab] = useState('behavioral');
  const [expandedQ, setExpandedQ] = useState(1);
  const [copiedQ, setCopiedQ] = useState(null);
  const [speakingQ, setSpeakingQ] = useState(null);

  const selectedCandidate = candidates.find((c) => c.id === selectedCandidateId);

  const speakText = (id, text) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    if (speakingQ === id) {
      setSpeakingQ(null);
      return;
    }
    const utter = new SpeechSynthesisUtterance(text);
    utter.onend = () => setSpeakingQ(null);
    setSpeakingQ(id);
    window.speechSynthesis.speak(utter);
  };

  const copyAnswer = (id, text) => {
    navigator.clipboard?.writeText(text);
    setCopiedQ(id);
    setTimeout(() => setCopiedQ(null), 1500);
  };

  const exportCsv = () => {
    const rows = [
      ['Candidate', 'Job Title', 'Date', 'Duration', 'Score', 'Status'],
      ...candidates.map((c) => [
        c.name,
        c.jobTitle,
        c.dateShort,
        c.duration,
        `${c.score}/100`,
        c.interviewStatus,
      ]),
    ];
    const csv = rows.map((r) => r.map((v) => `"${v}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'veyra-interview-report.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Detailed Recruiter Candidate Evaluation Report matching PDF Pages 17-18
  if (selectedCandidate) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-[#F6F7FC] p-5 sm:p-8">
        <div className="mx-auto max-w-6xl space-y-6">
          <button
            type="button"
            onClick={() => onSelectCandidate(null)}
            className="inline-flex items-center gap-2 text-xs font-medium text-[#64748B] hover:text-[#1D4ED8]"
          >
            <GoogleIcon name="arrow_back" size={16} />
            <span>Dashboard / View Results</span>
          </button>

          <div>
            <h1 className="text-xl font-bold text-[#1E293B]">Interview Report</h1>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <span className="h-11 w-11 rounded-xl bg-gradient-to-br from-[#A78BFA] to-[#6366F1]" />
                <div>
                  <h2 className="text-lg font-bold text-[#1E293B]">
                    {selectedCandidate.name}
                  </h2>
                  <p className="flex items-center gap-1.5 text-xs text-[#1D4ED8]">
                    <GoogleIcon name="mail" size={14} />
                    <span>{selectedCandidate.email}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href={`mailto:${selectedCandidate.email}`}
                  className="inline-flex items-center gap-2 rounded-full border border-[#1D4ED8] bg-white px-5 py-2 text-xs font-semibold text-[#1D4ED8] hover:bg-[#EEF2FF]"
                >
                  <GoogleIcon name="mail" size={15} />
                  <span>Mail</span>
                </a>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-2 rounded-full bg-[#1D4ED8] px-5 py-2 text-xs font-semibold text-white hover:bg-[#1E40AF]"
                >
                  <GoogleIcon name="download" size={15} />
                  <span>Download PDF</span>
                </button>
              </div>
            </div>
          </div>

          {/* Overall Score Card */}
          <div className="rounded-2xl border border-[#E5E7F0] bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-[#64748B]">Overall Score</p>
                <p className="mt-0.5 text-2xl font-extrabold text-[#1E293B]">
                  {selectedCandidate.categoryScores.overall}/100
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-[#64748B]">Completed on</p>
                <p className="mt-0.5 text-sm font-semibold text-[#1E293B]">
                  {selectedCandidate.dateShort}
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                {
                  label: 'Technical Skills',
                  val: selectedCandidate.categoryScores.technical,
                },
                {
                  label: 'Communication',
                  val: selectedCandidate.categoryScores.communication,
                },
                {
                  label: 'Behavioural Problem Solving',
                  val: selectedCandidate.categoryScores.behavioral,
                },
              ].map((cat) => (
                <div key={cat.label} className="rounded-xl bg-[#EEF0FA] p-4">
                  <p className="text-xs font-medium text-[#475569]">{cat.label}</p>
                  <p className="mt-2 text-2xl font-bold text-[#1E293B]">
                    {cat.val}/100
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Application Details + AI Recommendation + Key Strengths */}
          <div className="grid gap-5 lg:grid-cols-12">
            <div className="rounded-2xl border border-[#E5E7F0] bg-white p-6 shadow-sm lg:col-span-7">
              <h3 className="mb-4 text-base font-bold text-[#1E293B]">
                Application Details
              </h3>
              <div className="divide-y divide-[#F1F5F9] text-xs sm:text-sm">
                {[
                  ['Applied Position', selectedCandidate.jobTitle],
                  ['Department', selectedCandidate.department],
                  ['Interview Date', selectedCandidate.interviewDate],
                  ['Duration', selectedCandidate.duration],
                  ['Question Answered', selectedCandidate.questionsAnswered],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between py-3">
                    <span className="text-[#64748B]">{k}</span>
                    <span className="font-semibold text-[#1E293B]">{v}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-5 lg:col-span-5">
              <div className="rounded-2xl border border-[#C084FC] bg-[#FAF5FF] p-5 shadow-sm">
                <div className="mb-2 flex items-center gap-2 text-xs font-bold text-[#7E22CE]">
                  <GoogleIcon name="auto_awesome" size={16} />
                  <span>AI Recommendation</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm font-bold text-[#1E293B]">
                  <GoogleIcon name="check" size={16} className="text-[#15803D]" />
                  <span>{selectedCandidate.aiRecommendation.decision}</span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-[#475569]">
                  {selectedCandidate.aiRecommendation.summary}
                </p>
              </div>

              <div className="rounded-2xl border border-[#E5E7F0] bg-white p-5 shadow-sm">
                <h3 className="mb-3 text-base font-bold text-[#1E293B]">
                  Key Strengths
                </h3>
                <ul className="space-y-2">
                  {selectedCandidate.strengths.map((s) => (
                    <li
                      key={s}
                      className="flex items-center gap-2 text-xs font-medium text-[#334155]"
                    >
                      <GoogleIcon name="check" size={16} className="text-[#1D4ED8]" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Report Sub-tabs matching PDF Pages 17-18 */}
          <div className="flex gap-6 border-b border-[#E2E8F0]">
            {[
              { id: 'behavioral', label: 'Behavioural Analysis' },
              { id: 'responses', label: 'Candidates Responses' },
            ].map((t) => {
              const active = reportTab === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setReportTab(t.id)}
                  className={`border-b-2 pb-3 text-sm font-semibold transition ${
                    active
                      ? 'border-[#1D4ED8] text-[#1D4ED8]'
                      : 'border-transparent text-[#64748B] hover:text-[#1E293B]'
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>

          {reportTab === 'behavioral' ? (
            <div className="rounded-2xl border border-[#E5E7F0] bg-white p-6 shadow-sm">
              <h3 className="mb-5 text-base font-bold text-[#1E293B]">
                Behaviour Traits
              </h3>
              <div className="grid gap-6 sm:grid-cols-2">
                {selectedCandidate.traits.map((trait) => (
                  <div key={trait.label}>
                    <div className="mb-1.5 flex items-center justify-between text-xs font-medium text-[#334155]">
                      <span>{trait.label}</span>
                      <span className="font-bold text-[#1E293B]">
                        {trait.value.toFixed(2)}
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-[#E5E7F0]">
                      <div
                        className="h-full rounded-full bg-[#1D4ED8] transition-all duration-500"
                        style={{ width: `${Math.round(trait.value * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {INTERVIEW_QUESTIONS.map((q) => {
                const open = expandedQ === q.id;
                return (
                  <div
                    key={q.id}
                    className="rounded-2xl border border-[#E5E7F0] bg-white p-4 shadow-sm sm:px-6"
                  >
                    <button
                      type="button"
                      onClick={() => setExpandedQ(open ? null : q.id)}
                      className="flex w-full items-center justify-between gap-4 text-left"
                    >
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#EEF0FA] text-xs font-bold text-[#475569]">
                          {q.id}
                        </span>
                        <span className="text-sm font-medium text-[#1E293B]">
                          {q.question}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#EEF0FA] px-2.5 py-0.5 text-xs font-semibold text-[#1D4ED8]">
                          <GoogleIcon name="check_circle" size={13} />
                          10/100
                        </span>
                      </div>
                      <GoogleIcon
                        name={open ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
                        size={20}
                        className="text-[#475569]"
                      />
                    </button>

                    {open && (
                      <div className="mt-4 border-t border-[#F1F5F9] pt-4">
                        <p className="mb-2 text-xs font-semibold text-[#64748B]">
                          Your Answer
                        </p>
                        <div className="rounded-xl bg-[#F4F5FB] p-4">
                          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                            <div className="flex flex-wrap items-center gap-4 text-xs text-[#475569]">
                              <span>
                                Technical Accuracy{' '}
                                <strong className="text-[#1E293B]">56/100</strong>
                              </span>
                              <span>
                                Relevance <strong className="text-[#1E293B]">56/100</strong>
                              </span>
                              <span>
                                Clarity <strong className="text-[#1E293B]">56/100</strong>
                              </span>
                            </div>
                            <div className="flex items-center gap-3 text-xs font-semibold text-[#1D4ED8]">
                              <button
                                type="button"
                                onClick={() => copyAnswer(q.id, q.sampleTranscript)}
                                className="inline-flex items-center gap-1 hover:underline"
                              >
                                <GoogleIcon
                                  name={copiedQ === q.id ? 'check' : 'content_copy'}
                                  size={14}
                                />
                                <span>{copiedQ === q.id ? 'Copied' : 'Copy'}</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => speakText(q.id, q.sampleTranscript)}
                                className="inline-flex items-center gap-1 hover:underline"
                              >
                                <GoogleIcon name="volume_up" size={14} />
                                <span>{speakingQ === q.id ? 'Stop' : 'Listen'}</span>
                              </button>
                            </div>
                          </div>
                          <p className="text-xs leading-relaxed text-[#334155]">
                            {q.sampleTranscript}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Overview KPIs + Recent Interviews / All Interviews matching PDF Pages 16 & 20
  const completedCount = candidates.filter((c) => c.interviewStatus === 'Completed').length;
  const pendingCount = candidates.filter((c) => c.interviewStatus !== 'Completed').length;
  const avgScore = (
    candidates.reduce((sum, c) => sum + c.score, 0) / Math.max(candidates.length, 1)
  ).toFixed(1);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#F6F7FC] p-5 sm:p-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1E293B]">
            {mode === 'interviews' ? 'All Interviews' : 'Overview & Interview Analytics'}
          </h1>
          <p className="text-sm text-[#64748B]">
            {mode === 'interviews'
              ? 'Track candidate interview sessions, durations, and evaluation results'
              : 'Real-time recruitment KPIs and recent AI interview completions'}
          </p>
        </div>

        <button
          type="button"
          onClick={exportCsv}
          className="inline-flex items-center gap-2 rounded-full bg-[#1D4ED8] px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#1E40AF]"
        >
          <GoogleIcon name="download" size={16} />
          <span>Export Report</span>
        </button>
      </div>

      {mode === 'analytics' && (
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {[
            { label: 'Total Candidates', value: candidates.length, icon: 'person' },
            { label: 'Completed Interviews', value: completedCount, icon: 'chat' },
            { label: 'Active Jobs', value: requisitions.length, icon: 'work' },
            { label: 'Pending Interviews', value: pendingCount, icon: 'hourglass_empty' },
            { label: 'Average Score', value: avgScore, icon: 'analytics' },
          ].map((kpi) => (
            <div
              key={kpi.label}
              className="rounded-2xl border border-[#E5E7F0] bg-white p-5 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EEF0FA] text-[#1D4ED8]">
                  <GoogleIcon name={kpi.icon} size={20} />
                </span>
                <span className="text-2xl font-extrabold text-[#1E293B]">{kpi.value}</span>
              </div>
              <p className="mt-3 text-xs font-medium text-[#64748B]">{kpi.label}</p>
            </div>
          ))}
        </div>
      )}

      <div className="rounded-3xl border border-[#E5E7F0] bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-base font-bold text-[#1E293B]">
          {mode === 'interviews' ? 'Interview Sessions' : 'Recent Interviews'}
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="border-b border-[#E5E7F0] text-xs font-semibold text-[#334155]">
                <th className="py-3 pr-4">Candidate</th>
                <th className="py-3 pr-4">Job Title</th>
                <th className="py-3 pr-4">Date</th>
                <th className="py-3 pr-4">Duration</th>
                <th className="py-3 pr-4">Score</th>
                <th className="py-3 pr-4">Status</th>
                <th className="py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((cand) => {
                const done = cand.interviewStatus === 'Completed';
                return (
                  <tr
                    key={cand.id}
                    className="border-b border-[#F1F5F9] last:border-b-0 hover:bg-[#F8F9FD]"
                  >
                    <td className="py-3.5 pr-4 font-semibold text-[#1E293B]">
                      {cand.name}
                    </td>
                    <td className="py-3.5 pr-4 text-[#475569]">{cand.jobTitle}</td>
                    <td className="py-3.5 pr-4 text-[#475569]">{cand.dateShort}</td>
                    <td className="py-3.5 pr-4 text-[#475569]">{cand.duration}</td>
                    <td className="py-3.5 pr-4">
                      <span
                        className={`rounded-full border px-3 py-0.5 text-xs font-bold ${
                          cand.score >= 75
                            ? 'border-[#86EFAC] bg-[#DCFCE7] text-[#15803D]'
                            : cand.score >= 60
                              ? 'border-[#FDE047] bg-[#FEF9C3] text-[#A16207]'
                              : 'border-[#F9A8D4] bg-[#FCE7F3] text-[#BE185D]'
                        }`}
                      >
                        {done ? `${cand.score}/100` : '-----'}
                      </span>
                    </td>
                    <td className="py-3.5 pr-4">
                      <span
                        className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full border px-3 py-0.5 text-xs font-semibold ${
                          done
                            ? 'border-[#86EFAC] bg-[#DCFCE7] text-[#15803D]'
                            : cand.interviewStatus === 'In Progress'
                              ? 'border-[#FDE047] bg-[#FEF9C3] text-[#A16207]'
                              : 'border-[#F9A8D4] bg-[#FCE7F3] text-[#BE185D]'
                        }`}
                      >
                        <GoogleIcon
                          name={done ? 'check_circle' : 'schedule'}
                          size={13}
                        />
                        {cand.interviewStatus}
                      </span>
                    </td>
                    <td className="py-3.5">
                      <button
                        type="button"
                        disabled={!done}
                        onClick={() => onSelectCandidate(cand.id)}
                        className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                          done
                            ? 'bg-[#1D4ED8] text-white hover:bg-[#1E40AF]'
                            : 'cursor-not-allowed bg-[#E2E8F0] text-[#94A3B8]'
                        }`}
                      >
                        <GoogleIcon name="visibility" size={14} />
                        <span>View Results</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
