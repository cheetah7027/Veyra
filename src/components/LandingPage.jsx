import React, { useState } from 'react';
import GoogleIcon from './GoogleIcon';

const VALUE_CARDS = [
  {
    icon: 'chat_bubble_outline',
    title: 'Conversational Interface',
    text: 'Engage with your ATS using natural dialogue to create, approve, or update requisitions instantly.',
  },
  {
    icon: 'bolt',
    title: 'Automated Shortlisting',
    text: 'AI reviews resumes and swiftly matches them to the best candidates.',
  },
  {
    icon: 'calendar_today',
    title: 'Integrated Scheduling',
    text: 'Sync calendars, coordinate interviews, and send reminders — all within one chat flow.',
  },
  {
    icon: 'lock',
    title: 'Governed & Auditable',
    text: 'Every requisition, shortlist, and approval is logged with full auditability and guardrails.',
  },
];

const TESTIMONIALS = [
  {
    quote:
      '"Engage with your ATS using natural dialogue to create, approve, or update requisitions instantly"',
    name: 'Sarah Johnson',
    role: 'Head of Talent',
  },
  {
    quote:
      '"Leverage data-driven insights to enhance your recruitment strategies and make informed hiring decisions"',
    name: 'Michael Smith',
    role: 'Director of Recruitment',
  },
  {
    quote:
      '"Automate candidate communications to streamline the hiring process and enhance the candidate experience"',
    name: 'Emily Davis',
    role: 'Recruitment Specialist',
  },
  {
    quote:
      '"Foster a collaborative hiring environment by integrating feedback from all stakeholders in real-time"',
    name: 'Olivia Wilson',
    role: 'HR Business Partner',
  },
];

const SOLUTIONS = [
  {
    title: 'Conversational Interface',
    text: 'Engage with your ATS using natural dialogue to create, approve, or update requisitions instantly.',
  },
  {
    title: 'Automated Resume',
    text: 'Utilize AI to scan and shortlist applicants based on predefined criteria, saving time and enhancing quality.',
  },
  {
    title: 'Real-Time Analytics',
    text: 'Monitor recruitment metrics in real-time to make data-driven decisions and improve your hiring strategies.',
  },
  {
    title: 'Candidate Interview Portal',
    text: 'Deliver structured voice AI interviews with mic checks, guided instructions, and transparent evaluation reports.',
  },
];

const TRUST_PILLARS = [
  {
    icon: 'shield',
    title: 'Bias Protection',
    text: 'AI trained to identify and prevent discriminatory patterns',
  },
  {
    icon: 'visibility',
    title: 'Transparency',
    text: 'Every decision is auditable with full reasoning explained',
  },
  {
    icon: 'verified_user',
    title: 'Guardrails',
    text: 'Safety mechanisms ensure compliant and fair hiring',
  },
  {
    icon: 'groups',
    title: 'Human-in-the-Loop',
    text: 'Recruiters always have final say on all decisions',
  },
];

export default function LandingPage({ onEnterHr, onEnterCandidate }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) return;
    setSubmitted(true);
    setForm({ name: '', email: '', company: '', message: '' });
  };

  return (
    <div className="bg-white text-[#1E293B]">
      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <h1 className="text-4xl font-extrabold leading-[1.14] tracking-tight text-[#1E293B] sm:text-5xl lg:text-[52px]">
              Talk with every candidate. Hire with intelligence.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-[#475569] sm:text-lg">
              Empower your hiring teams with a conversational AI platform that integrates
              with your ATS and automates requisitions, shortlists, and approvals —
              securely and transparently.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              <a
                href="#demo-form"
                className="inline-flex items-center justify-center rounded-full bg-[#1D4ED8] px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1E40AF]"
              >
                Get a Demo
              </a>
              <button
                type="button"
                onClick={onEnterHr}
                className="inline-flex items-center gap-2 rounded-full border border-[#1D4ED8] bg-white px-6 py-3 text-sm font-semibold text-[#1D4ED8] transition hover:bg-[#EEF2FF]"
              >
                <GoogleIcon name="auto_awesome" size={18} />
                <span>Chat with AI Assistant</span>
              </button>
              <button
                type="button"
                onClick={onEnterCandidate}
                className="inline-flex items-center gap-2 rounded-full border border-[#CBD5E1] bg-[#F8FAFC] px-6 py-3 text-sm font-semibold text-[#1E293B] transition hover:border-[#8B7AE8] hover:text-[#5B48D6]"
              >
                <GoogleIcon name="mic" size={18} className="text-[#8B7AE8]" />
                <span>Open Candidate Portal</span>
              </button>
            </div>
          </div>

          {/* Right Hero Video matching Page 1 */}
          <div className="lg:col-span-6">
            <div className="mx-auto max-w-lg overflow-hidden rounded-[32px] shadow-[0_14px_40px_rgba(30,41,59,0.10)]">
              <video
                src="/assets/media/veyra-hero.mp4"
                autoPlay
                loop
                muted
                playsInline
                aria-label="VEYRA AI Interview & Talent Intelligence Platform animation"
                className="block h-auto w-full rounded-[32px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 4 Feature Cards */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {VALUE_CARDS.map((card) => (
            <div
              key={card.title}
              className="rounded-2xl border border-[#E2E8F0] bg-[#F8F9FD] p-6"
            >
              <GoogleIcon name={card.icon} size={24} className="text-[#1E293B]" />
              <h2 className="mt-4 text-base font-bold text-[#1E293B]">{card.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-[#475569]">{card.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Built for modern recruiting teams */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#1E293B] sm:text-3xl">
            Built for modern recruiting teams
          </h2>
          <p className="mt-2 text-sm text-[#475569]">
            Unlike retrofitted tools, VEYRA is AI-native — designed for conversations,
            transparency, and speed.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="flex flex-col justify-between rounded-2xl border border-[#E2E8F0] bg-[#F8F9FD] p-6"
            >
              <div>
                <div className="mb-3 flex gap-0.5 text-[#334155]">
                  {[0, 1, 2, 3].map((s) => (
                    <GoogleIcon key={s} name="star" size={16} filled />
                  ))}
                  <GoogleIcon name="star" size={16} />
                </div>
                <p className="text-sm italic leading-relaxed text-[#334155]">{t.quote}</p>
              </div>
              <div className="mt-6 flex items-center gap-3">
                <span className="h-9 w-9 shrink-0 rounded-full bg-gradient-to-br from-[#A78BFA] to-[#6366F1]" />
                <div>
                  <p className="text-xs font-bold text-[#1E293B]">{t.name}</p>
                  <p className="text-[11px] text-[#64748B]">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Solutions for Every Hiring Team */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#1E293B] sm:text-3xl">
            Solutions for Every Hiring Team
          </h2>
          <p className="mt-2 text-sm text-[#475569]">
            From startups to enterprises, VEYRA adapts to your recruiting needs
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SOLUTIONS.map((sol, idx) => (
            <div
              key={sol.title}
              className="flex flex-col justify-between rounded-2xl border border-[#E2E8F0] bg-[#F8F9FD] p-6"
            >
              <div>
                <h3 className="text-base font-bold text-[#1E293B]">{sol.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-[#475569]">
                  {sol.text}
                </p>
              </div>
              <button
                type="button"
                onClick={idx === 3 ? onEnterCandidate : onEnterHr}
                className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-[#1D4ED8] hover:underline"
              >
                <span>Learn more</span>
                <GoogleIcon name="arrow_forward" size={14} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Trust & Guardrails */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#1E293B] sm:text-3xl">
            Governed, Auditable &amp; Human-Centric
          </h2>
          <p className="mt-2 text-sm text-[#475569]">
            Designed for conversations, transparency, and fair hiring governance.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {TRUST_PILLARS.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-[#E2E8F0] bg-[#F8F9FD] p-6 text-center"
            >
              <GoogleIcon name={item.icon} size={24} className="text-[#1E293B]" />
              <h3 className="mt-3 text-base font-bold text-[#1E293B]">{item.title}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-[#475569]">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact / Demo Section */}
      <section id="demo-form" className="bg-[#F4F5FB] py-16">
        <div className="mx-auto max-w-xl px-4 sm:px-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-[#1E293B] sm:text-3xl">
              Transform your hiring with VEYRA!
            </h2>
            <p className="mt-2 text-sm text-[#475569]">
              Join modern hiring teams transforming recruitment with AI automation.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-4 rounded-3xl border border-[#E2E8F0] bg-white p-6 shadow-sm sm:p-8"
          >
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[#1E293B]">
                Username
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Enter your name"
                className="w-full rounded-full border border-[#E2E8F0] px-4 py-2.5 text-sm outline-none focus:border-[#1D4ED8]"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[#1E293B]">
                Email
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="Enter Email"
                className="w-full rounded-full border border-[#E2E8F0] px-4 py-2.5 text-sm outline-none focus:border-[#1D4ED8]"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[#1E293B]">
                Company
              </label>
              <input
                type="text"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                placeholder="Enter your company"
                className="w-full rounded-full border border-[#E2E8F0] px-4 py-2.5 text-sm outline-none focus:border-[#1D4ED8]"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[#1E293B]">
                Send us a message
              </label>
              <textarea
                rows={4}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Write your message"
                className="w-full rounded-2xl border border-[#E2E8F0] px-4 py-3 text-sm outline-none focus:border-[#1D4ED8]"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-full bg-[#1D4ED8] py-3 text-sm font-semibold text-white transition hover:bg-[#1E40AF]"
            >
              Send Message
            </button>

            {submitted && (
              <div className="flex items-center gap-2 rounded-xl bg-[#DCFCE7] px-4 py-2.5 text-xs font-semibold text-[#15803D]">
                <GoogleIcon name="check_circle" size={16} />
                <span>
                  Demo request received! You can also explore the live HR and Candidate
                  portals above.
                </span>
              </div>
            )}
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#E2E8F0] bg-white px-4 py-5 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 text-xs text-[#64748B] sm:flex-row">
          <span className="text-sm font-bold text-[#1E293B]">VEYRA</span>
          <span>Verified by Trusted AI</span>
          <div className="flex gap-5">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
