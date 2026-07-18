import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Volume2, VolumeX, ChevronRight, Flame, Sparkles } from 'lucide-react';
import { ORACLE_PHRASES, REPROGRAMMING_PHRASES, DAY_NAMES, NUMEROLOGY_MEANINGS } from '@/lib/mantra-data';
import NumerologyReadingCTA from '@/components/mantra/NumerologyReadingCTA';

const STORAGE_KEY = 'leju_mantra_phase';
const STORAGE_DATE_KEY = 'leju_mantra_last_date';
const SESSION_KEY = 'leju_mantra_shown_this_session';

export default function MantraSpace({ autoOpen = false }) {
  const [open, setOpen] = useState(false);
  const [phase, setPhase] = useState(1);
  const [toneActive, setToneActive] = useState(false);
  const [oracle, setOracle] = useState(null);
  const [currentMantra, setCurrentMantra] = useState(null);
  const audioCtxRef = useRef(null);
  const oscillatorRef = useRef(null);

  useEffect(() => {
    const today = new Date();
    const todayStr = today.toDateString();
    const dayName = DAY_NAMES[today.getDay()];

    setOracle(ORACLE_PHRASES[dayName] || ORACLE_PHRASES['Lunes']);

    const lastDate = localStorage.getItem(STORAGE_DATE_KEY);
    let storedPhase = parseInt(localStorage.getItem(STORAGE_KEY) || '1', 10);

    if (lastDate !== todayStr) {
      storedPhase = storedPhase >= 5 ? 1 : storedPhase + 1;
      localStorage.setItem(STORAGE_KEY, String(storedPhase));
      localStorage.setItem(STORAGE_DATE_KEY, todayStr);
    }

    setPhase(storedPhase);
    setCurrentMantra(REPROGRAMMING_PHRASES[storedPhase - 1] || REPROGRAMMING_PHRASES[0]);

    if (autoOpen && !sessionStorage.getItem(SESSION_KEY)) {
      sessionStorage.setItem(SESSION_KEY, '1');
      setTimeout(() => setOpen(true), 800);
    }

    const openHandler = () => setOpen(true);
    window.addEventListener('leju-open-mantra', openHandler);
    return () => window.removeEventListener('leju-open-mantra', openHandler);
  }, [autoOpen]);

  const startTone = useCallback(() => {
    if (oscillatorRef.current) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.value = 528;

      lfo.type = 'sine';
      lfo.frequency.value = 4;
      lfoGain.gain.value = 0.15;

      lfo.connect(lfoGain);
      lfoGain.connect(gain.gain);
      gain.gain.value = 0.15;

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      lfo.start();

      oscillatorRef.current = { osc, lfo, gain };
      setToneActive(true);
    } catch (e) {
      console.error('Audio error:', e);
    }
  }, []);

  const stopTone = useCallback(() => {
    if (oscillatorRef.current) {
      const { osc, lfo, gain } = oscillatorRef.current;
      try {
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtxRef.current.currentTime + 0.3);
        setTimeout(() => { osc.stop(); lfo.stop(); }, 350);
      } catch {}
      oscillatorRef.current = null;
    }
    setToneActive(false);
  }, []);

  useEffect(() => {
    return () => stopTone();
  }, [stopTone]);

  const handleClose = () => {
    stopTone();
    setOpen(false);
  };

  if (!open || !oracle || !currentMantra) return null;

  const phaseDots = [1, 2, 3, 4, 5];
  const numMeaning = NUMEROLOGY_MEANINGS[oracle.number];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={handleClose} />

      <div className="relative glass-card rounded-3xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="flex items-start justify-between p-6 pb-2 relative z-20">
          <div>
            <p className="text-[0.65rem] font-heading tracking-[0.3em] text-muted-silver uppercase mb-1">El Espacio del</p>
            <h2 className="text-2xl font-heading font-light text-gold text-glow-gold">Mantra</h2>
          </div>
          <button onClick={handleClose} className="text-muted-silver hover:text-silver transition-colors mt-1">
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto px-6 pb-6 relative z-10">
          {/* Phase indicator */}
          <div className="text-center mb-5">
            <div className="flex items-center justify-center gap-2 mb-2">
              {phaseDots.map((p) => (
                <div
                  key={p}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${
                    p === phase ? 'bg-gold scale-125 glow-gold' : p < phase ? 'bg-gold/40' : 'bg-carbon border border-white/10'
                  }`}
                />
              ))}
            </div>
            <p className="text-xs font-heading tracking-widest text-gold/80">
              FASE {phase} — {currentMantra.name.toUpperCase()}
            </p>
          </div>

          {/* 528 Hz Pulse button */}
          <div className="text-center mb-6">
            <button
              onClick={toneActive ? stopTone : startTone}
              className={`relative w-20 h-20 mx-auto rounded-full flex items-center justify-center transition-all duration-500 ${
                toneActive ? 'bg-gold/10 border border-gold/30 glow-gold' : 'bg-white/5 border border-white/20 hover:border-white/40'
              }`}
            >
              {toneActive && (
                <div className="absolute inset-0 rounded-full border border-gold/20" style={{ animation: 'pulseGlow 2s ease-in-out infinite' }} />
              )}
              {toneActive ? <Volume2 size={24} strokeWidth={1} className="text-gold" /> : <VolumeX size={24} strokeWidth={1} className="text-gold/60" />}
            </button>
            <p className="text-[0.6rem] font-heading tracking-widest text-muted-silver mt-2">
              {toneActive ? '528 Hz · ACTIVO' : 'ACTIVAR 528 Hz'}
            </p>
          </div>

          {/* Reprogramming mantra */}
          <div className="text-center mb-6 px-2">
            <p className="text-[0.65rem] font-heading tracking-widest text-gold/60 mb-2">CÓDIGO: {currentMantra.code}</p>
            <p className="text-sm font-body italic text-silver/80 leading-relaxed">{currentMantra.phrase}</p>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-5" />

          {/* Oracle of the Day — expanded */}
          <div className="mb-5">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles size={14} strokeWidth={1} className="text-gold" />
              <p className="text-[0.65rem] font-heading tracking-widest text-gold/80 uppercase">Oráculo del Día</p>
            </div>

            {/* Chakra + numerological number */}
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="px-3 py-1 rounded-full bg-white/5 text-xs font-heading text-gold tracking-wider">{oracle.chakra}</span>
              <span className="text-muted-silver/40 text-xs">·</span>
              <span className="px-3 py-1 rounded-full bg-white/5 text-xs font-heading text-gold tracking-wider">Nº {oracle.number} · {numMeaning.title}</span>
            </div>

            {/* Affirmation */}
            <div className="rounded-2xl bg-black/30 border border-gold/10 p-4 mb-4 text-center">
              <p className="text-[0.6rem] font-heading tracking-widest text-gold/50 mb-2">AFIRMACIÓN</p>
              <p className="text-sm font-body italic text-gold/90 leading-relaxed">{oracle.affirmation}</p>
            </div>

            {/* Numerological meaning */}
            <div className="text-center mb-4">
              <p className="text-[0.6rem] font-heading tracking-widest text-muted-silver/50 mb-1">SIGNIFICADO NUMEROLÓGICO</p>
              <p className="text-xs text-muted-silver leading-relaxed">{numMeaning.desc}</p>
            </div>

            {/* Element + symbolism */}
            <div className="rounded-2xl bg-black/30 border border-carbon p-4 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Flame size={12} strokeWidth={1.5} className="text-gold/70" />
                <p className="text-[0.65rem] font-heading tracking-widest text-gold/70 uppercase">Elemento: {oracle.element}</p>
              </div>
              <p className="text-xs text-silver/60 leading-relaxed font-body">{oracle.element_symbolism}</p>
            </div>

            {/* Ritual to move energy */}
            <div className="rounded-2xl bg-gradient-to-b from-gold/[0.04] to-transparent border border-gold/15 p-4">
              <p className="text-[0.65rem] font-heading tracking-widest text-gold/70 uppercase mb-2">Ritual para mover la energía</p>
              <p className="text-xs text-silver/70 leading-relaxed font-body italic">{oracle.ritual}</p>
            </div>
          </div>

          {/* Premium: Full Numerology Reading CTA */}
          <NumerologyReadingCTA />

          {/* Seal button */}
          <button
            onClick={handleClose}
            className="w-full mt-2 py-3 rounded-xl bg-white/5 border border-white/20 text-gold font-heading text-xs tracking-wider hover:bg-white/10 transition-colors flex items-center justify-center gap-1"
          >
            SELLO ESTA FRECUENCIA
            <ChevronRight size={14} strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </div>
  );
}