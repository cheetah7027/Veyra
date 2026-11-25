import React, { useEffect, useRef, useState } from 'react';
import GoogleIcon from '../GoogleIcon';
import { INTERVIEW_QUESTIONS } from '../../data/mockData';

function formatTime(sec) {
  const m = String(Math.floor(sec / 60)).padStart(2, '0');
  const s = String(sec % 60).padStart(2, '0');
  return `${m}:${s}`;
}

export default function CandidatePortal({
  candidateName = 'Sarah',
  upcomingInterviews,
  pastInterviews,
  onCompleteInterview,
  candidateReportData,
}) {
  const [view, setView] = useState('dashboard'); // dashboard | instructions | room | report
  const [dashTab, setDashTab] = useState('upcoming'); // upcoming | past
  const [guidelinesModalInterview, setGuidelinesModalInterview] = useState(null);
  const [activeInterview, setActiveInterview] = useState(null);

  // Device check state
  const [micReady, setMicReady] = useState(false);
  const [checkingMic, setCheckingMic] = useState(false);

  // Interview room state
  const [qIndex, setQIndex] = useState(0);
  const [recordPhase, setRecordPhase] = useState('idle'); // idle | recording | saved
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [savedDuration, setSavedDuration] = useState(12);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSec, setPlaybackSec] = useState(0);
  const [completedQs, setCompletedQs] = useState([]);
  const [recordedAnswers, setRecordedAnswers] = useState({});
  const audioUrlRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioElRef = useRef(null);

  // Report state
  const [reportTab, setReportTab] = useState('behavioral');
  const [expandedQ, setExpandedQ] = useState(1);
  const [copiedQ, setCopiedQ] = useState(null);
  const [htmlModalOpen, setHtmlModalOpen] = useState(false);

  // Recording timer
  useEffect(() => {
    if (recordPhase !== 'recording') return;
    const id = setInterval(() => {
      setRecordSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(id);
  }, [recordPhase]);

  // Playback simulation timer when playing
  useEffect(() => {
    if (!isPlaying) return;
    const id = setInterval(() => {
      setPlaybackSec((s) => {
        if (s + 1 >= savedDuration) {
          setIsPlaying(false);
          return 0;
        }
        return s + 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [isPlaying, savedDuration]);

  // Escape key closes modals
  useEffect(() => {
    const onEsc = (e) => {
      if (e.key === 'Escape') {
        setGuidelinesModalInterview(null);
        setHtmlModalOpen(false);
      }
    };
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, []);

  const clearAudioBlob = () => {
    if (audioElRef.current) {
      audioElRef.current.pause();
      audioElRef.current.removeAttribute('src');
    }
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = null;
    }
  };

  const handleOpenInstructions = (interview) => {
    setActiveInterview(interview);
    setMicReady(false);
    setView('instructions');
  };

  const handleCheckMic = async () => {
    setCheckingMic(true);
    try {
      if (navigator.mediaDevices?.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach((t) => t.stop());
      }
    } catch {
      // Fallback cleanly to ready state for demo environments without mic permission
    } finally {
      setCheckingMic(false);
      setMicReady(true);
    }
  };

  const handleEnterRoom = () => {
    clearAudioBlob();
    setQIndex(0);
    setRecordPhase('idle');
    setRecordSeconds(0);
    setCompletedQs([]);
    setRecordedAnswers({});
    setView('room');
  };

  const handleStartRecording = async () => {
    clearAudioBlob();
    setRecordSeconds(0);
    setPlaybackSec(0);
    setIsPlaying(false);
    setRecordPhase('recording');

    try {
      if (navigator.mediaDevices?.getUserMedia && typeof MediaRecorder !== 'undefined') {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        const chunks = [];
        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) chunks.push(e.data);
        };
        recorder.onstop = () => {
          stream.getTracks().forEach((t) => t.stop());
          if (chunks.length > 0) {
            const blob = new Blob(chunks, { type: 'audio/webm' });
            audioUrlRef.current = URL.createObjectURL(blob);
          }
        };
        mediaRecorderRef.current = recorder;
        recorder.start();
      }
    } catch {
      // Timer-based simulation still runs cleanly
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    const finalDur = Math.max(recordSeconds, 12);
    setSavedDuration(finalDur);
    setRecordPhase('saved');
    setCompletedQs((prev) => (prev.includes(qIndex) ? prev : [...prev, qIndex]));
  };

  const handleTogglePlayback = () => {
    if (isPlaying) {
      setIsPlaying(false);
      audioElRef.current?.pause();
      return;
    }
    setIsPlaying(true);
    if (audioUrlRef.current && audioElRef.current) {
      audioElRef.current.src = audioUrlRef.current;
      audioElRef.current.play().catch(() => {});
    }
  };

  const handleReRecord = () => {
    clearAudioBlob();
    setIsPlaying(false);
    setPlaybackSec(0);
    setRecordSeconds(0);
    setRecordPhase('idle');
  };

  const handleSubmitResponse = () => {
    clearAudioBlob();
    const currentQ = INTERVIEW_QUESTIONS[qIndex];
    const updatedAnswers = {
      ...recordedAnswers,
      [currentQ.id]: currentQ.sampleTranscript,
    };
    setRecordedAnswers(updatedAnswers);
    setIsPlaying(false);
    setPlaybackSec(0);
    setRecordSeconds(0);
    setRecordPhase('idle');

    if (qIndex < INTERVIEW_QUESTIONS.length - 1) {
      setQIndex(qIndex + 1);
    } else {
      onCompleteInterview(activeInterview, updatedAnswers);
      setReportTab('behavioral');
      setView('report');
    }
  };

  const speakQuestion = (text) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
  };

  // =========================================================================
  // VIEW 4: INTERVIEW REPORT (Portfolio Update.pdf Pages 13-15)
  // =========================================================================
  if (view === 'report') {
    const scores = candidateReportData?.categoryScores || {
      overall: 85,
      technical: 82,
      communication: 82,
      behavioral: 82,
    };
    const traits = candidateReportData?.traits || [];

    return (
      <div className="min-h-[calc(100vh-4rem)] bg-[#F6F7FC] p-5 sm:p-8">
        <div className="mx-auto max-w-6xl space-y-6">
          <button
            type="button"
            onClick={() => {
              setDashTab('past');
              setView('dashboard');
            }}
            className="inline-flex items-center gap-2 text-xs font-medium text-[#64748B] hover:text-[#1D4ED8]"
          >
            <GoogleIcon name="arrow_back" size={16} />
            <span>Past Interviews / View your responses</span>
          </button>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-[#475569]">Interview Report</p>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <span className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#A78BFA] to-[#6366F1]" />
                <div>
                  <h1 className="text-lg font-bold text-[#1E293B]">
                    {activeInterview?.role || 'Senior Frontend Developer'}
                  </h1>
                  <p className="text-xs text-[#64748B]">
                    {activeInterview?.company || 'TechCorp Inc.'}
                  </p>
                </div>
                <span className="rounded-full border border-[#F9A8D4] bg-[#FCE7F3] px-3 py-0.5 text-xs font-semibold text-[#BE185D]">
                  {activeInterview?.status || 'Evaluated'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setHtmlModalOpen(true)}
                className="inline-flex items-center gap-2 rounded-full border border-[#1D4ED8] bg-white px-5 py-2 text-xs font-semibold text-[#1D4ED8] hover:bg-[#EEF2FF]"
              >
                <GoogleIcon name="code" size={15} />
                <span>View HTML Report</span>
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 rounded-full bg-[#1D4ED8] px-5 py-2 text-xs font-semibold text-white hover:bg-[#1E40AF]"
              >
                <GoogleIcon name="download" size={15} />
                <span>Download Report</span>
              </button>
            </div>
          </div>

          {/* Score Summary Card */}
          <div className="rounded-2xl border border-[#E5E7F0] bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-[#64748B]">Overall Score</p>
                <p className="mt-0.5 text-2xl font-extrabold text-[#1E293B]">
                  {scores.overall}/100
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-[#64748B]">Completed on</p>
                <p className="mt-0.5 text-sm font-semibold text-[#1E293B]">
                  {activeInterview?.completedDate || 'Oct 15, 2025'}
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { label: 'Technical Skills', val: scores.technical },
                { label: 'Communication', val: scores.communication },
                { label: 'Behavioural Problem Solving', val: scores.behavioral },
              ].map((c) => (
                <div key={c.label} className="rounded-xl bg-[#EEF0FA] p-4">
                  <p className="text-xs font-medium text-[#475569]">{c.label}</p>
                  <p className="mt-2 text-2xl font-bold text-[#1E293B]">{c.val}/100</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-6 border-b border-[#E2E8F0]">
            {[
              { id: 'behavioral', label: 'Behavioural Analysis' },
              { id: 'responses', label: 'Your Responses' },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setReportTab(t.id)}
                className={`border-b-2 pb-3 text-sm font-semibold transition ${
                  reportTab === t.id
                    ? 'border-[#1D4ED8] text-[#1D4ED8]'
                    : 'border-transparent text-[#64748B] hover:text-[#1E293B]'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {reportTab === 'behavioral' ? (
            <div className="rounded-2xl border border-[#E5E7F0] bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-base font-bold text-[#1E293B]">
                Behaviour Traits
              </h2>
              <div className="grid gap-6 sm:grid-cols-2">
                {traits.map((trait) => (
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
                const answerText = recordedAnswers[q.id] || q.sampleTranscript;
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
                                onClick={() => {
                                  navigator.clipboard?.writeText(answerText);
                                  setCopiedQ(q.id);
                                  setTimeout(() => setCopiedQ(null), 1500);
                                }}
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
                                onClick={() => speakQuestion(answerText)}
                                className="inline-flex items-center gap-1 hover:underline"
                              >
                                <GoogleIcon name="volume_up" size={14} />
                                <span>Listen</span>
                              </button>
                            </div>
                          </div>
                          <p className="text-xs leading-relaxed text-[#334155]">
                            {answerText}
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

        {/* View HTML Report Modal */}
        {htmlModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setHtmlModalOpen(false)}
          >
            <div
              className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-4 flex items-center justify-between border-b border-[#E5E7F0] pb-3">
                <h3 className="text-lg font-bold text-[#1E293B]">
                  HTML Interview Summary Report
                </h3>
                <button
                  type="button"
                  onClick={() => setHtmlModalOpen(false)}
                  className="text-[#64748B] hover:text-[#1E293B]"
                >
                  <GoogleIcon name="close" size={20} />
                </button>
              </div>
              <div className="space-y-3 text-sm text-[#334155]">
                <p>
                  <strong>Role:</strong>{' '}
                  {activeInterview?.role || 'Senior Frontend Developer'}
                </p>
                <p>
                  <strong>Overall Score:</strong> {scores.overall}/100
                </p>
                <p>
                  <strong>Breakdown:</strong> Technical ({scores.technical}/100),
                  Communication ({scores.communication}/100), Behavioural ({scores.behavioral}/100)
                </p>
                <p className="text-xs text-[#64748B]">
                  All 10 responses recorded, transcribed, and evaluated.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // VIEW 3: INTERVIEW ROOM (Portfolio Update.pdf Pages 1, 7-10)
  // =========================================================================
  if (view === 'room') {
    const currentQ = INTERVIEW_QUESTIONS[qIndex];
    const remainingSec = Math.max(0, 60 - recordSeconds);

    return (
      <div className="min-h-[calc(100vh-4rem)] bg-[#F6F7FC]">
        <audio
          ref={audioElRef}
          onEnded={() => {
            setIsPlaying(false);
            setPlaybackSec(0);
          }}
          className="hidden"
        />

        {/* Role & Stepped Node Progress Header matching PDF Page 7 */}
        <div className="border-b border-[#E5E7F0] bg-white px-4 py-4 sm:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <span className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#A78BFA] to-[#6366F1]" />
                <div>
                  <h1 className="text-base font-bold text-[#1E293B]">
                    {activeInterview?.role || 'Senior Frontend Developer'}
                  </h1>
                  <p className="text-xs text-[#64748B]">
                    {activeInterview?.company || 'TechCorp Inc.'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="inline-flex items-center gap-2 rounded-full bg-[#F4F5FB] px-3.5 py-1.5 text-xs font-semibold text-[#1E293B]">
                  <GoogleIcon name="schedule" size={16} className="text-[#1D4ED8]" />
                  <span>{formatTime(recordSeconds)}</span>
                </div>
                <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#334155]">
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      recordPhase === 'recording'
                        ? 'animate-pulse bg-[#E11D48]'
                        : 'bg-[#334155]'
                    }`}
                  />
                  <span>
                    {recordPhase === 'recording' ? 'Recording' : 'Not Recording'}
                  </span>
                </div>
              </div>
            </div>

            {/* Stepped Node Progress Bar matching PDF Page 7 */}
            <div className="relative mt-5 flex items-center justify-between px-1">
              <div className="absolute right-1 left-1 top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-[#E2E8F0]" />
              <div
                className="absolute left-1 top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-[#1D4ED8] transition-all duration-300"
                style={{
                  width: `${Math.round((qIndex / (INTERVIEW_QUESTIONS.length - 1)) * 100)}%`,
                }}
              />
              {INTERVIEW_QUESTIONS.map((q, idx) => {
                const passed = idx < qIndex;
                const current = idx === qIndex;
                return (
                  <span
                    key={q.id}
                    className={`relative z-10 rounded-full transition-all ${
                      current
                        ? 'h-3.5 w-3.5 bg-[#1D4ED8] ring-4 ring-[#DBEAFE]'
                        : passed
                          ? 'h-2 w-2 bg-[#1D4ED8]'
                          : 'h-1.5 w-1.5 bg-[#94A3B8]'
                    }`}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Room Workspace */}
        <div className="mx-auto grid max-w-6xl gap-6 p-4 sm:p-8 lg:grid-cols-12">
          <div className="space-y-5 lg:col-span-9">
            {/* Question Prompt Card */}
            <div className="rounded-2xl border border-[#E5E7F0] bg-white p-6 shadow-sm">
              <div className="mb-3 flex items-center justify-between gap-3">
                <span className="text-xs font-semibold text-[#334155]">
                  Question {qIndex + 1}/{INTERVIEW_QUESTIONS.length}
                </span>
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex items-center gap-1 rounded-full border border-[#CBD5E1] px-2.5 py-0.5 text-xs font-medium text-[#334155]">
                    <GoogleIcon name="timer" size={14} />
                    {recordPhase === 'recording' ? formatTime(remainingSec) : '1 min'}
                  </span>
                  <button
                    type="button"
                    onClick={() => speakQuestion(currentQ.question)}
                    className="rounded-full p-1 text-[#1D4ED8] hover:bg-[#EEF2FF]"
                    title="Read question aloud"
                  >
                    <GoogleIcon name="volume_up" size={18} />
                  </button>
                </div>
              </div>
              <p className="text-base font-medium text-[#1E293B] sm:text-lg">
                {currentQ.question}
              </p>
            </div>

            {/* Center Recording / Playback Stage */}
            <div className="flex min-h-[340px] flex-col items-center justify-center rounded-2xl border border-[#E5E7F0] bg-white p-8 text-center shadow-sm">
              <div
                className={`relative flex h-28 w-28 items-center justify-center rounded-full bg-[#F3E8FF] ${
                  recordPhase === 'recording' ? 'animate-pulse' : ''
                }`}
              >
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#DDD6FE]">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#A855F7] text-white shadow-md">
                    <GoogleIcon name="mic" size={28} />
                  </div>
                </div>
              </div>

              {recordPhase === 'idle' && (
                <>
                  <p className="mt-6 text-sm text-[#475569]">Click to start recording</p>
                  <button
                    type="button"
                    onClick={handleStartRecording}
                    className="mt-4 inline-flex items-center gap-2.5 rounded-full border border-[#1D4ED8] bg-white px-6 py-2.5 text-sm font-semibold text-[#1D4ED8] transition hover:bg-[#EEF2FF]"
                  >
                    <span className="h-3 w-3 rounded-full bg-[#1D4ED8]" />
                    <span>Start Recording</span>
                  </button>
                </>
              )}

              {recordPhase === 'recording' && (
                <>
                  <p className="mt-6 text-sm font-medium text-[#1E293B]">
                    Recording.... ({formatTime(recordSeconds)})
                  </p>
                  <button
                    type="button"
                    onClick={handleStopRecording}
                    className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#E11D48] px-7 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#BE123C]"
                  >
                    <GoogleIcon name="close" size={18} />
                    <span>Stop</span>
                  </button>
                </>
              )}

              {recordPhase === 'saved' && (
                <>
                  <p className="mt-6 text-sm font-medium text-[#1E293B]">
                    Response saved. Review your response?
                  </p>

                  {/* Audio Scrubber Bar matching PDF Pages 9-10 */}
                  <div className="mt-4 flex w-full max-w-sm items-center gap-3 rounded-full bg-[#F4F5FB] px-4 py-2">
                    <button
                      type="button"
                      onClick={handleTogglePlayback}
                      className="text-[#1E293B] hover:text-[#1D4ED8]"
                      aria-label={isPlaying ? 'Pause' : 'Play'}
                    >
                      <GoogleIcon name={isPlaying ? 'pause' : 'play_arrow'} size={20} />
                    </button>
                    <span className="font-mono text-xs text-[#475569]">
                      {formatTime(playbackSec)}
                    </span>
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#E2E8F0]">
                      <div
                        className="h-full rounded-full bg-[#1D4ED8] transition-all"
                        style={{
                          width: `${Math.round((playbackSec / savedDuration) * 100)}%`,
                        }}
                      />
                    </div>
                    <span className="font-mono text-xs text-[#475569]">
                      {formatTime(savedDuration)}
                    </span>
                  </div>

                  <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={handleReRecord}
                      className="rounded-full border border-[#1D4ED8] bg-white px-6 py-2.5 text-xs font-semibold text-[#1D4ED8] hover:bg-[#EEF2FF]"
                    >
                      Re-record
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmitResponse}
                      className="rounded-full bg-[#1D4ED8] px-6 py-2.5 text-xs font-semibold text-white hover:bg-[#1E40AF]"
                    >
                      {qIndex === INTERVIEW_QUESTIONS.length - 1
                        ? 'Submit Interview'
                        : 'Submit Response'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right Interview Progress Sidebar */}
          <div className="rounded-2xl border border-[#E5E7F0] bg-white p-5 shadow-sm lg:col-span-3">
            <h2 className="mb-4 text-base font-bold text-[#1E293B]">
              Interview Progress
            </h2>
            <ul className="space-y-3">
              {INTERVIEW_QUESTIONS.map((q, idx) => {
                const isDone = completedQs.includes(idx) && idx !== qIndex;
                const isCurrentDone = idx === qIndex && recordPhase === 'saved';
                const isActive = idx === qIndex && recordPhase !== 'saved';

                return (
                  <li key={q.id} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      {isDone || isCurrentDone ? (
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#DCFCE7] text-[#15803D]">
                          <GoogleIcon name="check" size={14} />
                        </span>
                      ) : (
                        <span
                          className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold ${
                            isActive
                              ? 'bg-[#EEF0FA] text-[#1D4ED8]'
                              : 'bg-[#F1F5F9] text-[#94A3B8]'
                          }`}
                        >
                          {q.id}
                        </span>
                      )}
                      <span
                        className={
                          isActive || isDone || isCurrentDone
                            ? 'font-semibold text-[#1E293B]'
                            : 'text-[#94A3B8]'
                        }
                      >
                        Question {q.id}
                      </span>
                    </div>

                    {isActive && (
                      <span className="rounded-full bg-[#EEF0FA] px-2.5 py-0.5 text-[11px] font-semibold text-[#1D4ED8]">
                        Active
                      </span>
                    )}
                    {(isDone || isCurrentDone) && (
                      <span className="rounded-full bg-[#DCFCE7] px-2.5 py-0.5 text-[11px] font-semibold text-[#15803D]">
                        Done
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: PRE-INTERVIEW INSTRUCTIONS & MIC CHECK (Pages 5-6)
  // =========================================================================
  if (view === 'instructions') {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-[#F6F7FC] p-5 sm:p-8">
        <div className="mx-auto max-w-5xl">
          <button
            type="button"
            onClick={() => setView('dashboard')}
            className="inline-flex items-center gap-2 text-xs font-medium text-[#334155] hover:text-[#1D4ED8]"
          >
            <GoogleIcon name="arrow_back" size={16} />
            <span>Back</span>
          </button>

          <h1 className="mt-3 text-lg font-bold text-[#1E293B]">
            Pre-Interview Instructions
          </h1>
          <p className="mt-0.5 text-sm text-[#64748B]">
            Please review the following before starting your interview
          </p>

          <div className="mt-6 rounded-2xl border border-[#E5E7F0] bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-xl font-bold text-[#1E293B]">Interview Guidelines</h2>

            <div className="mt-5 space-y-4">
              {[
                [
                  'Find a quiet environment',
                  'Choose a location with minimal background noise and distractions',
                ],
                [
                  'Ensure good lighting',
                  'Position yourself facing a light source for clear video recording',
                ],
                [
                  'Check your internet connection',
                  'Stable connection is required for smooth recording and submission',
                ],
                [
                  'Take your time',
                  "Each question has a time limit. It's advisable that you take care of the time",
                ],
              ].map(([title, desc], idx) => (
                <div key={title} className="flex items-start gap-3.5">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#CBD5E1] text-xs font-bold text-[#1D4ED8]">
                    {idx + 1}
                  </span>
                  <div>
                    <p className="text-sm font-bold text-[#1E293B]">{title}</p>
                    <p className="text-xs text-[#64748B]">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-xl border border-[#E11D48] bg-[#FFF1F2] p-4">
              <div className="flex items-center gap-2 text-xs font-bold text-[#BE123C]">
                <GoogleIcon name="warning" size={16} />
                <span>Important</span>
              </div>
              <p className="mt-1 text-xs text-[#881337]">
                You can re-record your answer for each question before moving to the next
                one. Once you proceed to the next question, you cannot go back.
              </p>
            </div>
          </div>

          {/* Microphone Device Check Bar */}
          <button
            type="button"
            onClick={handleCheckMic}
            className="mt-5 flex w-full items-center justify-between rounded-2xl border border-[#E5E7F0] bg-white px-5 py-4 text-left shadow-sm transition hover:border-[#1D4ED8]"
          >
            <div className="flex items-center gap-3.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EEF0FA] text-[#1D4ED8]">
                <GoogleIcon name="mic" size={20} />
              </span>
              <div>
                <p className="text-sm font-bold text-[#1E293B]">Microphone</p>
                <p className="text-xs text-[#64748B]">
                  {checkingMic
                    ? 'Checking audio input device...'
                    : micReady
                      ? 'Audio input device verified'
                      : 'Audio input device — click to test microphone'}
                </p>
              </div>
            </div>

            {micReady ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#15803D]">
                <GoogleIcon name="check_circle" size={18} />
                <span>Media devices ready</span>
              </span>
            ) : (
              <span className="h-5 w-5 rounded-full border-2 border-[#CBD5E1]" />
            )}
          </button>

          <div className="mt-6 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setView('dashboard')}
              className="rounded-full border border-[#334155] bg-white px-6 py-2.5 text-xs font-semibold text-[#1E293B]"
            >
              Back
            </button>
            <button
              type="button"
              disabled={!micReady}
              onClick={handleEnterRoom}
              className={`rounded-full px-6 py-2.5 text-xs font-semibold transition ${
                micReady
                  ? 'bg-[#1D4ED8] text-white hover:bg-[#1E40AF]'
                  : 'cursor-not-allowed bg-[#E2E8F0] text-[#94A3B8]'
              }`}
            >
              Start Interview
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 1: CANDIDATE DASHBOARD (Pages 2, 3, 4, 11, 12)
  // =========================================================================
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#F6F7FC]">
      {/* Greeting Banner */}
      <div className="border-b border-[#E5E7F0] bg-white px-4 py-7 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-2xl font-bold text-[#1E293B] sm:text-3xl">
            Good Morning, {candidateName}
          </h1>
          <p className="mt-1 text-sm text-[#64748B]">Ready to explore new opportunities?</p>

          <div className="mt-7 flex gap-6">
            {[
              { id: 'upcoming', label: 'Upcoming Interviews' },
              { id: 'past', label: 'Past Interviews' },
            ].map((t) => {
              const active = dashTab === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setDashTab(t.id)}
                  className={`border-b-2 pb-2.5 text-sm font-semibold transition ${
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
        </div>
      </div>

      {/* Tab Body */}
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-8">
        {dashTab === 'upcoming' ? (
          upcomingInterviews.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <GoogleIcon name="event_busy" size={44} className="text-[#CBD5E1]" />
              <p className="mt-3 text-base font-semibold text-[#94A3B8]">
                No interviews scheduled
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {upcomingInterviews.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-[#E5E7F0] bg-white p-5 shadow-sm sm:p-6"
                >
                  <div className="flex items-center gap-3.5">
                    <span className="h-10 w-10 shrink-0 rounded-xl bg-gradient-to-br from-[#A78BFA] to-[#6366F1]" />
                    <div>
                      <h2 className="text-base font-bold text-[#1E293B]">{item.role}</h2>
                      <p className="text-xs text-[#64748B]">{item.company}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="grid flex-1 grid-cols-2 gap-4 rounded-xl bg-[#F4F5FB] px-4 py-3 sm:grid-cols-4">
                      <div className="flex items-center gap-2.5">
                        <GoogleIcon
                          name="calendar_today"
                          size={17}
                          className="text-[#1D4ED8]"
                        />
                        <div>
                          <p className="text-[11px] text-[#64748B]">Scheduled Date</p>
                          <p className="text-xs font-semibold text-[#1E293B]">
                            {item.scheduledDate}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <GoogleIcon name="schedule" size={17} className="text-[#1D4ED8]" />
                        <div>
                          <p className="text-[11px] text-[#64748B]">Time</p>
                          <p className="text-xs font-semibold text-[#1E293B]">
                            {item.time}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <GoogleIcon
                          name="hourglass_empty"
                          size={17}
                          className="text-[#1D4ED8]"
                        />
                        <div>
                          <p className="text-[11px] text-[#64748B]">Duration</p>
                          <p className="text-xs font-semibold text-[#1E293B]">
                            {item.duration}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <GoogleIcon
                          name="help_outline"
                          size={17}
                          className="text-[#1D4ED8]"
                        />
                        <div>
                          <p className="text-[11px] text-[#64748B]">Questions</p>
                          <p className="text-xs font-semibold text-[#1E293B]">
                            {item.questionsCount} Questions
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setGuidelinesModalInterview(item)}
                        className="rounded-full border border-[#1D4ED8] bg-white px-5 py-2.5 text-xs font-semibold text-[#1D4ED8] hover:bg-[#EEF2FF]"
                      >
                        View Instructions
                      </button>

                      <div className="group relative">
                        <button
                          type="button"
                          disabled={!item.canJoin}
                          onClick={() => handleOpenInstructions(item)}
                          className={`rounded-full px-6 py-2.5 text-xs font-semibold transition ${
                            item.canJoin
                              ? 'bg-[#1D4ED8] text-white hover:bg-[#1E40AF]'
                              : 'cursor-not-allowed bg-[#E2E8F0] text-[#94A3B8]'
                          }`}
                        >
                          Start Interview
                        </button>
                        {!item.canJoin && (
                          <div className="pointer-events-none absolute right-0 bottom-full z-20 mb-2 hidden w-56 rounded-xl bg-[#334155] p-2.5 text-[11px] text-white shadow-lg group-hover:block group-focus-within:block">
                            You can join only 30 minutes before the scheduled time
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="space-y-5">
            {pastInterviews.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-[#E5E7F0] bg-white p-5 shadow-sm sm:p-6"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    <span className="h-10 w-10 shrink-0 rounded-xl bg-gradient-to-br from-[#A78BFA] to-[#6366F1]" />
                    <div>
                      <h2 className="text-base font-bold text-[#1E293B]">{item.role}</h2>
                      <p className="text-xs text-[#64748B]">{item.company}</p>
                    </div>
                  </div>

                  <span
                    className={`rounded-full border px-3 py-0.5 text-xs font-semibold ${
                      item.status === 'Pending'
                        ? 'border-[#FDE047] bg-[#FEF9C3] text-[#A16207]'
                        : item.status === 'Completed'
                          ? 'border-[#86EFAC] bg-[#DCFCE7] text-[#15803D]'
                          : 'border-[#F9A8D4] bg-[#FCE7F3] text-[#BE185D]'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="grid flex-1 grid-cols-1 gap-4 rounded-xl bg-[#F4F5FB] px-4 py-3 sm:grid-cols-3">
                    <div className="flex items-center gap-2.5">
                      <GoogleIcon name="grade" size={17} className="text-[#1D4ED8]" />
                      <div>
                        <p className="text-[11px] text-[#64748B]">Marks Obtained</p>
                        <p className="text-xs font-semibold text-[#1E293B]">
                          <span className="rounded border border-[#F9A8D4] bg-[#FCE7F3] px-1.5 py-0.5 text-[#BE185D]">
                            {item.marks}
                          </span>{' '}
                          /100
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <GoogleIcon
                        name="calendar_today"
                        size={17}
                        className="text-[#1D4ED8]"
                      />
                      <div>
                        <p className="text-[11px] text-[#64748B]">Completed Date</p>
                        <p className="text-xs font-semibold text-[#1E293B]">
                          {item.completedDate}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <GoogleIcon
                        name="hourglass_empty"
                        size={17}
                        className="text-[#1D4ED8]"
                      />
                      <div>
                        <p className="text-[11px] text-[#64748B]">Time taken</p>
                        <p className="text-xs font-semibold text-[#1E293B]">
                          {item.timeTaken}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveInterview(item);
                        setReportTab('behavioral');
                        setView('report');
                      }}
                      className="rounded-full border border-[#1D4ED8] bg-white px-5 py-2.5 text-xs font-semibold text-[#1D4ED8] hover:bg-[#EEF2FF]"
                    >
                      Download Report
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveInterview(item);
                        setReportTab('responses');
                        setView('report');
                      }}
                      className="rounded-full bg-[#1D4ED8] px-5 py-2.5 text-xs font-semibold text-white hover:bg-[#1E40AF]"
                    >
                      Review your responses
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Interview Guidelines Modal matching PDF Page 4 */}
      {guidelinesModalInterview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4"
          onClick={() => setGuidelinesModalInterview(null)}
        >
          <div
            className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#1E293B]">Interview Guidelines</h2>
              <button
                type="button"
                onClick={() => setGuidelinesModalInterview(null)}
                className="text-[#64748B] hover:text-[#1E293B]"
              >
                <GoogleIcon name="close" size={20} />
              </button>
            </div>

            <div className="space-y-4">
              {[
                [
                  'Find a quiet environment',
                  'Choose a location with minimal background noise and distractions',
                ],
                [
                  'Ensure good lighting',
                  'Position yourself facing a light source for clear video recording',
                ],
                [
                  'Check your internet connection',
                  'Stable connection is required for smooth recording and submission',
                ],
                [
                  'Take your time',
                  "Each question has a time limit. It's advisable that you take care of the time",
                ],
              ].map(([title, desc], idx) => (
                <div key={title} className="flex items-start gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#CBD5E1] text-xs font-bold text-[#1D4ED8]">
                    {idx + 1}
                  </span>
                  <div>
                    <p className="text-sm font-bold text-[#1E293B]">{title}</p>
                    <p className="text-xs text-[#64748B]">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-xl border border-[#E11D48] bg-[#FFF1F2] p-4">
              <div className="flex items-center gap-2 text-xs font-bold text-[#BE123C]">
                <GoogleIcon name="warning" size={16} />
                <span>Important</span>
              </div>
              <p className="mt-1 text-xs text-[#881337]">
                You can re-record your answer for each question before moving to the next
                one. Once you proceed to the next question, you cannot go back.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
