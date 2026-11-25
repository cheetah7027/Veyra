import React from 'react';
import GoogleIcon from '../GoogleIcon';

export default function AuditLogsView({ logs }) {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#F6F7FC] p-5 sm:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1E293B]">Audit Logs</h1>
        <p className="text-sm text-[#64748B]">
          Governed and auditable trail of requisitions, candidate actions, and approvals
        </p>
      </div>

      <div className="rounded-3xl border border-[#E5E7F0] bg-white p-5 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead>
              <tr className="border-b border-[#E5E7F0] text-xs font-semibold text-[#334155]">
                <th className="py-3 pr-4">Log ID</th>
                <th className="py-3 pr-4">Timestamp</th>
                <th className="py-3 pr-4">Actor</th>
                <th className="py-3 pr-4">Action</th>
                <th className="py-3 pr-4">Module</th>
                <th className="py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr
                  key={log.id}
                  className="border-b border-[#F1F5F9] last:border-b-0 hover:bg-[#F8F9FD]"
                >
                  <td className="py-3.5 pr-4 font-mono text-xs font-semibold text-[#1D4ED8]">
                    {log.id}
                  </td>
                  <td className="py-3.5 pr-4 text-xs text-[#64748B]">{log.timestamp}</td>
                  <td className="py-3.5 pr-4 font-medium text-[#1E293B]">{log.actor}</td>
                  <td className="py-3.5 pr-4 text-[#334155]">{log.action}</td>
                  <td className="py-3.5 pr-4">
                    <span className="rounded-full bg-[#EEF0FA] px-2.5 py-0.5 text-xs font-semibold text-[#4F46E5]">
                      {log.module}
                    </span>
                  </td>
                  <td className="py-3.5">
                    <span className="inline-flex items-center gap-1 rounded-full border border-[#86EFAC] bg-[#DCFCE7] px-2.5 py-0.5 text-xs font-semibold text-[#15803D]">
                      <GoogleIcon name="verified" size={13} />
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
