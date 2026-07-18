import React, { useState, useEffect, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { IMAGES } from '@/lib/images';
import AppShell from '@/components/AppShell';
import { useLang } from '@/lib/LanguageContext';
import { BookOpen, Calendar, Globe, MapPin } from 'lucide-react';

export default function Raices() {
  const { t } = useLang();
  const [articles, setArticles] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('historia');

  useEffect(() => {
    const load = async () => {
      try {
        const [arts, evs] = await Promise.all([
          base44.entities.RastafariArticle.list('order', 50),
          base44.entities.TimelineEvent.list('order', 50),
        ]);
        setArticles(arts || []);
        setEvents(evs || []);
      } catch {}
      setLoading(false);
    };
    load();
  }, []);

  const uruguayArticles = useMemo(() => articles.filter((a) => a.section === 'uruguay'), [articles]);
  const uruguayEvents = useMemo(
    () => [...events.filter((e) => e.category === 'uruguay')].sort((a, b) => (a.order || 0) - (b.order || 0)),
    [events]
  );

  const tabs = [
    { key: 'historia', label: t('raices.historia'), icon: BookOpen },
    { key: 'timeline', label: t('raices.timeline'), icon: Calendar },
    { key: 'cultura', label: t('raices.cultura'), icon: Globe },
    { key: 'uruguay', label: t('raices.uruguay'), icon: MapPin },
  ];

  return (
    <AppShell>
      <div className="min-h-screen">
        <div className="relative h-56 overflow-hidden">
          <img src={IMAGES.diamondShards2} alt="" className="absolute inset-0 w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-carbon" />
          <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
            <BookOpen size={28} strokeWidth={1} className="text-gold mb-3" />
            <h1 className="text-3xl sm:text-4xl font-heading font-light tracking-wide text-gold text-glow-gold">{t('nav.raices')}</h1>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-12">
          {/* Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {tabs.map((tb) => (
              <button
                key={tb.key}
                onClick={() => setTab(tb.key)}
                className={`px-4 py-2 rounded-full text-xs font-heading tracking-wider transition-all flex items-center gap-2 ${
                  tab === tb.key ? 'bg-white/5 text-gold border border-white/20' : 'text-muted-silver border border-carbon hover:text-silver'
                }`}
              >
                <tb.icon size={14} strokeWidth={1.5} />
                {tb.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-2 border-white/10 border-t-gold rounded-full animate-spin" />
            </div>
          ) : tab === 'historia' ? (
            <div className="space-y-6">
              {articles.filter((a) => a.section === 'historia').length === 0 ? (
                <p className="text-center text-muted-silver text-sm py-20">{t('common.noContent')}</p>
              ) : (
                articles.filter((a) => a.section === 'historia').map((art, i) => (
                  <article key={art.id || i} className="glass-card rounded-2xl overflow-hidden animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s`, opacity: 0 }}>
                    {art.cover_image && (
                      <div className="aspect-[2:1] bg-black/30">
                        <img src={art.cover_image} alt="" className="w-full h-full object-cover opacity-50" />
                      </div>
                    )}
                    <div className="p-6">
                      <h2 className="text-lg font-heading font-medium text-silver mb-3">{art.title}</h2>
                      <p className="text-sm text-silver/60 leading-relaxed font-body whitespace-pre-line">{art.content}</p>
                      {art.author && <p className="text-xs text-muted-silver/60 mt-4 italic">— {art.author}</p>}
                    </div>
                  </article>
                ))
              )}
            </div>
          ) : tab === 'timeline' ? (
            <TimelineView events={events} t={t} filterCat={null} />
          ) : tab === 'cultura' ? (
            <div className="space-y-6">
              {articles.filter((a) => a.section === 'cultura_etiope').length === 0 ? (
                <p className="text-center text-muted-silver text-sm py-20">{t('common.noContent')}</p>
              ) : (
                articles.filter((a) => a.section === 'cultura_etiope').map((art, i) => (
                  <article key={art.id || i} className="glass-card rounded-2xl p-6 animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s`, opacity: 0 }}>
                    <h2 className="text-lg font-heading font-medium text-silver mb-3">{art.title}</h2>
                    <p className="text-sm text-silver/60 leading-relaxed font-body whitespace-pre-line">{art.content}</p>
                  </article>
                ))
              )}
            </div>
          ) : (
            <UruguayView articles={uruguayArticles} events={uruguayEvents} t={t} />
          )}
        </div>
      </div>
    </AppShell>
  );
}

function TimelineView({ events, t, filterCat }) {
  const filtered = filterCat ? events.filter((e) => e.category === filterCat) : events;
  return (
    <div className="relative pl-8">
      <div className="absolute left-3 top-0 bottom-0 w-px bg-carbon" />
      {filtered.length === 0 ? (
        <p className="text-center text-muted-silver text-sm py-20">{t('common.noContent')}</p>
      ) : (
        filtered.map((ev, i) => (
          <div key={ev.id || i} className="relative mb-8 animate-fade-in-up" style={{ animationDelay: `${i * 0.08}s`, opacity: 0 }}>
            <div className="absolute -left-[1.65rem] top-1.5 w-3 h-3 rounded-full bg-gold border-2 border-carbon" />
            <p className="text-xs font-heading text-gold tracking-widest">{ev.year}</p>
            <h3 className="text-sm font-heading font-medium text-silver mt-1">{ev.title}</h3>
            <p className="text-xs text-muted-silver mt-1 leading-relaxed">{ev.description}</p>
          </div>
        ))
      )}
    </div>
  );
}

function UruguayView({ articles, events, t }) {
  const hasContent = articles.length > 0 || events.length > 0;

  return (
    <div className="space-y-10">
      {/* Intro */}
      <div className="text-center max-w-2xl mx-auto animate-fade-in">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/5 border border-white/10 mb-4">
          <MapPin size={20} strokeWidth={1} className="text-gold" />
        </div>
        <p className="text-sm text-muted-silver leading-relaxed font-body italic">{t('raices.uruguayIntro')}</p>
      </div>

      {!hasContent ? (
        <p className="text-center text-muted-silver text-sm py-20">{t('common.noContent')}</p>
      ) : (
        <>
          {/* Timeline section */}
          {events.length > 0 && (
            <div>
              <h2 className="text-sm font-heading tracking-widest text-gold uppercase mb-6 flex items-center gap-2">
                <Calendar size={14} strokeWidth={1.5} />
                {t('raices.timeline')}
              </h2>
              <TimelineView events={events} t={t} filterCat={null} />
            </div>
          )}

          {/* Articles section */}
          {articles.length > 0 && (
            <div>
              <h2 className="text-sm font-heading tracking-widest text-gold uppercase mb-6 flex items-center gap-2">
                <BookOpen size={14} strokeWidth={1.5} />
                {t('raices.historia')}
              </h2>
              <div className="space-y-6">
                {articles.map((art, i) => (
                  <article key={art.id || i} className="glass-card glass-card-hover rounded-2xl overflow-hidden animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s`, opacity: 0 }}>
                    {art.cover_image && (
                      <div className="aspect-[2:1] bg-black/30">
                        <img src={art.cover_image} alt="" className="w-full h-full object-cover opacity-50" />
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="text-lg font-heading font-medium text-silver mb-3">{art.title}</h3>
                      <p className="text-sm text-silver/60 leading-relaxed font-body whitespace-pre-line">{art.content}</p>
                      {art.author && <p className="text-xs text-muted-silver/60 mt-4 italic">— {art.author}</p>}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}