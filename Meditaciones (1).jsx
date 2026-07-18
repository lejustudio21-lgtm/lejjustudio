import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { IMAGES } from '@/lib/images';
import AppShell from '@/components/AppShell';
import { useLang } from '@/lib/LanguageContext';
import { Play, Headphones } from 'lucide-react';

export default function Meditaciones() {
  const { t } = useLang();
  const [meditations, setMeditations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const load = async () => {
      try {
        const data = await base44.entities.Meditation.list('order', 50);
        setMeditations(data || []);
      } catch {
        setMeditations([]);
      }
      setLoading(false);
    };
    load();
  }, []);

  const filtered = filter === 'all' ? meditations : meditations.filter((m) => m.category === filter);

  const filters = [
    { key: 'all', label: t('common.all') },
    { key: 'adultos', label: t('common.adults') },
    { key: 'adolescentes', label: t('common.teens') },
  ];

  return (
    <AppShell>
      <div className="min-h-screen">
        <div className="relative h-56 overflow-hidden">
          <img src={IMAGES.diamondShards} alt="" className="absolute inset-0 w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-carbon" />
          <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
            <Headphones size={28} strokeWidth={1} className="text-gold mb-3" />
            <h1 className="text-3xl sm:text-4xl font-heading font-light tracking-wide text-gold text-glow-gold">{t('nav.meditaciones')}</h1>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-6 py-12">
          {/* Filters */}
          <div className="flex justify-center gap-2 mb-8">
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-4 py-2 rounded-full text-xs font-heading tracking-wider transition-all ${
                  filter === f.key ? 'bg-white/5 text-gold border border-white/20' : 'text-muted-silver border border-carbon hover:text-silver'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-2 border-white/10 border-t-gold rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-muted-silver text-sm">{t('common.noContent')}</div>
          ) : (
            <div className="space-y-3">
              {filtered.map((med, i) => (
                <div
                  key={med.id || i}
                  className="glass-card glass-card-hover rounded-xl p-5 flex items-center gap-4 animate-fade-in-up"
                  style={{ animationDelay: `${i * 0.05}s`, opacity: 0 }}
                >
                  <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-black/30 border border-carbon">
                    {med.cover_image ? (
                      <img src={med.cover_image} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gold">
                        <Play size={18} strokeWidth={1} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-heading font-medium text-silver truncate">{med.title}</h3>
                      {med.is_premium && <span className="text-[0.6rem] px-1.5 py-0.5 rounded bg-gold/10 text-gold font-heading tracking-wider">{t('common.premium')}</span>}
                    </div>
                    <p className="text-xs text-muted-silver mt-0.5 line-clamp-1">{med.description}</p>
                    {med.duration_minutes && <p className="text-[0.65rem] text-muted-silver/60 mt-1">{med.duration_minutes} min</p>}
                  </div>
                  {med.audio_url ? (
                    <a href={med.audio_url} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-white/5 border border-carbon flex items-center justify-center text-gold hover:bg-white/10 transition-colors">
                      <Play size={14} strokeWidth={1.5} />
                    </a>
                  ) : (
                    <div className="w-9 h-9 rounded-full border border-carbon flex items-center justify-center text-muted-silver/30">
                      <Play size={14} strokeWidth={1.5} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}