import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { IMAGES } from '@/lib/images';
import AppShell from '@/components/AppShell';
import { useLang } from '@/lib/LanguageContext';
import { startCheckout } from '@/lib/checkout';
import { Mic, Play, Lock, ChevronRight } from 'lucide-react';
import AdolescentesPlayer from '@/components/podcasts/AdolescentesPlayer';

const CATEGORIES = [
  { key: 'adultos', label_es: 'Adultos', label_en: 'Adults' },
  { key: 'adolescentes', label_es: 'Adolescentes', label_en: 'Teens' },
];

export default function Podcasts() {
  const { t, lang } = useLang();
  const [podcasts, setPodcasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('adultos');
  const [buying, setBuying] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await base44.entities.Podcast.list('order', 50);
        setPodcasts(data || []);
      } catch {
        setPodcasts([]);
      }
      setLoading(false);
    };
    load();
  }, []);

  const filtered = filter === 'all' ? podcasts : podcasts.filter((p) => p.category === filter);

  const handleBuy = async (pod) => {
    if (buying || !pod.price) return;
    setBuying(pod.id);
    try {
      await startCheckout(
        [{ name: pod.title, price: pod.price, quantity: 1 }],
        { type: 'product', successUrl: `${window.location.origin}/perfil` }
      );
    } catch (e) {
      if (e.message !== 'Checkout blocked in iframe') {
        alert(lang === 'es' ? 'Error al procesar el pago. Intenta nuevamente.' : 'Payment error. Please try again.');
      }
      setBuying(null);
    }
  };

  return (
    <AppShell>
      <div className="min-h-screen">
        <div className="relative h-56 overflow-hidden">
          <img src={IMAGES.diamondChrome} alt="" className="absolute inset-0 w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-carbon" />
          <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
            <Mic size={28} strokeWidth={1} className="text-gold mb-3" />
            <h1 className="text-3xl sm:text-4xl font-heading font-light tracking-wide text-gold text-glow-gold">{t('nav.podcasts')}</h1>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-6 py-12">
          {/* Category filter — segmented control */}
          <div className="flex justify-center mb-10">
            <div className="inline-flex rounded-full border border-carbon bg-black/20 p-1">
              {CATEGORIES.map((c) => (
                <button
                  key={c.key}
                  onClick={() => setFilter(c.key)}
                  className={`px-6 py-2 rounded-full text-xs font-heading tracking-wider transition-all duration-300 ${
                    filter === c.key
                      ? 'bg-white/5 text-gold border border-white/20 glow-soft'
                      : 'text-muted-silver hover:text-silver'
                  }`}
                >
                  {lang === 'es' ? c.label_es : c.label_en}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-2 border-white/10 border-t-gold rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-muted-silver text-sm">{t('common.noContent')}</div>
          ) : filter === 'adolescentes' ? (
            <AdolescentesPlayer episodes={filtered} lang={lang} />
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {filtered.map((pod, i) => (
                <div
                  key={pod.id || i}
                  className="glass-card glass-card-hover rounded-2xl overflow-hidden animate-fade-in-up"
                  style={{ animationDelay: `${i * 0.06}s`, opacity: 0 }}
                >
                  <div className="aspect-video bg-black/30 relative">
                    {pod.cover_image && <img src={pod.cover_image} alt="" className="absolute inset-0 w-full h-full object-cover opacity-60" />}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    {pod.embed_url && (
                      <a href={pod.embed_url} target="_blank" rel="noreferrer" className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm flex items-center justify-center text-gold hover:scale-110 transition-transform">
                          <Play size={18} strokeWidth={1.5} />
                        </div>
                      </a>
                    )}
                    {pod.price > 0 && (
                      <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-sm border border-white/10">
                        <Lock size={10} strokeWidth={1.5} className="text-gold" />
                        <span className="text-[0.65rem] font-heading text-gold">${pod.price}</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    {pod.episode_number && <p className="text-[0.65rem] text-muted-silver font-heading tracking-widest uppercase mb-1">Ep. {pod.episode_number}</p>}
                    <h3 className="text-sm font-heading font-medium text-silver">{pod.title}</h3>
                    <p className="text-xs text-muted-silver mt-1 line-clamp-2">{pod.description}</p>
                    <div className="flex items-center justify-between mt-3">
                      {pod.duration ? <p className="text-[0.65rem] text-muted-silver/60">{pod.duration}</p> : <span />}
                      {pod.price > 0 ? (
                        <button
                          onClick={() => handleBuy(pod)}
                          disabled={buying === pod.id}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/5 border border-white/20 text-xs text-gold font-heading hover:bg-white/10 disabled:opacity-30 transition-colors"
                        >
                          {buying === pod.id ? '...' : <>{lang === 'es' ? 'Comprar' : 'Buy'} <ChevronRight size={12} strokeWidth={1.5} /></>}
                        </button>
                      ) : (
                        pod.embed_url && (
                          <a href={pod.embed_url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs text-silver hover:text-gold transition-colors font-heading">
                            {lang === 'es' ? 'Escuchar' : 'Listen'} <ChevronRight size={12} strokeWidth={1.5} />
                          </a>
                        )
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}