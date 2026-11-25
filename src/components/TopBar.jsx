import React, { useEffect, useRef, useState } from 'react';
import GoogleIcon from './GoogleIcon';

export default function TopBar({
  workspace,
  userEmail,
  onGoToLogin,
  onSignOut,
  onOpenOverview,
  notificationsCount = 0,
  auditLogs = [],
}) {
  const [openMenu, setOpenMenu] = useState(null); // null | 'help' | 'notif' | 'profile'
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenu(null);
      }
    };
    const handleEsc = (e) => {
      if (e.key === 'Escape') setOpenMenu(null);
    };
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleEsc);
    };
  }, []);

  const toggleMenu = (name) => {
    setOpenMenu((prev) => (prev === name ? null : name));
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-[#E5E7F0] bg-white px-4 sm:px-6">
      {/* Left Brand Title matching PDF header */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenOverview}
          className="flex items-center gap-2.5 text-left"
        >
          <span className="text-xl font-extrabold tracking-tight text-[#1D4ED8]">
            VEYRA
          </span>
          <span className="hidden h-5 w-px bg-[#CBD5E1] sm:inline-block" />
          <span className="hidden text-sm font-medium text-[#1E293B] md:inline">
            AI Interview &amp; Talent Intelligence Platform
          </span>
        </button>
      </div>

      {/* Right Utility Icons matching PDF Topbar (No center switcher) */}
      {workspace === 'landing' ? (
        <div className="flex items-center gap-2.5 sm:gap-3">
          <button
            type="button"
            onClick={() => onGoToLogin('', 'login')}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#CBD5E1] bg-white px-4 py-2 text-xs font-semibold text-[#1E293B] transition hover:border-[#1D4ED8] hover:text-[#1D4ED8]"
          >
            <GoogleIcon name="login" size={16} />
            <span>Login</span>
          </button>
          <button
            type="button"
            onClick={() => onGoToLogin('', 'signup')}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#1D4ED8] px-5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[#1E40AF]"
          >
            <GoogleIcon name="person_add" size={16} />
            <span>Sign Up</span>
          </button>
        </div>
      ) : (
        <div ref={menuRef} className="relative flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => toggleMenu('help')}
            className={`inline-flex h-9 w-9 items-center justify-center rounded-full transition ${
              openMenu === 'help'
                ? 'bg-[#EEF2FF] text-[#1D4ED8]'
                : 'text-[#1D4ED8] hover:bg-[#F4F5FB]'
            }`}
            title="Help & Platform Guide"
            aria-expanded={openMenu === 'help'}
          >
            <GoogleIcon name="help" size={21} />
          </button>

          <button
            type="button"
            onClick={() => toggleMenu('notif')}
            className={`relative inline-flex h-9 w-9 items-center justify-center rounded-full transition ${
              openMenu === 'notif'
                ? 'bg-[#EEF2FF] text-[#1D4ED8]'
                : 'text-[#1D4ED8] hover:bg-[#F4F5FB]'
            }`}
            title="Notifications"
            aria-expanded={openMenu === 'notif'}
          >
            <GoogleIcon name="notifications" size={21} />
            {notificationsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#E11D48]" />
            )}
          </button>

          <button
            type="button"
            onClick={() => toggleMenu('profile')}
            className="inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-semibold text-[#1E293B] transition hover:bg-[#F4F5FB]"
            title="Account menu"
            aria-expanded={openMenu === 'profile'}
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[#8B7AE8] to-[#1D4ED8] text-[11px] font-bold text-white">
              {workspace === 'candidate' ? 'SJ' : 'HR'}
            </span>
            <GoogleIcon name="keyboard_arrow_down" size={18} className="text-[#475569]" />
          </button>

          {/* Help Popover */}
          {openMenu === 'help' && (
            <div className="absolute top-12 right-0 z-50 w-72 rounded-2xl border border-[#E5E7F0] bg-white p-4 shadow-xl">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-xs font-bold text-[#1E293B]">VEYRA Help</p>
                <button
                  type="button"
                  onClick={() => setOpenMenu(null)}
                  className="text-[#64748B] hover:text-[#1E293B]"
                >
                  <GoogleIcon name="close" size={16} />
                </button>
              </div>
              <p className="text-xs leading-relaxed text-[#475569]">
                {workspace === 'candidate'
                  ? 'Review your upcoming interviews, complete the microphone readiness check, and record your responses inside the Interview Room.'
                  : 'Use the AI Assistant or left sidebar modules to create requisitions, track candidates, review interview reports, and approve decisions.'}
              </p>
            </div>
          )}

          {/* Notifications Popover */}
          {openMenu === 'notif' && (
            <div className="absolute top-12 right-0 z-50 w-80 rounded-2xl border border-[#E5E7F0] bg-white p-4 shadow-xl">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-bold text-[#1E293B]">Recent Activity</p>
                <button
                  type="button"
                  onClick={() => setOpenMenu(null)}
                  className="text-[#64748B] hover:text-[#1E293B]"
                >
                  <GoogleIcon name="close" size={16} />
                </button>
              </div>
              <div className="space-y-2.5">
                {auditLogs.slice(0, 3).map((log) => (
                  <div
                    key={log.id}
                    className="rounded-xl border border-[#E5E7F0] bg-[#F8F9FD] p-2.5 text-xs"
                  >
                    <p className="font-medium text-[#1E293B]">{log.action}</p>
                    <p className="mt-1 text-[11px] text-[#64748B]">
                      {log.actor} · {log.timestamp}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Profile Menu: Switch Account / Sign Out */}
          {openMenu === 'profile' && (
            <div className="absolute top-12 right-0 z-50 w-64 rounded-2xl border border-[#E5E7F0] bg-white p-2 shadow-xl">
              <div className="border-b border-[#F1F5F9] px-3 py-2">
                <p className="text-xs font-bold text-[#1E293B]">
                  {workspace === 'candidate' ? 'Sarah Johnson' : 'HR / Talent Acquisition'}
                </p>
                <p className="truncate text-[11px] text-[#64748B]">
                  {userEmail ||
                    (workspace === 'candidate'
                      ? 'sarah.johnson@email.com'
                      : 'hr.operations@veyra.ai')}
                </p>
              </div>
              <div className="mt-1 space-y-1">
                <button
                  type="button"
                  onClick={() => {
                    onGoToLogin(workspace === 'candidate' ? 'hr' : 'candidate');
                    setOpenMenu(null);
                  }}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-medium text-[#334155] transition hover:bg-[#F8F9FD]"
                >
                  <GoogleIcon name="switch_account" size={16} />
                  <span>
                    Switch to {workspace === 'candidate' ? 'HR Platform' : 'Candidate Portal'}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onOpenOverview();
                    setOpenMenu(null);
                  }}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-medium text-[#334155] transition hover:bg-[#F8F9FD]"
                >
                  <GoogleIcon name="home" size={16} />
                  <span>Platform Overview</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onSignOut();
                    setOpenMenu(null);
                  }}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-semibold text-[#BE185D] transition hover:bg-[#FFF1F2]"
                >
                  <GoogleIcon name="logout" size={16} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
