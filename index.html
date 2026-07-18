import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLang } from '@/lib/LanguageContext';
import { IMAGES } from '@/lib/images';
import { base44 } from '@/api/base44Client';
import { Globe, ChevronRight } from 'lucide-react';

export default function Landing() {
  const { t, lang, setLang } = useLang();
  const navigate = useNavigate();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const check = async () => {
      try {
        const me = await base44.auth.me();
        if (me?.sovereignty_signed_date) {
          navigate('/home');
          return;
        }
        if (me) {
          navigate('/onboarding');
          return;
        }
      } catch {}
      setChecked(true);
    };
    check();
  }, []);

  if (!checked) return (
    <div className="min-h-screen flex items-center justify-center bg-carbon">
      <div className="w-8 h-8 border-2 border-white/10 border-t-gold rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen relative overflow-hidden bg-carbon">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={IMAGES.heroExplosion}
          alt=""
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/90" />
      </div>

      {/* Language toggle */}
      <div className="absolute top-6 right-6 z-20">
        <button
          onClick={() => setLang(lang === 'es' ? 'en' : 'es')}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full glass-card text-xs text-silver hover:text-gold transition-colors"
        >
          <Globe size={14} strokeWidth={1.5} />
          {lang === 'es' ? 'EN' : 'ES'}
        </button>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <div className="animate-fade-in-up" style={{ animationDelay: '0.2s', opacity: 0 }}>
          <img
            src={IMAGES.diamondCentered}
            alt="Sello LEJJU"
            className="w-32 h-32 sm:w-40 sm:h-40 mx-auto rounded-full object-cover ring-1 ring-white/10 animate-float"
          />
        </div>

        <h1 className="mt-8 text-4xl sm:text-5xl md:text-6xl font-heading font-light tracking-[0.15em] text-silver text-glow-gold animate-fade-in-up" style={{ animationDelay: '0.4s', opacity: 0 }}>
          LEJJU STUDIO
        </h1>

        <p className="mt-4 text-lg sm:text-xl font-heading font-light text-gold tracking-wide animate-fade-in-up" style={{ animationDelay: '0.6s', opacity: 0 }}>
          {t('landing.tagline1')}
        </p>
        <p className="mt-1 text-sm sm:text-base font-body italic text-muted-silver animate-fade-in-up" style={{ animationDelay: '0.7s', opacity: 0 }}>
          {t('landing.tagline2')}
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 animate-fade-in-up" style={{ animationDelay: '0.9s', opacity: 0 }}>
          <button
            onClick={() => navigate('/login')}
            className="group px-8 py-3.5 rounded-full bg-gradient-to-r from-white/[0.08] to-white/[0.04] border border-white/20 text-gold font-heading text-sm tracking-wider hover:border-white/40 hover:glow-gold transition-all"
          >
            {t('landing.cta')}
            <ChevronRight size={16} className="inline ml-2 group-hover:translate-x-1 transition-transform" strokeWidth={1.5} />
          </button>
          <Link
            to="/login"
            className="px-8 py-3.5 rounded-full border border-carbon text-muted-silver font-heading text-sm tracking-wider hover:text-silver hover:border-white/20 transition-all"
          >
            {t('landing.enter')}
          </Link>
        </div>
      </div>
    </div>
  );
}