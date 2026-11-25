import React, { useMemo, useState } from 'react';
import GoogleIcon from '../GoogleIcon';
import SelectField from '../SelectField';

function StatusBadge({ status }) {
  const styles =
    status === 'Approved'
      ? 'border-[#86EFAC] bg-[#DCFCE7] text-[#15803D]'
      : status === 'Pending'
        ? 'border-[#FDE047] bg-[#FEF9C3] text-[#A16207]'
        : 'border-[#F9A8D4] bg-[#FCE7F3] text-[#BE185D]';

  const icon =
    status === 'Approved'
      ? 'check_circle'
      : status === 'Pending'
        ? 'error'
        : 'cancel';

  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1 text-xs font-semibold ${styles}`}
    >
      <GoogleIcon name={icon} size={14} />
      <span>{status}</span>
    </span>
  );
}

export default function RequisitionsView({ requisitions, onCreateRequisition }) {
  const [search, setSearch] = useState('');
  const [jobFilter, setJobFilter] = useState('All Jobs');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [isCreating, setIsCreating] = useState(false);
  const [titleError, setTitleError] = useState('');

  const [form, setForm] = useState({
    jobTitle: '',
    department: '',
    location: '',
    openings: '1',
    workType: 'Hybrid',
    experience: '',
    skills: '',
    salary: '',
    description: '',
    hiringManager: 'Sarah Johnson',
    approver: 'Alex Johnson',
    questionsCount: '10 Questions',
    duration: '45 minutes',
    uploadedFile: '',
  });

  const jobOptions = useMemo(
    () => ['All Jobs', ...Array.from(new Set(requisitions.map((r) => r.jobTitle)))],
    [requisitions]
  );

  const filtered = useMemo(() => {
    return requisitions.filter((r) => {
      const q = search.toLowerCase();
      const matchQuery =
        !q ||
        r.jobTitle.toLowerCase().includes(q) ||
        r.department.toLowerCase().includes(q) ||
        r.location.toLowerCase().includes(q) ||
        r.hiringManager.toLowerCase().includes(q);
      const matchJob = jobFilter === 'All Jobs' || r.jobTitle === jobFilter;
      const matchStatus = statusFilter === 'All Status' || r.status === statusFilter;
      return matchQuery && matchJob && matchStatus;
    });
  }, [requisitions, search, jobFilter, statusFilter]);

  const handleCreateSubmit = (statusLabel) => {
    if (!form.jobTitle.trim()) {
      setTitleError('Please enter a Job Title before submitting.');
      return;
    }
    setTitleError('');
    onCreateRequisition({
      ...form,
      openings: Number(form.openings) || 1,
      status: statusLabel,
    });
    setForm({
      jobTitle: '',
      department: '',
      location: '',
      openings: '1',
      workType: 'Hybrid',
      experience: '',
      skills: '',
      salary: '',
      description: '',
      hiringManager: 'Sarah Johnson',
      approver: 'Alex Johnson',
      questionsCount: '10 Questions',
      duration: '45 minutes',
      uploadedFile: '',
    });
    setIsCreating(false);
  };

  if (isCreating) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-[#F6F7FC] p-5 sm:p-8">
        <div className="mx-auto max-w-5xl">
          <button
            type="button"
            onClick={() => {
              setTitleError('');
              setIsCreating(false);
            }}
            className="mb-3 inline-flex items-center gap-2 text-xs font-medium text-[#64748B] hover:text-[#1D4ED8]"
          >
            <GoogleIcon name="arrow_back" size={16} />
            <span>Requisitions / Create Requisition</span>
          </button>

          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-[#1E293B]">Create Requisition</h1>
              <p className="text-xs text-[#64748B]">
                Set up a new job requisition and interview configuration
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleCreateSubmit('Pending')}
                className="inline-flex items-center gap-2 rounded-full border border-[#1D4ED8] bg-white px-5 py-2 text-xs font-semibold text-[#1D4ED8] transition hover:bg-[#EEF2FF]"
              >
                <GoogleIcon name="save" size={16} />
                <span>Save Draft</span>
              </button>
              <button
                type="button"
                onClick={() => handleCreateSubmit('Approved')}
                className="inline-flex items-center gap-2 rounded-full bg-[#1D4ED8] px-5 py-2 text-xs font-semibold text-white transition hover:bg-[#1E40AF]"
              >
                <GoogleIcon name="public" size={16} />
                <span>Submit Requisition</span>
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {/* Job Details Card */}
            <div className="rounded-2xl border border-[#E5E7F0] bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-base font-bold text-[#1E293B]">Job Details</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-xs font-medium text-[#334155]">
                    Job Title <span className="text-[#E11D48]">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.jobTitle}
                    onChange={(e) => {
                      setForm({ ...form, jobTitle: e.target.value });
                      if (titleError) setTitleError('');
                    }}
                    placeholder="e.g., Senior Frontend Developer"
                    className={`w-full rounded-full border px-4 py-2.5 text-sm outline-none ${
                      titleError
                        ? 'border-[#E11D48] focus:border-[#E11D48]'
                        : 'border-[#E2E8F0] focus:border-[#1D4ED8]'
                    }`}
                  />
                  {titleError && (
                    <p className="mt-1.5 text-xs font-medium text-[#E11D48]">
                      {titleError}
                    </p>
                  )}
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-[#334155]">
                    Department
                  </label>
                  <SelectField
                    value={form.department}
                    onChange={(e) => setForm({ ...form, department: e.target.value })}
                    ariaLabel="Department"
                  >
                    <option value="">Select a department</option>
                    <option value="Engineering">Engineering</option>
                    <option value="IT">IT</option>
                    <option value="Product">Product</option>
                    <option value="Design">Design</option>
                    <option value="Sales">Sales</option>
                  </SelectField>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-[#334155]">
                    Location
                  </label>
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    placeholder="e.g., Bengaluru"
                    className="w-full rounded-full border border-[#E2E8F0] px-4 py-2.5 text-sm outline-none focus:border-[#1D4ED8]"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-[#334155]">
                    Work Type
                  </label>
                  <SelectField
                    value={form.workType}
                    onChange={(e) => setForm({ ...form, workType: e.target.value })}
                    ariaLabel="Work Type"
                  >
                    <option value="Hybrid">Hybrid</option>
                    <option value="Remote">Remote</option>
                    <option value="Onsite">Onsite</option>
                  </SelectField>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-[#334155]">
                    Openings
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={form.openings}
                    onChange={(e) => setForm({ ...form, openings: e.target.value })}
                    className="w-full rounded-full border border-[#E2E8F0] px-4 py-2.5 text-sm outline-none focus:border-[#1D4ED8]"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-[#334155]">
                    Experience Required
                  </label>
                  <SelectField
                    value={form.experience}
                    onChange={(e) => setForm({ ...form, experience: e.target.value })}
                    ariaLabel="Experience Required"
                  >
                    <option value="">Select experience level</option>
                    <option value="0-2 years">Entry-level (0-2 years)</option>
                    <option value="2-5 years">Mid-level (2-5 years)</option>
                    <option value="5+ years">Senior (5+ years)</option>
                  </SelectField>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-[#334155]">
                    Required Skills
                  </label>
                  <input
                    type="text"
                    value={form.skills}
                    onChange={(e) => setForm({ ...form, skills: e.target.value })}
                    placeholder="Java, Python, React"
                    className="w-full rounded-full border border-[#E2E8F0] px-4 py-2.5 text-sm outline-none focus:border-[#1D4ED8]"
                  />
                </div>
              </div>
            </div>

            {/* Compensation Card */}
            <div className="rounded-2xl border border-[#E5E7F0] bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-base font-bold text-[#1E293B]">Compensation</h2>
              <label className="mb-1.5 block text-xs font-medium text-[#334155]">
                Salary in Rupees (per annum)
              </label>
              <input
                type="text"
                value={form.salary}
                onChange={(e) => setForm({ ...form, salary: e.target.value })}
                placeholder="e.g., ₹12-18 LPA"
                className="w-full rounded-full border border-[#E2E8F0] px-4 py-2.5 text-sm outline-none focus:border-[#1D4ED8]"
              />
            </div>

            {/* Role Description Card */}
            <div className="rounded-2xl border border-[#E5E7F0] bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-base font-bold text-[#1E293B]">
                Role Description
              </h2>
              <input
                type="text"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Enter role overview or responsibilities"
                className="w-full rounded-full border border-[#E2E8F0] px-4 py-2.5 text-sm outline-none focus:border-[#1D4ED8]"
              />
              <div className="my-4 flex items-center gap-3 text-xs text-[#94A3B8]">
                <span className="h-px flex-1 bg-[#E2E8F0]" />
                <span>or</span>
                <span className="h-px flex-1 bg-[#E2E8F0]" />
              </div>
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-[#CBD5E1] bg-[#F8F9FD] p-6 text-center hover:border-[#1D4ED8]">
                <GoogleIcon name="upload" size={22} className="text-[#1D4ED8]" />
                <span className="mt-2 text-xs font-semibold text-[#1E293B]">
                  {form.uploadedFile || 'Drag and drop files or browse on computer'}
                </span>
                <span className="mt-1 text-[11px] text-[#64748B]">
                  Supported formats: PPT, PDF, Word
                </span>
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) =>
                    setForm({
                      ...form,
                      uploadedFile: e.target.files?.[0]?.name || '',
                    })
                  }
                />
              </label>
            </div>

            {/* Interview Configuration & Approvers */}
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-2xl border border-[#E5E7F0] bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-base font-bold text-[#1E293B]">
                  Approvals Assignment
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-[#334155]">
                      Hiring Manager
                    </label>
                    <SelectField
                      value={form.hiringManager}
                      onChange={(e) => setForm({ ...form, hiringManager: e.target.value })}
                      ariaLabel="Hiring Manager"
                    >
                      <option>Sarah Johnson</option>
                      <option>Maria Smith</option>
                      <option>Alex Johnson</option>
                    </SelectField>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-[#334155]">
                      Approvers
                    </label>
                    <SelectField
                      value={form.approver}
                      onChange={(e) => setForm({ ...form, approver: e.target.value })}
                      ariaLabel="Approvers"
                    >
                      <option>Alex Johnson</option>
                      <option>David Brown</option>
                      <option>Emily Davis</option>
                    </SelectField>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-[#E5E7F0] bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-base font-bold text-[#1E293B]">
                  Interview Configuration
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-[#334155]">
                      No. of Questions
                    </label>
                    <SelectField
                      value={form.questionsCount}
                      onChange={(e) => setForm({ ...form, questionsCount: e.target.value })}
                      ariaLabel="Number of Questions"
                    >
                      <option>8 Questions</option>
                      <option>10 Questions</option>
                      <option>12 Questions</option>
                    </SelectField>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-[#334155]">
                      Interview Duration
                    </label>
                    <SelectField
                      value={form.duration}
                      onChange={(e) => setForm({ ...form, duration: e.target.value })}
                      ariaLabel="Interview Duration"
                    >
                      <option>30 minutes</option>
                      <option>45 minutes</option>
                      <option>1 hour</option>
                    </SelectField>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#F6F7FC] p-5 sm:p-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1E293B]">Requisitions</h1>
          <p className="text-sm text-[#64748B]">Manage all open job requisitions</p>
        </div>
        <button
          type="button"
          onClick={() => setIsCreating(true)}
          className="inline-flex items-center gap-2 rounded-full bg-[#1D4ED8] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1E40AF]"
        >
          <GoogleIcon name="add" size={18} />
          <span>Create Requisition</span>
        </button>
      </div>

      {/* Filter & Table Card matching PDF Page 14 */}
      <div className="rounded-3xl border border-[#E5E7F0] bg-white p-5 shadow-sm">
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <div className="flex min-w-[220px] flex-1 items-center justify-between rounded-full bg-gradient-to-r from-[#DCE1FB] to-[#ECE9FE] px-4 py-2.5">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Requisitions or Managers"
              className="w-full bg-transparent text-sm font-medium text-[#1D4ED8] placeholder-[#3B5BDB]/80 outline-none"
            />
            <GoogleIcon name="search" size={18} className="text-[#1D4ED8]" />
          </div>

          <SelectField
            variant="filter"
            value={jobFilter}
            onChange={(e) => setJobFilter(e.target.value)}
            ariaLabel="Filter requisitions by job"
            className="min-w-[140px]"
          >
            {jobOptions.map((opt) => (
              <option key={opt}>{opt}</option>
            ))}
          </SelectField>

          <SelectField
            variant="filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            ariaLabel="Filter requisitions by status"
            className="min-w-[140px]"
          >
            <option>All Status</option>
            <option>Approved</option>
            <option>Pending</option>
            <option>Unapproved</option>
          </SelectField>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <GoogleIcon name="work_off" size={44} className="text-[#CBD5E1]" />
            <p className="mt-3 text-base font-semibold text-[#94A3B8]">
              No requisitions yet
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-b border-[#E5E7F0] text-xs font-semibold text-[#334155]">
                  <th className="py-3 pr-4">Job Title</th>
                  <th className="py-3 pr-4">Department</th>
                  <th className="py-3 pr-4">Location</th>
                  <th className="py-3 pr-4">Openings</th>
                  <th className="py-3 pr-4">Created on</th>
                  <th className="py-3 pr-4">Hiring Manager</th>
                  <th className="py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((req) => (
                  <tr
                    key={req.id}
                    className="border-b border-[#F1F5F9] last:border-b-0 hover:bg-[#F8F9FD]"
                  >
                    <td className="py-3.5 pr-4 font-semibold text-[#1E293B]">
                      {req.jobTitle}
                    </td>
                    <td className="py-3.5 pr-4 text-[#475569]">{req.department}</td>
                    <td className="py-3.5 pr-4 text-[#475569]">{req.location}</td>
                    <td className="py-3.5 pr-4 text-[#475569]">{req.openings}</td>
                    <td className="py-3.5 pr-4 text-[#475569]">{req.createdOn}</td>
                    <td className="py-3.5 pr-4 text-[#475569]">{req.hiringManager}</td>
                    <td className="py-3.5">
                      <StatusBadge status={req.status} />
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
