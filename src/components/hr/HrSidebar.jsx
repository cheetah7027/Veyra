import React, { useState } from 'react';
import GoogleIcon from '../GoogleIcon';

const FEATURE_ITEMS = [
  { id: 'requisitions', label: 'Requisitions', icon: 'description' },
  { id: 'candidates', label: 'Candidates', icon: 'group' },
  { id: 'approvals', label: 'Approvals', icon: 'check_box' },
  { id: 'interviews', label: 'Interviews', icon: 'record_voice_over' },
  { id: 'analytics', label: 'Analytics', icon: 'analytics' },
  { id: 'audit', label: 'Audit Logs', icon: 'receipt_long' },
];

export default function HrSidebar({
  activeTab,
  onSelectTab,
  onNewChat,
  chatThreads,
  activeThread,
  onSelectThread,
  pendingApprovalsCount,
}) {
  const [chatsExpanded, setChatsExpanded] = useState(true);

  return (
    <aside className="w-full shrink-0 border-b border-[#E5E7F0] bg-white px-4 py-5 md:w-64 md:border-r md:border-b-0">
      {/* + New Chat CTA matching PDF Page 2 */}
      <button
        type="button"
        onClick={onNewChat}
        className={`flex w-full items-center justify-center gap-2 rounded-full border py-2.5 text-sm font-semibold transition ${
          activeTab === 'chat'
            ? 'border-[#1D4ED8] bg-[#EEF2FF] text-[#1D4ED8]'
            : 'border-[#1D4ED8] bg-white text-[#1D4ED8] hover:bg-[#EEF2FF]'
        }`}
      >
        <GoogleIcon name="add" size={18} />
        <span>New Chat</span>
      </button>

      {/* Features */}
      <div className="mt-6">
        <p className="mb-2 px-3 text-xs font-bold text-[#1E293B]">Features</p>
        <nav className="grid grid-cols-2 gap-1 md:grid-cols-1">
          {FEATURE_ITEMS.map((item) => {
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTab(item.id)}
                className={`flex items-center justify-between rounded-full px-3.5 py-2.5 text-left text-sm transition ${
                  active
                    ? 'bg-[#EEF0FA] font-semibold text-[#1E293B]'
                    : 'font-medium text-[#334155] hover:bg-[#F8F9FD]'
                }`}
              >
                <span className="flex items-center gap-3">
                  <GoogleIcon name={item.icon} size={18} className="text-[#475569]" />
                  <span>{item.label}</span>
                </span>
                {item.id === 'approvals' && pendingApprovalsCount > 0 && (
                  <span className="rounded-full bg-[#ECE9FE] px-2 py-0.5 text-[11px] font-bold text-[#5B48D6]">
                    {pendingApprovalsCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Your Chats matching PDF Page 2 */}
      <div className="mt-7 hidden md:block">
        <button
          type="button"
          onClick={() => setChatsExpanded((v) => !v)}
          className="flex w-full items-center justify-between px-3 text-xs font-bold text-[#1E293B]"
        >
          <span>Your Chats</span>
          <GoogleIcon
            name={chatsExpanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
            size={18}
          />
        </button>

        {chatsExpanded && (
          <ul className="mt-2.5 space-y-1">
            {chatThreads.map((thread) => {
              const selected = activeTab === 'chat' && activeThread === thread;
              return (
                <li key={thread}>
                  <button
                    type="button"
                    onClick={() => onSelectThread(thread)}
                    className={`w-full truncate rounded-lg px-3 py-2 text-left text-xs transition ${
                      selected
                        ? 'bg-[#F4F5FB] font-semibold text-[#1D4ED8]'
                        : 'text-[#334155] hover:bg-[#F8F9FD]'
                    }`}
                  >
                    {thread}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </aside>
  );
}
