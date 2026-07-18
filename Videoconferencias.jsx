import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { IMAGES } from '@/lib/images';
import AppShell from '@/components/AppShell';
import { useLang } from '@/lib/LanguageContext';
import { Video, Calendar, Play, Clock } from 'lucide-react';

export default function Videoconferencias() {
  const { t } = useLang();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await base44.entities.VideoConference.list('order', 50);
        setSessions(data || []);
      } catch {}
      setLoading(false);
    };
    load();
  }, []);

  const upcoming = sessions.filter((s) => s.is_upcoming);
  const recordings = sessions.filter((s) => !s.is_upcoming);

  return (
    <AppShell>
      <div className="min-h-screen">
        <div className="relative h-56 overflow-hidden">
          <img src={IMAGES.diamondCentered} alt="" className="absolute inset-0 w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-carbon" />
          <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
            <Video size={28} strokeWidth={1} className="text-gold mb-3" />
            <h1 className="text-3xl sm:text-4xl font-heading font-light tracking-wide text-gold text-glow-gold">{t('nav.videoconferencias')}</h1>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-12 space-y-12">
          {loading ? (
            <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-white/10 border-t-gold rounded-full animate-spin" /></div>
          ) : (
            <>
              {/* Upcoming */}
              <div>
                <h2 className="text-sm font-heading text-silver mb-4 tracking-wide flex items-center gap-2"><Calendar size={16} strokeWidth={1.5} /> Próximas Sesiones en Vivo</h2>
                {upcoming.length === 0 ? (
                  <p className="text-center text-muted-silver text-sm py-8">{t('common.noContent')}</p>
                ) : (
                  <div className="space-y-3">
                    {upcoming.map((s, i) => (
                      <div key={s.id || i} className="glass-card rounded-xl p-4 flex items-center justify-between animate-fade-in-up" style={{ animationDelay: `${i * 0.08}s`, opacity: 0 }}>
                        <div>
                          <h3 className="text-sm font-heading text-silver">{s.title}</h3>
                          <p className="text-xs text-muted-silver mt-1">{s.description}</p>
                          <p className="text-[0.65rem] text-gold mt-1">{s.date && new Date(s.date).toLocaleString()}</p>
                        </div>
                        <span className="text-xs px-2 py-1 rounded-full bg-gold/10 text-gold font-heading">Próximamente</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recordings */}
              <div>
                <h2 className="text-sm font-heading text-silver mb-4 tracking-wide flex items-center gap-2"><Play size={16} strokeWidth={1.5} /> Grabaciones</h2>
                {recordings.length === 0 ? (
                  <p className="text-center text-muted-silver text-sm py-8">{t('common.noContent')}</p>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {recordings.map((s, i) => (
                      <div key={s.id || i} className="glass-card glass-card-hover rounded-2xl overflow-hidden animate-fade-in-up" style={{ animationDelay: `${i * 0.08}s`, opacity: 0 }}>
                        <div className="aspect-video bg-black/30 relative">
                          {s.cover_image && <img src={s.cover_image} alt="" className="absolute inset-0 w-full h-full object-cover opacity-40" />}
                          {s.recording_url && (
                            <a href={s.recording_url} target="_blank" rel="noreferrer" className="absolute inset-0 flex items-center justify-center">
                              <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm flex items-center justify-center text-gold hover:scale-110 transition-transform">
                                <Play size={18} strokeWidth={1.5} />
                              </div>
                            </a>
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="text-sm font-heading text-silver">{s.title}</h3>
                          <p className="text-xs text-muted-silver mt-1 line-clamp-1">{s.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </AppShell>
  );
}