import React, { useMemo, useState } from 'react';
import GoogleIcon from '../GoogleIcon';
import SelectField from '../SelectField';

function ScorePill({ score }) {
  const cls =
    score >= 75
      ? 'border-[#86EFAC] bg-[#DCFCE7] text-[#15803D]'
      : score >= 60
        ? 'border-[#FDE047] bg-[#FEF9C3] text-[#A16207]'
        : 'border-[#F9A8D4] bg-[#FCE7F3] text-[#BE185D]';
  return (
    <span className={`inline-block rounded-full border px-3 py-0.5 text-xs font-bold ${cls}`}>
      {score}/100
    </span>
  );
}

function CandidateStatusPill({ status }) {
  const cls =
    status === 'Approved'
      ? 'border-[#86EFAC] bg-[#DCFCE7] text-[#15803D]'
      : status === 'In Progress' || status === 'Pending'
        ? 'border-[#FDE047] bg-[#FEF9C3] text-[#A16207]'
        : 'border-[#F9A8D4] bg-[#FCE7F3] text-[#BE185D]';
  const icon =
    status === 'Approved'
      ? 'check_circle'
      : status === 'In Progress' || status === 'Pending'
        ? 'error'
        : 'cancel';

  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1 text-xs font-semibold ${cls}`}
    >
      <GoogleIcon name={icon} size={14} />
      <span>{status}</span>
    </span>
  );
}

export default function CandidatesView({ candidates, onOpenReport }) {
  const [search, setSearch] = useState('');
  const [jobFilter, setJobFilter] = useState('All Jobs');
  const [statusFilter, setStatusFilter] = useState('All Status');

  const jobOptions = useMemo(
    () => ['All Jobs', ...Array.from(new Set(candidates.map((c) => c.jobTitle)))],
    [candidates]
  );

  const filtered = useMemo(() => {
    return candidates.filter((c) => {
      const q = search.toLowerCase();
      const matchQuery =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.jobTitle.toLowerCase().includes(q);
      const matchJob = jobFilter === 'All Jobs' || c.jobTitle === jobFilter;
      const matchStatus = statusFilter === 'All Status' || c.status === statusFilter;
      return matchQuery && matchJob && matchStatus;
    });
  }, [candidates, search, jobFilter, statusFilter]);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#F6F7FC] p-5 sm:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1E293B]">Candidates</h1>
        <p className="text-sm text-[#64748B]">View and manage all candidates</p>
      </div>

      <div className="rounded-3xl border border-[#E5E7F0] bg-white p-5 shadow-sm">
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <div className="flex min-w-[220px] flex-1 items-center justify-between rounded-full bg-gradient-to-r from-[#DCE1FB] to-[#ECE9FE] px-4 py-2.5">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Candidates"
              className="w-full bg-transparent text-sm font-medium text-[#1D4ED8] placeholder-[#3B5BDB]/80 outline-none"
            />
            <GoogleIcon name="search" size={18} className="text-[#1D4ED8]" />
          </div>

          <SelectField
            variant="filter"
            value={jobFilter}
            onChange={(e) => setJobFilter(e.target.value)}
            ariaLabel="Filter candidates by job"
            className="min-w-[140px]"
          >
            {jobOptions.map((j) => (
              <option key={j}>{j}</option>
            ))}
          </SelectField>

          <SelectField
            variant="filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            ariaLabel="Filter candidates by status"
            className="min-w-[140px]"
          >
            <option>All Status</option>
            <option>Approved</option>
            <option>Pending</option>
            <option>In Progress</option>
            <option>Unapproved</option>
          </SelectField>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <GoogleIcon name="person_off" size={44} className="text-[#CBD5E1]" />
            <p className="mt-3 text-base font-semibold text-[#94A3B8]">
              No candidate found
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[780px] text-left text-sm">
              <thead>
                <tr className="border-b border-[#E5E7F0] text-xs font-semibold text-[#334155]">
                  <th className="py-3 pr-4">Candidate</th>
                  <th className="py-3 pr-4">Job Title</th>
                  <th className="py-3 pr-4">Experience</th>
                  <th className="py-3 pr-4">Submitted on</th>
                  <th className="py-3 pr-4">Score</th>
                  <th className="py-3 pr-4">Status</th>
                  <th className="py-3">Evaluation</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((cand) => (
                  <tr
                    key={cand.id}
                    className="border-b border-[#F1F5F9] last:border-b-0 hover:bg-[#F8F9FD]"
                  >
                    <td className="py-3.5 pr-4 font-semibold text-[#1E293B]">
                      {cand.name}
                    </td>
                    <td className="py-3.5 pr-4 text-[#475569]">{cand.jobTitle}</td>
                    <td className="py-3.5 pr-4 text-[#475569]">{cand.experience}</td>
                    <td className="py-3.5 pr-4 text-[#475569]">{cand.submittedOn}</td>
                    <td className="py-3.5 pr-4">
                      <ScorePill score={cand.score} />
                    </td>
                    <td className="py-3.5 pr-4">
                      <CandidateStatusPill status={cand.status} />
                    </td>
                    <td className="py-3.5">
                      <button
                        type="button"
                        onClick={() => onOpenReport(cand.id)}
                        className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-[#1D4ED8] px-3.5 py-1.5 text-xs font-semibold text-white transition hover:bg-[#1E40AF]"
                      >
                        <GoogleIcon name="visibility" size={14} />
                        <span>View Results</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
