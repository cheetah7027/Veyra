import React, { useMemo, useState } from 'react';
import GoogleIcon from '../GoogleIcon';
import SelectField from '../SelectField';

function ApprovalCard({ cand, onApprove, onReject, onOpenReport }) {
  return (
    <div className="flex flex-col justify-between rounded-2xl border border-[#E5E7F0] bg-white p-5 shadow-sm">
      <div>
        <div className="flex items-center gap-3">
          <span className="h-10 w-10 shrink-0 rounded-full bg-gradient-to-br from-[#A78BFA] to-[#6366F1]" />
          <div className="min-w-0">
            <button
              type="button"
              onClick={() => onOpenReport(cand.id)}
              className="truncate text-base font-bold text-[#1E293B] hover:text-[#1D4ED8]"
            >
              {cand.name}
            </button>
            <p className="truncate text-xs text-[#64748B]">{cand.jobTitle}</p>
          </div>
        </div>

        <div className="mt-4 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-[#475569]">
              <GoogleIcon name="person" size={15} />
              Interviewer
            </span>
            <span className="font-medium text-[#1E293B]">{cand.interviewer}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-[#475569]">
              <GoogleIcon name="assessment" size={15} />
              Interview Score
            </span>
            <span className="rounded-full border border-[#86EFAC] bg-[#DCFCE7] px-2.5 py-0.5 font-semibold text-[#15803D]">
              {cand.score}/100
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-[#475569]">
              <GoogleIcon name="calendar_today" size={15} />
              Submitted on
            </span>
            <span className="font-medium text-[#1E293B]">{cand.dateShort}</span>
          </div>
        </div>

        <div className="mt-4 rounded-xl bg-[#F4F5F7] p-3">
          <p className="text-xs font-semibold text-[#1E293B]">Interview Feedback</p>
          <p className="mt-1 text-xs leading-relaxed text-[#475569]">{cand.feedback}</p>
        </div>
      </div>

      <div className="mt-5 flex gap-2.5">
        <button
          type="button"
          onClick={() => onApprove(cand.id)}
          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-[#1D4ED8] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#1E40AF]"
        >
          <GoogleIcon name="check" size={15} />
          <span>Approve</span>
        </button>
        <button
          type="button"
          onClick={() => onReject(cand.id)}
          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border border-[#1D4ED8] bg-white px-4 py-2 text-xs font-semibold text-[#1D4ED8] transition hover:bg-[#FDECF2] hover:text-[#BE185D]"
        >
          <GoogleIcon name="close" size={15} />
          <span>Reject</span>
        </button>
      </div>
    </div>
  );
}

export default function ApprovalsView({
  candidates,
  onApprove,
  onReject,
  onOpenReport,
}) {
  const [jobFilter, setJobFilter] = useState('All Jobs');

  const pendingCandidates = useMemo(() => {
    return candidates.filter((c) => {
      const isPending = c.status === 'Pending' || c.status === 'In Progress';
      const matchJob = jobFilter === 'All Jobs' || c.jobTitle === jobFilter;
      return isPending && matchJob;
    });
  }, [candidates, jobFilter]);

  const techCandidates = useMemo(
    () =>
      pendingCandidates.filter(
        (c) =>
          c.department === 'Engineering' ||
          c.department === 'IT' ||
          c.department === 'Design'
      ),
    [pendingCandidates]
  );

  const jobOptions = useMemo(
    () => ['All Jobs', ...Array.from(new Set(candidates.map((c) => c.jobTitle)))],
    [candidates]
  );

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#F6F7FC] p-5 sm:p-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1E293B]">Approvals</h1>
          <p className="text-sm text-[#64748B]">
            Maker-checker approval workflow for requisitions
          </p>
        </div>

        <SelectField
          variant="filter"
          value={jobFilter}
          onChange={(e) => setJobFilter(e.target.value)}
          ariaLabel="Filter approvals by job"
          className="min-w-[150px]"
        >
          {jobOptions.map((j) => (
            <option key={j}>{j}</option>
          ))}
        </SelectField>
      </div>

      {pendingCandidates.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-28 text-center">
          <GoogleIcon name="verified" size={44} className="text-[#CBD5E1]" />
          <p className="mt-3 text-base font-semibold text-[#94A3B8]">
            No approval pending
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          <div>
            <h2 className="mb-4 text-sm font-bold text-[#1E293B]">Recent candidates</h2>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {pendingCandidates.map((cand) => (
                <ApprovalCard
                  key={cand.id}
                  cand={cand}
                  onApprove={onApprove}
                  onReject={onReject}
                  onOpenReport={onOpenReport}
                />
              ))}
            </div>
          </div>

          {techCandidates.length > 0 && (
            <div>
              <h2 className="mb-4 text-sm font-bold text-[#1E293B]">Tech Based-jobs</h2>
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {techCandidates.map((cand) => (
                  <ApprovalCard
                    key={`tech-${cand.id}`}
                    cand={cand}
                    onApprove={onApprove}
                    onReject={onReject}
                    onOpenReport={onOpenReport}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
