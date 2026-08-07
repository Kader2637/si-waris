"use client";

import { useEffect, useState } from "react";
import { Volume2, VolumeX, Pause, Play } from "lucide-react";

interface AudioExplanationProps {
  title: string;
  text: string;
  badge?: string;
}

export default function AudioExplanation({ title, text, badge = "Penjelasan Suara AI" }: AudioExplanationProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined" && !("speechSynthesis" in window)) {
      setSupported(false);
    }
  }, []);

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

    // Cancel any previous speech
    synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "id-ID"; // Indonesian voice
    utterance.rate = 0.95; // Slightly natural pace
    utterance.pitch = 1.0;

    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    setIsSpeaking(true);
    setIsPaused(false);
    synth.speak(utterance);
  };

  const handleStop = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setIsPaused(false);
  };

  if (!supported) return null;

  return (
    <div className="rounded-2xl border border-emerald-200/80 bg-[#e6f4ee] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
      <div className="flex items-center gap-3">
        <span className={`grid size-10 place-items-center rounded-xl transition-all ${
          isSpeaking && !isPaused
            ? "bg-[#0b6245] text-white shadow-md animate-pulse"
            : "bg-white text-[#0b6245] border border-emerald-200"
        }`}>
          {isSpeaking && !isPaused ? <Volume2 className="size-5" /> : <VolumeX className="size-5" />}
        </span>
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0b6245] font-mono">
              {badge}
            </h4>
            {isSpeaking && !isPaused && (
              <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                <span className="size-1.5 rounded-full bg-emerald-600 animate-ping" /> Memutar Suara...
              </span>
            )}
          </div>
          <p className="text-xs font-medium text-slate-700 mt-0.5">
            {title} — Dengarkan edukasi audio hukum waris
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={handlePlayPause}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0b6245] hover:bg-[#084b34] text-white text-xs font-semibold rounded-xl shadow-xs transition-all cursor-pointer"
        >
          {isSpeaking && !isPaused ? (
            <>
              <Pause className="size-3.5" /> Jeda Suara
            </>
          ) : isSpeaking && isPaused ? (
            <>
              <Play className="size-3.5" /> Lanjutkan Suara
            </>
          ) : (
            <>
              <Volume2 className="size-3.5" /> Putar Penjelasan Suara
            </>
          )}
        </button>

        {isSpeaking && (
          <button
            type="button"
            onClick={handleStop}
            className="px-3 py-2 border border-rose-200 text-rose-600 bg-white hover:bg-rose-50 text-xs font-semibold rounded-xl transition-all cursor-pointer"
          >
            Berhenti
          </button>
        )}
      </div>
    </div>
  );
}
