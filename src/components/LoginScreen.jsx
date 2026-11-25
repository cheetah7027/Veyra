import React, { useEffect, useState } from 'react';
import GoogleIcon from './GoogleIcon';

export default function LoginScreen({
  initialRole = '',
  initialMode = 'login',
  onLoginSuccess,
  onViewOverview,
}) {
  const [mode, setMode] = useState(initialMode); // 'login' | 'signup' | 'forgot'
  const [role, setRole] = useState(initialRole); // '' | 'hr' | 'candidate'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [resetSent, setResetSent] = useState(false);

  useEffect(() => {
    setRole(initialRole || '');
    setMode(initialMode || 'login');
    setError('');
  }, [initialRole, initialMode]);

  const isFormComplete =
    mode === 'login'
      ? Boolean(role && email.trim() && password.trim())
      : mode === 'signup'
        ? Boolean(
            role &&
              name.trim() &&
              email.trim() &&
              password.trim() &&
              confirmPassword.trim()
          )
        : Boolean(email.trim());

  const handleRoleChange = (nextRole) => {
    setRole(nextRole);
    setError('');
  };

  const handleSwitchMode = (nextMode) => {
    setMode(nextMode);
    setError('');
    setResetSent(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormComplete) return;

    if (!email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    if (mode === 'forgot') {
      setError('');
      setResetSent(true);
      return;
    }

    if (password.length < 4) {
      setError('Password must be at least 4 characters.');
      return;
    }

    if (mode === 'signup' && password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    setError('');
    onLoginSuccess(role, email.trim(), name.trim());
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#B4BBF5] via-[#DCE0FB] to-white px-4 py-10">
      {/* Centered Auth Card matching supplied Login / Sign Up screens */}
      <div className="w-full max-w-[460px] rounded-2xl bg-white px-7 py-9 shadow-[0_12px_36px_rgba(30,41,59,0.08)] sm:px-10 sm:py-10">
        {/* Brand Lockup */}
        <div className="flex items-center justify-center gap-3">
          <span className="text-xl font-extrabold tracking-tight text-[#1D4ED8]">
            VEYRA
          </span>
          <span className="h-5 w-px bg-[#CBD5E1]" />
          <span className="text-sm font-medium text-[#334155]">
            HR/TA Use Case
          </span>
        </div>

        <h1 className="mt-5 text-center text-[22px] font-bold text-[#1E293B]">
          {mode === 'login'
            ? 'Login to continue'
            : mode === 'signup'
              ? 'Sign up to continue'
              : 'Reset your password'}
        </h1>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* Choose Your Role */}
          {mode !== 'forgot' && (
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[#475569]">
                Choose Your Role
              </label>
              <div className="relative">
                <select
                  value={role}
                  onChange={(e) => handleRoleChange(e.target.value)}
                  className={`w-full appearance-none rounded-full border border-[#CBD5E1] bg-white px-4 py-3 pr-10 text-sm outline-none transition focus:border-[#1D4ED8] ${
                    role ? 'text-[#1E293B]' : 'text-[#64748B]'
                  }`}
                >
                  <option value="">Choose Your Role</option>
                  <option value="hr">HR Professional</option>
                  <option value="candidate">Candidate</option>
                </select>
                <GoogleIcon
                  name="keyboard_arrow_down"
                  size={20}
                  className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-[#475569]"
                />
              </div>
            </div>
          )}

          {/* Name (Sign up only) */}
          {mode === 'signup' && (
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[#475569]">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Enter your full name"
                className="w-full rounded-full border border-[#CBD5E1] px-4 py-3 text-sm text-[#1E293B] placeholder-[#64748B] outline-none transition focus:border-[#1D4ED8]"
              />
            </div>
          )}

          {/* Email */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-[#475569]">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError('');
                if (resetSent) setResetSent(false);
              }}
              placeholder="Enter Email"
              className="w-full rounded-full border border-[#CBD5E1] px-4 py-3 text-sm text-[#1E293B] placeholder-[#64748B] outline-none transition focus:border-[#1D4ED8]"
            />
          </div>

          {/* Password */}
          {mode !== 'forgot' && (
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[#475569]">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="Enter your password"
                  className="w-full rounded-full border border-[#CBD5E1] px-4 py-3 pr-11 text-sm text-[#1E293B] placeholder-[#64748B] outline-none transition focus:border-[#1D4ED8]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute top-1/2 right-3.5 -translate-y-1/2 text-[#475569] hover:text-[#1E293B]"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <GoogleIcon
                    name={showPassword ? 'visibility_off' : 'visibility'}
                    size={19}
                  />
                </button>
              </div>
            </div>
          )}

          {/* Confirm Password (Sign up only) */}
          {mode === 'signup' && (
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[#475569]">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="Enter your password"
                  className="w-full rounded-full border border-[#CBD5E1] px-4 py-3 pr-11 text-sm text-[#1E293B] placeholder-[#64748B] outline-none transition focus:border-[#1D4ED8]"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  className="absolute top-1/2 right-3.5 -translate-y-1/2 text-[#475569] hover:text-[#1E293B]"
                  aria-label={
                    showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'
                  }
                >
                  <GoogleIcon
                    name={showConfirmPassword ? 'visibility_off' : 'visibility'}
                    size={19}
                  />
                </button>
              </div>
            </div>
          )}

          {/* Validation Error */}
          {error && (
            <div className="flex items-center gap-2 rounded-xl border border-[#F9A8D4] bg-[#FFF1F2] px-3.5 py-2.5 text-xs font-medium text-[#BE123C]">
              <GoogleIcon name="error" size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Reset confirmation */}
          {resetSent && (
            <div className="flex items-center gap-2 rounded-xl border border-[#86EFAC] bg-[#DCFCE7] px-3.5 py-2.5 text-xs font-medium text-[#15803D]">
              <GoogleIcon name="check_circle" size={16} />
              <span>Password reset instructions sent to {email}.</span>
            </div>
          )}

          {/* Submit Button matching exact disabled gray / active blue pill */}
          <button
            type="submit"
            disabled={!isFormComplete}
            className={`mt-2 w-full rounded-full py-3 text-sm font-semibold transition ${
              isFormComplete
                ? 'bg-[#1D4ED8] text-white shadow-sm hover:bg-[#1E40AF]'
                : 'cursor-not-allowed bg-[#E5E7EB] text-[#9CA3AF]'
            }`}
          >
            {mode === 'forgot' ? 'Send Reset Link' : 'Login'}
          </button>
        </form>

        {/* Footer Action Links matching exact layout of screenshots */}
        <div className="mt-4 space-y-2.5 text-left">
          {mode === 'login' && (
            <>
              <div>
                <button
                  type="button"
                  onClick={() => handleSwitchMode('forgot')}
                  className="text-xs font-medium text-[#1D4ED8] hover:underline"
                >
                  Forgot Email / Password?
                </button>
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => handleSwitchMode('signup')}
                  className="text-xs font-medium text-[#1D4ED8] hover:underline"
                >
                  New here? Sign up to get started
                </button>
              </div>
            </>
          )}

          {mode === 'signup' && (
            <div>
              <button
                type="button"
                onClick={() => handleSwitchMode('login')}
                className="text-xs font-medium text-[#1D4ED8] hover:underline"
              >
                Sign in instead
              </button>
            </div>
          )}

          {mode === 'forgot' && (
            <div>
              <button
                type="button"
                onClick={() => handleSwitchMode('login')}
                className="text-xs font-medium text-[#1D4ED8] hover:underline"
              >
                Back to Login
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Subtle bottom link to Platform Overview */}
      <button
        type="button"
        onClick={onViewOverview}
        className="mt-6 text-xs font-medium text-[#475569] hover:text-[#1D4ED8] hover:underline"
      >
        Explore VEYRA Platform Overview
      </button>
    </div>
  );
}
