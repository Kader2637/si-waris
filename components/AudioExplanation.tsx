"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Headphones, Volume2, Pause, Play, Square, Gauge } from "lucide-react";

interface AudioExplanationProps {
  title: string;
  text: string;
  badge?: string;
}

const SPEED_OPTIONS = [
  { label: "0.9x", value: 0.92 },
  { label: "1.0x", value: 1.0 },
  { label: "1.15x", value: 1.15 },
];

const emptySubscribe = () => () => {};

function scoreIndonesianVoice(voice: SpeechSynthesisVoice): number {
  const lang = voice.lang.toLowerCase();
  const name = voice.name.toLowerCase();

  let score = 0;
  if (lang === "id-id" || lang === "id_id") score += 100;
  else if (lang.startsWith("id")) score += 80;
  else if (lang.startsWith("ms")) score += 20;
  else return -1;

  // Prioritaskan voice neural / natural / enhanced dibanding voice sistem lama
  if (name.includes("natural")) score += 60;
  if (name.includes("neural")) score += 55;
  if (name.includes("online")) score += 45;
  if (name.includes("google")) score += 40;
  if (name.includes("enhanced") || name.includes("premium")) score += 35;
  if (name.includes("gadis") || name.includes("ardi")) score += 25;
  if (name.includes("damayanti")) score += 15;

  if (name.includes("compact") || name.includes("espeak")) score -= 40;
  if (!voice.localService) score += 10;

  return score;
}

function getIndonesianVoices(): SpeechSynthesisVoice[] {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return [];
  const voices = window.speechSynthesis.getVoices();
  return voices
    .map((voice) => ({ voice, score: scoreIndonesianVoice(voice) }))
    .filter((entry) => entry.score >= 0)
    .sort((a, b) => b.score - a.score)
    .map((entry) => entry.voice);
}

function normalizeTextForSpeech(raw: string): string[] {
  const cleaned = raw
    .replace(/Rp\.?\s*([\d.,]+)/gi, "$1 rupiah")
    .replace(/E-MAWARIST/gi, "E-Mawarist")
    .replace(/\bKUHPerdata\b/g, "Kitab Undang-Undang Hukum Perdata")
    .replace(/\bKHI\b/g, "Kompilasi Hukum Islam")
    .replace(/\bBW\b/g, "Burgerlijk Wetboek")
    .replace(/\bZNT\b/g, "Zona Nilai Tanah")
    .replace(/\b2\s*:\s*1\b/g, "dua banding satu")
    .replace(/\b1\s*:\s*1\b/g, "satu banding satu")
    .replace(/\b1\/2\b/g, "setengah")
    .replace(/\b1\/3\b/g, "sepertiga")
    .replace(/\b1\/4\b/g, "seperempat")
    .replace(/\b1\/6\b/g, "seperenam")
    .replace(/\b1\/8\b/g, "seperdelapan")
    .replace(/\b2\/3\b/g, "dua pertiga")
    .replace(/%/g, " persen")
    .replace(/[—–]/g, ", ")
    .replace(/\s*\(([^)]+)\)/g, ", $1,")
    .replace(/\s+/g, " ")
    .trim();

  // Pecah menjadi kalimat agar ada jeda napas alami antar kalimat & tidak terpotong browser
  const parts = cleaned
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

  return parts.length > 0 ? parts : [cleaned];
}

export default function AudioExplanation({
  title,
  text,
  badge = "Panduan Audio",
}: AudioExplanationProps) {
  const supported = useSyncExternalStore(
    emptySubscribe,
    () => typeof window !== "undefined" && "speechSynthesis" in window,
    () => true
  );

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string>("");
  const [rate, setRate] = useState<number>(1.0);

  const sessionIdRef = useRef(0);
  const pauseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!supported) return;

    const loadVoices = () => {
      const idVoices = getIndonesianVoices();
      setVoices(idVoices);
      if (idVoices.length > 0) {
        setSelectedVoiceURI((prev) =>
          prev && idVoices.some((v) => v.voiceURI === prev) ? prev : idVoices[0].voiceURI
        );
      }
    };

    loadVoices();
    const synth = window.speechSynthesis;
    synth.addEventListener("voiceschanged", loadVoices);

    return () => {
      sessionIdRef.current += 1;
      if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
      synth.removeEventListener("voiceschanged", loadVoices);
      synth.cancel();
    };
  }, [supported]);

  const stopPlayback = () => {
    sessionIdRef.current += 1;
    if (pauseTimerRef.current) {
      clearTimeout(pauseTimerRef.current);
      pauseTimerRef.current = null;
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setIsPaused(false);
  };

  const speakChunks = (chunks: string[], index: number, currentSession: number, chosenRate: number) => {
    if (typeof window === "undefined" || sessionIdRef.current !== currentSession) return;
    if (index >= chunks.length) {
      setIsSpeaking(false);
      setIsPaused(false);
      return;
    }

    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(chunks[index]);
    const activeVoice =
      voices.find((v) => v.voiceURI === selectedVoiceURI) || getIndonesianVoices()[0];

    if (activeVoice) {
      utterance.voice = activeVoice;
      utterance.lang = activeVoice.lang;
    } else {
      utterance.lang = "id-ID";
    }

    utterance.rate = chosenRate;
    utterance.pitch = 1.02;

    utterance.onend = () => {
      if (sessionIdRef.current !== currentSession) return;
      pauseTimerRef.current = setTimeout(() => {
        speakChunks(chunks, index + 1, currentSession, chosenRate);
      }, 170);
    };

    utterance.onerror = (e) => {
      if (e.error === "interrupted" || e.error === "canceled") return;
      if (sessionIdRef.current !== currentSession) return;
      setIsSpeaking(false);
      setIsPaused(false);
    };

    synth.speak(utterance);
  };

  const handlePlayPause = () => {
    if (!supported || typeof window === "undefined") return;
    const synth = window.speechSynthesis;

    if (isSpeaking && !isPaused) {
      synth.pause();
      setIsPaused(true);
      return;
    }

    if (isSpeaking && isPaused) {
      synth.resume();
      setIsPaused(false);
      return;
    }

    stopPlayback();
    const nextSession = sessionIdRef.current;
    const chunks = normalizeTextForSpeech(text);
    setIsSpeaking(true);
    setIsPaused(false);
    speakChunks(chunks, 0, nextSession, rate);
  };

  const handleCycleSpeed = () => {
    const idx = SPEED_OPTIONS.findIndex((s) => s.value === rate);
    const next = SPEED_OPTIONS[(idx + 1) % SPEED_OPTIONS.length];
    setRate(next.value);
    if (isSpeaking) {
      stopPlayback();
    }
  };

  if (!supported) return null;

  const activeSpeedLabel = SPEED_OPTIONS.find((s) => s.value === rate)?.label || "1.0x";

  return (
    <div className="rounded-2xl border border-emerald-200/80 dark:border-emerald-800/60 bg-[#e6f4ee] dark:bg-emerald-950/35 p-4 flex flex-col md:flex-row md:items-center justify-between gap-3.5 shadow-2xs">
      <div className="flex items-start sm:items-center gap-3">
        <span
          className={`grid size-10 shrink-0 place-items-center rounded-xl transition-all ${
            isSpeaking && !isPaused
              ? "bg-[#0b6245] text-white shadow-md animate-pulse"
              : "bg-white dark:bg-[#131b2b] text-[#0b6245] dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/70"
          }`}
        >
          {isSpeaking && !isPaused ? <Volume2 className="size-5" /> : <Headphones className="size-5" />}
        </span>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0b6245] dark:text-emerald-400 font-mono">
              {badge}
            </h4>
            {isSpeaking && !isPaused && (
              <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded-full">
                <span className="size-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400 animate-ping" /> Sedang Membacakan...
              </span>
            )}
          </div>
          <p className="text-xs font-medium text-slate-700 dark:text-slate-300 mt-0.5">
            {title} — Dengarkan ringkasan materi secara lisan
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 shrink-0">
        {voices.length > 1 && (
          <select
            aria-label="Pilih suara narator"
            value={selectedVoiceURI}
            onChange={(e) => {
              setSelectedVoiceURI(e.target.value);
              if (isSpeaking) stopPlayback();
            }}
            className="h-9 max-w-[170px] rounded-xl border border-emerald-200 dark:border-emerald-800/70 bg-white dark:bg-[#131b2b] px-2.5 text-[11px] font-medium text-slate-700 dark:text-slate-200 outline-none cursor-pointer"
          >
            {voices.map((v) => (
              <option key={v.voiceURI} value={v.voiceURI}>
                {v.name.replace(/Microsoft |Google /g, "").replace(/\s*\([^)]*\)/g, "")}
              </option>
            ))}
          </select>
        )}

        <button
          type="button"
          onClick={handleCycleSpeed}
          title="Ubah kecepatan bicara"
          className="inline-flex items-center gap-1 h-9 px-2.5 rounded-xl border border-emerald-200 dark:border-emerald-800/70 bg-white dark:bg-[#131b2b] text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-slate-800 text-[11px] font-mono font-semibold transition-colors cursor-pointer"
        >
          <Gauge className="size-3.5 text-[#0b6245] dark:text-emerald-400" />
          {activeSpeedLabel}
        </button>

        <button
          type="button"
          onClick={handlePlayPause}
          className="inline-flex items-center gap-1.5 h-9 px-4 bg-[#0b6245] hover:bg-[#084b34] text-white text-xs font-semibold rounded-xl shadow-xs transition-all cursor-pointer"
        >
          {isSpeaking && !isPaused ? (
            <>
              <Pause className="size-3.5" /> Jeda
            </>
          ) : isSpeaking && isPaused ? (
            <>
              <Play className="size-3.5" /> Lanjutkan
            </>
          ) : (
            <>
              <Headphones className="size-3.5" /> Dengarkan Penjelasan
            </>
          )}
        </button>

        {isSpeaking && (
          <button
            type="button"
            onClick={stopPlayback}
            className="inline-flex items-center gap-1 h-9 px-3 border border-rose-200 dark:border-rose-800/70 text-rose-600 dark:text-rose-400 bg-white dark:bg-[#131b2b] hover:bg-rose-50 dark:hover:bg-rose-950/50 text-xs font-semibold rounded-xl transition-all cursor-pointer"
          >
            <Square className="size-3" /> Berhenti
          </button>
        )}
      </div>
    </div>
  );
}
