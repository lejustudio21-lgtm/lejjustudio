import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useLang } from '@/lib/LanguageContext';
import { IMAGES } from '@/lib/images';
import SelloIcon from '@/components/SelloIcon';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';

const SEAL_SYMBOLS = [
  { key: 'punto', shape: 'circle' },
  { key: 'cruz', shape: 'cross' },
  { key: 'rombo', shape: 'diamond' },
  { key: 'cuadrado', shape: 'square' },
  { key: 'triangulos', shape: 'triangles' },
  { key: 'piramide', shape: 'pyramid' },
  { key: 'circulo', shape: 'openCircle' },
  { key: 'nodos', shape: 'nodes' },
  { key: 'cardinales', shape: 'cardinals' },
];

function SymbolGlyph({ shape }) {
  const stroke = 'currentColor';
  const sw = 1.2;
  switch (shape) {
    case 'circle':
      return <circle cx="24" cy="24" r="6" fill={stroke} />;
    case 'cross':
      return <>
        <line x1="24" y1="10" x2="24" y2="38" stroke={stroke} strokeWidth={sw} />
        <line x1="10" y1="24" x2="38" y2="24" stroke={stroke} strokeWidth={sw} />
      </>;
    case 'diamond':
      return <polygon points="24,8 40,24 24,40 8,24" stroke={stroke} strokeWidth={sw} fill="none" />;
    case 'square':
      return <rect x="10" y="10" width="28" height="28" stroke={stroke} strokeWidth={sw} fill="none" />;
    case 'triangles':
      return <>
        <polygon points="24,8 38,32 10,32" stroke={stroke} strokeWidth={sw} fill="none" />
        <polygon points="24,40 38,16 10,16" stroke={stroke} strokeWidth={sw} fill="none" opacity="0.4" />
      </>;
    case 'pyramid':
      return <>
        <polygon points="24,8 40,36 8,36" stroke={stroke} strokeWidth={sw} fill="none" />
        <line x1="24" y1="8" x2="24" y2="36" stroke={stroke} strokeWidth={sw} opacity="0.4" />
      </>;
    case 'openCircle':
      return <path d="M 10 24 A 14 14 0 1 1 38 24" stroke={stroke} strokeWidth={sw} fill="none" />;
    case 'nodes':
      return <>
        <circle cx="12" cy="12" r="2" fill={stroke} />
        <circle cx="36" cy="12" r="2" fill={stroke} />
        <circle cx="24" cy="24" r="2" fill={stroke} />
        <circle cx="12" cy="36" r="2" fill={stroke} />
        <circle cx="36" cy="36" r="2" fill={stroke} />
        <line x1="12" y1="12" x2="24" y2="24" stroke={stroke} strokeWidth={0.6} opacity="0.4" />
        <line x1="36" y1="12" x2="24" y2="24" stroke={stroke} strokeWidth={0.6} opacity="0.4" />
        <line x1="12" y1="36" x2="24" y2="24" stroke={stroke} strokeWidth={0.6} opacity="0.4" />
        <line x1="36" y1="36" x2="24" y2="24" stroke={stroke} strokeWidth={0.6} opacity="0.4" />
      </>;
    case 'cardinals':
      return <>
        <line x1="24" y1="6" x2="24" y2="42" stroke={stroke} strokeWidth={sw} opacity="0.5" />
        <line x1="6" y1="24" x2="42" y2="24" stroke={stroke} strokeWidth={sw} opacity="0.5" />
        <text x="24" y="5" fontSize="4" fill={stroke} textAnchor="middle">N</text>
        <text x="24" y="47" fontSize="4" fill={stroke} textAnchor="middle">S</text>
        <text x="3" y="25" fontSize="4" fill={stroke} textAnchor="middle">O</text>
        <text x="45" y="25" fontSize="4" fill={stroke} textAnchor="middle">E</text>
        <circle cx="24" cy="24" r="3" fill={stroke} />
      </>;
    default:
      return null;
  }
}

export default function Onboarding() {
  const { t, lang } = useLang();
  const navigate = useNavigate();
  const [accepted, setAccepted] = useState(false);
  const [signing, setSigning] = useState(false);
  const [expandedSymbol, setExpandedSymbol] = useState(null);
  const [user, setUser] = useState(null);
  const [alreadySigned, setAlreadySigned] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const me = await base44.auth.me();
        setUser(me);
        if (me?.sovereignty_signed_date) {
          setAlreadySigned(true);
        }
      } catch {
        navigate('/login');
      }
    };
    checkUser();
  }, []);

  const signSello = async () => {
    if (!accepted || signing) return;
    setSigning(true);
    try {
      const now = new Date().toISOString();
      await base44.auth.updateMe({ sovereignty_signed_date: now });
      navigate('/');
    } catch (err) {
      console.error(err);
    }
    setSigning(false);
  };

  if (alreadySigned) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-carbon">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={IMAGES.diamondSacred} alt="" className="w-full h-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/90" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-6 py-16 sm:py-24">
        {/* Title */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="flex justify-center mb-6">
            <SelloIcon size={96} glow />
          </div>
          <p className="text-xs font-heading tracking-[0.4em] text-muted-silver uppercase mb-2">{t('sello.subtitle')}</p>
          <h1 className="text-3xl sm:text-4xl font-heading font-light tracking-wide text-gold text-glow-gold">{t('sello.title')}</h1>
        </div>

        {/* Anatomy of the Seal */}
        <div className="mb-16">
          <h2 className="text-lg font-heading font-medium text-silver mb-8 text-center tracking-wide">{t('sello.anatomy')}</h2>
          <div className="space-y-2">
            {SEAL_SYMBOLS.map((sym, i) => {
              const data = t(`sello.${sym.key}`);
              const isExpanded = expandedSymbol === i;
              return (
                <div
                  key={sym.key}
                  className={`glass-card rounded-xl overflow-hidden transition-all duration-500 cursor-pointer ${isExpanded ? 'glow-soft' : ''}`}
                  style={{ animationDelay: `${i * 0.08}s` }}
                  onClick={() => setExpandedSymbol(isExpanded ? null : i)}
                >
                  <div className="flex items-center gap-4 p-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-black/30 border border-carbon flex items-center justify-center text-gold">
                      <svg viewBox="0 0 48 48" className="w-7 h-7">
                        <SymbolGlyph shape={sym.shape} />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-heading font-medium text-silver">{data.name}</p>
                      {!isExpanded && <p className="text-xs text-muted-silver truncate mt-0.5">{data.desc}</p>}
                    </div>
                    {isExpanded ? <ChevronUp size={16} className="text-muted-silver" strokeWidth={1.5} /> : <ChevronDown size={16} className="text-muted-silver" strokeWidth={1.5} />}
                  </div>
                  {isExpanded && (
                    <div className="px-4 pb-4 animate-fade-in">
                      <p className="text-sm text-silver/80 leading-relaxed font-body pl-16">{data.desc}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Integral Meaning */}
        <div className="mb-12 glass-card rounded-2xl p-8">
          <h3 className="text-base font-heading font-medium text-gold mb-4 tracking-wide">{t('sello.integral')}</h3>
          <p className="text-sm text-silver/70 leading-relaxed font-body">{t('sello.integralText')}</p>
        </div>

        {/* Manifesto */}
        <div className="mb-12 glass-card rounded-2xl p-8">
          <h3 className="text-base font-heading font-medium text-gold mb-4 tracking-wide">{t('sello.manifiesto')}</h3>
          <p className="text-sm text-silver/70 leading-relaxed font-body italic">{t('sello.manifiestoText')}</p>
        </div>

        {/* Studio */}
        <div className="mb-12 text-center">
          <p className="text-3xl font-heading font-light tracking-[0.3em] text-gold text-glow-gold mb-3">{t('sello.studio')}</p>
          <p className="text-sm text-silver/60 leading-relaxed font-body italic max-w-lg mx-auto">{t('sello.studioText')}</p>
        </div>

        {/* Motto */}
        <div className="mb-12 text-center glass-card rounded-2xl p-8 glow-soft">
          <p className="text-base sm:text-lg font-heading font-light text-silver leading-relaxed tracking-wide">
            "{t('sello.motto')}"
          </p>
        </div>

        {/* Sign */}
        <div className="text-center">
          <label className="flex items-center justify-center gap-3 mb-6 cursor-pointer group">
            <div
              onClick={() => setAccepted(!accepted)}
              className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${
                accepted ? 'bg-gold border-gold text-black' : 'border-carbon text-transparent group-hover:border-white/30'
              }`}
            >
              {accepted && <Check size={14} strokeWidth={2.5} />}
            </div>
            <input type="checkbox" checked={accepted} onChange={(e) => setAccepted(e.target.checked)} className="sr-only" />
            <span className="text-sm text-muted-silver font-body">{t('sello.accept')}</span>
          </label>

          <button
            onClick={signSello}
            disabled={!accepted || signing}
            className="px-10 py-3.5 rounded-full bg-gradient-to-r from-white/[0.1] to-white/[0.05] border border-white/20 text-gold font-heading text-sm tracking-[0.2em] hover:border-white/40 hover:glow-gold disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            {signing ? '...' : t('sello.sign')}
          </button>
        </div>
      </div>
    </div>
  );
}