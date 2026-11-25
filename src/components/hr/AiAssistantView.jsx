import React, { useEffect, useRef, useState } from 'react';
import GoogleIcon from '../GoogleIcon';
import { RECOMMENDED_PROMPTS } from '../../data/mockData';

export default function AiAssistantView({
  messages,
  candidates,
  onSendMessage,
  onApproveCandidate,
  onRejectCandidate,
  onOpenCandidateReport,
  onOpenRequisitions,
  editingReqId,
  copiedText,
  onCopyPrompt,
}) {
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const submitPrompt = (text) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSendMessage(trimmed);
    setInput('');
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col bg-[#F6F7FC] md:h-[calc(100vh-4rem)]">
      {/* Scrollable Chat / Welcome Area */}
      <div className="flex-1 overflow-y-auto px-4 py-8 sm:px-8 lg:px-14">
        {messages.length === 0 ? (
          <div className="mx-auto max-w-4xl pt-4 sm:pt-6">
            <h1 className="text-2xl font-bold text-[#1E293B] sm:text-3xl">
              Welcome to VEYRA AI!
            </h1>
            <p className="mt-1.5 text-sm text-[#475569]">
              I&apos;m your AI assistant. How can I help you today?
            </p>

            {/* Centered Prompt Input in Welcome View matching PDF Page 2 */}
            <div className="mt-8">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  submitPrompt(input);
                }}
                className="flex items-center gap-3 rounded-full border border-[#D8DDF8] bg-gradient-to-r from-[#DCE1FB] via-[#E5E8FC] to-[#ECE9FE] px-4 py-2.5 shadow-sm"
              >
                <button
                  type="button"
                  onClick={() =>
                    submitPrompt('Create a requisition for a Data Engineer in Bangalore')
                  }
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/80 text-[#1D4ED8] transition hover:bg-white"
                  title="Attach or quick-start requisition"
                >
                  <GoogleIcon name="attach_file" size={18} />
                </button>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything"
                  className="w-full bg-transparent text-sm font-medium text-[#1D4ED8] placeholder-[#3B5BDB]/75 outline-none"
                />
                <button
                  type="button"
                  onClick={() => submitPrompt('View approvals')}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/65 text-[#1D4ED8] transition hover:bg-white"
                  title="Voice prompt"
                >
                  <GoogleIcon name="mic" size={18} />
                </button>
                <button
                  type="submit"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/95 text-[#1D4ED8] shadow-sm transition hover:bg-white"
                  title="Send"
                >
                  <GoogleIcon name="arrow_upward" size={18} />
                </button>
              </form>
              <p className="mt-2 text-center text-[11px] font-medium text-[#94A3B8]">
                Verified by Trusted AI
              </p>
            </div>

            {/* Recommended Prompts matching PDF Page 2 */}
            <div className="mt-10">
              <p className="mb-4 text-sm font-medium text-[#334155]">
                Some recommended prompts you can try
              </p>
              <div className="grid gap-4 md:grid-cols-2">
                {RECOMMENDED_PROMPTS.map((group) => (
                  <div
                    key={group.category}
                    className="rounded-2xl border border-[#E5E7F0] bg-[#EEF0FA]/80 p-4"
                  >
                    <p className="mb-3 text-[11px] font-semibold tracking-wider text-[#334155]">
                      {group.category}
                    </p>
                    <div className="space-y-2.5">
                      {group.prompts.map((prompt) => (
                        <div
                          key={prompt}
                          className="flex items-center justify-between gap-2 rounded-xl bg-white px-4 py-3 shadow-sm transition hover:shadow"
                        >
                          <button
                            type="button"
                            onClick={() => submitPrompt(prompt)}
                            className="flex-1 text-left text-xs font-medium text-[#1E293B] hover:text-[#1D4ED8] sm:text-[13px]"
                          >
                            {prompt}
                          </button>
                          <div className="flex shrink-0 items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => onCopyPrompt(prompt)}
                              className="flex h-7 w-7 items-center justify-center rounded-full bg-[#F1F3FC] text-[#4F46E5] transition hover:bg-[#E0E7FF]"
                              title={copiedText === prompt ? 'Copied!' : 'Copy prompt'}
                            >
                              <GoogleIcon
                                name={copiedText === prompt ? 'check' : 'content_copy'}
                                size={14}
                              />
                            </button>
                            <button
                              type="button"
                              onClick={() => submitPrompt(prompt)}
                              className="flex h-7 w-7 items-center justify-center rounded-full bg-[#F1F3FC] text-[#4F46E5] transition hover:bg-[#1D4ED8] hover:text-white"
                              title="Run prompt"
                            >
                              <GoogleIcon name="arrow_forward" size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-4xl space-y-5 pb-4">
            {messages.map((msg) => {
              if (msg.sender === 'user') {
                return (
                  <div key={msg.id} className="flex justify-end">
                    <div className="max-w-lg rounded-2xl bg-[#D8DDF8] px-5 py-3.5 text-[#1E293B] shadow-sm">
                      <p className="text-sm leading-relaxed">{msg.text}</p>
                      <p className="mt-1.5 text-right text-[11px] text-[#475569]">
                        {msg.time}
                      </p>
                    </div>
                  </div>
                );
              }

              return (
                <div key={msg.id} className="space-y-3">
                  {msg.text && (
                    <div className="inline-block max-w-xl rounded-2xl border border-[#E5E7F0] bg-white px-5 py-3.5 shadow-sm">
                      <p className="text-sm text-[#1E293B]">{msg.text}</p>
                      <p className="mt-1.5 text-[11px] text-[#64748B]">{msg.time}</p>
                    </div>
                  )}

                  {/* Inline Requisition Card matching PDF Pages 5 & 8 */}
                  {msg.requisitionCard && (
                    <div className="max-w-md rounded-2xl border border-[#E5E7F0] bg-white p-5 shadow-sm">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-base font-bold text-[#1E293B]">
                          {msg.requisitionCard.title}
                        </h3>
                        <div className="flex gap-1.5">
                          <span className="rounded-full border border-[#86EFAC] bg-[#DCFCE7] px-2.5 py-0.5 text-[11px] font-semibold text-[#15803D]">
                            Good
                          </span>
                          <span className="rounded-full border border-[#FDE047] bg-[#FEF9C3] px-2.5 py-0.5 text-[11px] font-semibold text-[#A16207]">
                            Medium
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-y-2.5 text-xs text-[#334155]">
                        <div className="flex items-center gap-2">
                          <GoogleIcon
                            name="apartment"
                            size={16}
                            className="text-[#475569]"
                          />
                          <span>{msg.requisitionCard.department}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <GoogleIcon
                            name="location_on"
                            size={16}
                            className="text-[#475569]"
                          />
                          <span>{msg.requisitionCard.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <GoogleIcon
                            name="payments"
                            size={16}
                            className="text-[#475569]"
                          />
                          <span>{msg.requisitionCard.salary}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <GoogleIcon name="group" size={16} className="text-[#475569]" />
                          <span>{msg.requisitionCard.openings} position</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <GoogleIcon
                            name="schedule"
                            size={16}
                            className="text-[#475569]"
                          />
                          <span>{msg.requisitionCard.level}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <GoogleIcon
                            name="calendar_today"
                            size={16}
                            className="text-[#475569]"
                          />
                          <span>{msg.requisitionCard.date}</span>
                        </div>
                      </div>

                      <div className="mt-4">
                        <p className="mb-2 text-xs font-medium text-[#334155]">
                          Required Skills
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {msg.requisitionCard.skills.map((skill) => (
                            <span
                              key={skill}
                              className="rounded-full border border-[#CBD5E1] px-2.5 py-0.5 text-[11px] font-medium text-[#334155]"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="mt-5 flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => submitPrompt('View Candidates')}
                          className="rounded-full bg-[#1D4ED8] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#1E40AF]"
                        >
                          View Candidates
                        </button>
                        <button
                          type="button"
                          onClick={() => submitPrompt('Edit')}
                          className="rounded-full border border-[#1D4ED8] px-4 py-2 text-xs font-semibold text-[#1D4ED8] transition hover:bg-[#EEF2FF]"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={onOpenRequisitions}
                          className="rounded-full border border-[#1D4ED8] px-4 py-2 text-xs font-semibold text-[#1D4ED8] transition hover:bg-[#EEF2FF]"
                        >
                          Open Table
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Inline Candidate Evaluation Cards matching PDF Pages 9, 12, 13, 21 */}
                  {msg.candidateCards && (
                    <div className="grid gap-4 md:grid-cols-2">
                      {msg.candidateCards.map((cardItem) => {
                        const liveCand =
                          candidates?.find((c) => c.id === cardItem.id) || cardItem;
                        const isDecided =
                          liveCand.status === 'Approved' ||
                          liveCand.status === 'Unapproved';

                        return (
                          <div
                            key={liveCand.id}
                            className="rounded-2xl border border-[#E5E7F0] bg-white p-5 shadow-sm"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex min-w-0 items-center gap-3">
                                <span className="h-10 w-10 shrink-0 rounded-full bg-gradient-to-br from-[#A78BFA] to-[#6366F1]" />
                                <div className="min-w-0">
                                  <h4 className="truncate text-sm font-bold text-[#1E293B]">
                                    {liveCand.name}
                                  </h4>
                                  <p className="truncate text-xs text-[#64748B]">
                                    {liveCand.jobTitle}
                                  </p>
                                </div>
                              </div>
                              {isDecided && (
                                <span
                                  className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${
                                    liveCand.status === 'Approved'
                                      ? 'border-[#86EFAC] bg-[#DCFCE7] text-[#15803D]'
                                      : 'border-[#F9A8D4] bg-[#FCE7F3] text-[#BE185D]'
                                  }`}
                                >
                                  {liveCand.status === 'Approved'
                                    ? 'Approved'
                                    : 'Rejected'}
                                </span>
                              )}
                            </div>

                            <div className="mt-4 space-y-2 text-xs">
                              <div className="flex items-center justify-between">
                                <span className="flex items-center gap-1.5 text-[#475569]">
                                  <GoogleIcon name="person" size={15} />
                                  Interviewer
                                </span>
                                <span className="font-medium text-[#1E293B]">
                                  {liveCand.interviewer}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="flex items-center gap-1.5 text-[#475569]">
                                  <GoogleIcon name="assessment" size={15} />
                                  Interview Score
                                </span>
                                <span className="rounded-full border border-[#86EFAC] bg-[#DCFCE7] px-2.5 py-0.5 font-semibold text-[#15803D]">
                                  {liveCand.score}/100
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="flex items-center gap-1.5 text-[#475569]">
                                  <GoogleIcon name="calendar_today" size={15} />
                                  Submitted on
                                </span>
                                <span className="font-medium text-[#1E293B]">
                                  {liveCand.dateShort}
                                </span>
                              </div>
                            </div>

                            <div className="mt-4 rounded-xl bg-[#F4F5F7] p-3">
                              <p className="text-xs font-semibold text-[#1E293B]">
                                Interview Feedback
                              </p>
                              <p className="mt-1 text-xs text-[#475569]">
                                {liveCand.feedback}
                              </p>
                            </div>

                            <div className="mt-4 flex flex-wrap items-center gap-2">
                              <button
                                type="button"
                                disabled={isDecided}
                                onClick={() => onApproveCandidate(liveCand.id, true)}
                                className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold transition ${
                                  isDecided
                                    ? 'cursor-not-allowed bg-[#E2E8F0] text-[#94A3B8]'
                                    : 'bg-[#1D4ED8] text-white hover:bg-[#1E40AF]'
                                }`}
                              >
                                <GoogleIcon name="check" size={15} />
                                <span>Approve</span>
                              </button>
                              <button
                                type="button"
                                disabled={isDecided}
                                onClick={() => onRejectCandidate(liveCand.id, true)}
                                className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border px-3 py-2 text-xs font-semibold transition ${
                                  isDecided
                                    ? 'cursor-not-allowed border-[#E2E8F0] bg-white text-[#94A3B8]'
                                    : 'border-[#1D4ED8] bg-white text-[#1D4ED8] hover:bg-[#FDECF2] hover:text-[#BE185D]'
                                }`}
                              >
                                <GoogleIcon name="close" size={15} />
                                <span>Reject</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => onOpenCandidateReport(liveCand.id)}
                                className="inline-flex items-center justify-center rounded-full border border-[#CBD5E1] px-2.5 py-2 text-xs font-semibold text-[#475569] hover:border-[#1D4ED8] hover:text-[#1D4ED8]"
                                title="View full evaluation report"
                              >
                                <GoogleIcon name="visibility" size={15} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Audit Activity List inside Chat */}
                  {msg.auditItems && (
                    <div className="max-w-xl space-y-2 rounded-2xl border border-[#E5E7F0] bg-white p-4 shadow-sm">
                      {msg.auditItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-start justify-between gap-3 border-b border-[#F1F5F9] pb-2 last:border-b-0 last:pb-0"
                        >
                          <div>
                            <p className="text-xs font-semibold text-[#1E293B]">
                              {item.action}
                            </p>
                            <p className="text-[11px] text-[#64748B]">{item.actor}</p>
                          </div>
                          <span className="shrink-0 text-[11px] text-[#64748B]">
                            {item.timestamp}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Bottom Sticky Chat Bar when Conversation Active */}
      {messages.length > 0 && (
        <div className="sticky bottom-0 border-t border-[#E5E7F0] bg-[#F6F7FC] px-4 py-3 sm:px-8">
          <div className="mx-auto max-w-4xl">
            {editingReqId && (
              <p className="mb-1.5 text-xs font-medium text-[#1D4ED8]">
                Editing requisition — try typing: &ldquo;Change the location from
                Bangalore to Hyderabad&rdquo;
              </p>
            )}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submitPrompt(input);
              }}
              className="flex items-center gap-3 rounded-full border border-[#D8DDF8] bg-gradient-to-r from-[#DCE1FB] via-[#E5E8FC] to-[#ECE9FE] px-4 py-2 shadow-sm"
            >
              <button
                type="button"
                onClick={() => submitPrompt('View approvals')}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/80 text-[#1D4ED8]"
                title="Quick actions"
              >
                <GoogleIcon name="attach_file" size={17} />
              </button>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything"
                className="w-full bg-transparent text-sm font-medium text-[#1D4ED8] placeholder-[#3B5BDB]/75 outline-none"
              />
              <button
                type="button"
                onClick={() => submitPrompt('Show recent activity')}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/65 text-[#1D4ED8]"
                title="Voice input"
              >
                <GoogleIcon name="mic" size={17} />
              </button>
              <button
                type="submit"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/95 text-[#1D4ED8] shadow-sm"
                title="Send message"
              >
                <GoogleIcon name="arrow_upward" size={17} />
              </button>
            </form>
            <p className="mt-1.5 text-center text-[11px] font-medium text-[#94A3B8]">
              Verified by Trusted AI
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
