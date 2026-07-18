import React, { useState, useEffect, useRef } from 'react';
import { Lock, Play, Pause, Check } from 'lucide-react';

const STORAGE_KEY = 'leju_adolescentes_completed';

export default function AdolescentesPlayer({ episodes, lang }) {
  const [completed, setCompleted] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch {
      return [];
    }
  });
  const [currentEp, setCurrentEp] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  const sorted = [...episodes].sort((a, b) => (a.order || 0) - (b.order || 0));

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(completed));
  }, [completed]);

  useEffect(() => {
    if (currentEp && audioRef.current) {
      audioRef.current.load();
      audioRef.current.play().catch(() => {});
    }
  }, [currentEp]);

  const isUnlocked = (index) => {
    if (index === 0) return true;
    return completed.includes(sorted[index - 1]?.id);
  };

  const isCompleted = (epId) => completed.includes(epId);

  const handlePlay = (ep) => {
    if (currentEp?.id === ep.id) {
      if (playing) {
        audioRef.current?.pause();
      } else {
        audioRef.current?.play();
      }
    } else {
      setCurrentEp(ep);
      setProgress(0);
      setDuration(0);
    }
  };

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (audio) {
      setProgress(audio.currentTime);
      setDuration(audio.duration || 0);
    }
  };

  // Prevent seeking forward
  const handleSeeking = () => {
    const audio = audioRef.current;
    if (audio && audio.currentTime > progress + 0.5) {
      audio.currentTime = progress;
    }
  };

  const handleEnded = () => {
    if (currentEp) {
      setCompleted((prev) => (prev.includes(currentEp.id) ? prev : [...prev, currentEp.id]));
    }
    setPlaying(false);
    setProgress(0);
  };

  const formatTime = (s) => {
    if (!s || isNaN(s)) return '0:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-3">
      <audio
        ref={audioRef}
        src={currentEp?.embed_url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onSeeking={handleSeeking}
        controlsList="nodownload noplaybackrate"
      />

      {sorted.map((ep, index) => {
        const unlocked = isUnlocked(index);
        const done = isCompleted(ep.id);
        const isCurrent = currentEp?.id === ep.id;
        const hasAudio = !!ep.embed_url;

        return (
          <div
            key={ep.id || index}
            className={`glass-card rounded-xl p-4 transition-all duration-300 ${
              isCurrent ? 'border border-white/20 glow-soft' : ''
            } ${!unlocked ? 'opacity-40' : 'glass-card-hover'}`}
          >
            <div className="flex items-center gap-4">
              <button
                onClick={() => unlocked && hasAudio && handlePlay(ep)}
                disabled={!unlocked || !hasAudio}
                className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                  unlocked && hasAudio
                    ? 'bg-white/5 border border-white/20 text-gold hover:bg-white/10'
                    : 'bg-black/30 border border-carbon text-muted-silver cursor-not-allowed'
                }`}
              >
                {done ? (
                  <Check size={16} strokeWidth={1.5} />
                ) : !unlocked ? (
                  <Lock size={14} strokeWidth={1.5} />
                ) : isCurrent && playing ? (
                  <Pause size={16} strokeWidth={1.5} />
                ) : (
                  <Play size={16} strokeWidth={1.5} />
                )}
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  {ep.episode_number && (
                    <span className="text-[0.65rem] text-muted-silver font-heading tracking-widest uppercase">
                      {lang === 'es' ? 'Ep.' : 'Ep.'} {ep.episode_number}
                    </span>
                  )}
                  {done && (
                    <span className="text-[0.65rem] text-green-400">
                      {lang === 'es' ? '✓ Completado' : '✓ Completed'}
                    </span>
                  )}
                  {!unlocked && (
                    <span className="text-[0.65rem] text-muted-silver/60">
                      {lang === 'es' ? 'Bloqueado' : 'Locked'}
                    </span>
                  )}
                  {unlocked && !hasAudio && (
                    <span className="text-[0.65rem] text-muted-silver/60">
                      {lang === 'es' ? 'Audio próximamente' : 'Audio coming soon'}
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-heading font-medium text-silver truncate">{ep.title}</h3>
                {ep.description && <p className="text-xs text-muted-silver line-clamp-1">{ep.description}</p>}
              </div>

              {ep.duration && (
                <p className="text-[0.65rem] text-muted-silver/60 shrink-0">{ep.duration}</p>
              )}
            </div>

            {isCurrent && (
              <div className="mt-3">
                <div className="flex items-center justify-between text-[0.65rem] text-muted-silver mb-1">
                  <span>{formatTime(progress)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
                <div className="h-1 rounded-full bg-carbon overflow-hidden">
                  <div
                    className="h-full bg-gold/60 transition-all"
                    style={{ width: `${duration ? (progress / duration) * 100 : 0}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}