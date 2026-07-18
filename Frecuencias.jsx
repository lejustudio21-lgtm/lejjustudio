import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useLang } from '@/lib/LanguageContext';
import { IMAGES } from '@/lib/images';
import AppShell from '@/components/AppShell';
import { Play, Pause, Volume2 } from 'lucide-react';

const DEFAULT_CHAKRAS = [
  { day_of_week: 'Lunes', name_sanskrit: 'Muladhara', name_common: 'Raíz', frequency_hz: 369, mantra_bija: 'LAM', color_hex: '#EF4444', benefits: 'Seguridad, estabilidad y enraizamiento', sacred_symbol: 'Punto', ritual: 'Siéntate en el suelo. Visualiza raíces rojas que descienden desde tu columna hacia el centro de la tierra. Canta LAM siete veces.', order: 1 },
  { day_of_week: 'Martes', name_sanskrit: 'Svadhisthana', name_common: 'Sacro', frequency_hz: 417, mantra_bija: 'VAM', color_hex: '#F97316', benefits: 'Creatividad, emociones y patrones', sacred_symbol: 'Cruz', ritual: 'Coloca las manos en el bajo vientre. Respira en naranja. Siente el agua que fluye en ti. Canta VAM siete veces.', order: 2 },
  { day_of_week: 'Miércoles', name_sanskrit: 'Manipura', name_common: 'Plexo Solar', frequency_hz: 528, mantra_bija: 'RAM', color_hex: '#EAB308', benefits: 'Poder, confianza y reparación celular', sacred_symbol: 'Rombo', ritual: 'Manos sobre el estómago. Visualiza un sol dorado. Siente tu fuego interior. Canta RAM siete veces.', order: 3 },
  { day_of_week: 'Jueves', name_sanskrit: 'Anahata', name_common: 'Corazón', frequency_hz: 639, mantra_bija: 'YAM', color_hex: '#22C55E', benefits: 'Amor, compasión y armonía', sacred_symbol: 'Triángulos - Pirámide', ritual: 'Manos en el pecho. Respira en verde esmeralda. Siente tu corazón expandirse. Canta YAM siete veces.', order: 4 },
  { day_of_week: 'Viernes', name_sanskrit: 'Vishuddha', name_common: 'Garganta', frequency_hz: 741, mantra_bija: 'HAM', color_hex: '#3B82F6', benefits: 'Comunicación, expresión y bucles mentales', sacred_symbol: 'Círculo', ritual: 'Manos en la garganta. Respira en azul cielo. Exprime tu verdad. Canta HAM siete veces.', order: 5 },
  { day_of_week: 'Sábado', name_sanskrit: 'Ajna', name_common: 'Tercer Ojo', frequency_hz: 852, mantra_bija: 'OM', color_hex: '#6366F1', benefits: 'Intuición, sabiduría y orden espiritual', sacred_symbol: 'Nodos', ritual: 'Manos en el entrecejo. Respira en índigo. Abre tu visión interior. Canta OM siete veces.', order: 6 },
  { day_of_week: 'Domingo', name_sanskrit: 'Sahasrara', name_common: 'Corona', frequency_hz: 963, mantra_bija: '—', color_hex: '#FFFFFF', benefits: 'Conexión divina y consciencia suprema', sacred_symbol: 'Puntos Cardinales', ritual: 'Manos sobre la cabeza. Respira en luz blanca. Conéctate con lo que te trasciende. Silencio.', order: 7 },
];

export default function Frecuencias() {
  const { t, lang } = useLang();
  const [chakras, setChakras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeChakra, setActiveChakra] = useState(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await base44.entities.Chakra.list('order', 50);
        if (data && data.length > 0) {
          setChakras(data);
        } else {
          await base44.entities.Chakra.bulkCreate(DEFAULT_CHAKRAS);
          setChakras(DEFAULT_CHAKRAS);
        }
      } catch {
        setChakras(DEFAULT_CHAKRAS);
      }
      setLoading(false);
    };
    load();
  }, []);

  const playTone = (chakra) => {
    setActiveChakra(chakra);
    setPlaying(!playing || activeChakra?.id !== chakra.id);
  };

  return (
    <AppShell>
      <div className="min-h-screen">
        {/* Header */}
        <div className="relative h-64 overflow-hidden">
          <img src={IMAGES.diamondSacred} alt="" className="absolute inset-0 w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-carbon" />
          <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
            <h1 className="text-3xl sm:text-4xl font-heading font-light tracking-wide text-gold text-glow-gold">Frecuencias y Chakras</h1>
            <p className="mt-2 text-sm text-muted-silver font-body italic max-w-md">Cada día vibra en una frecuencia. Cada frecuencia despierta un centro.</p>
          </div>
        </div>

        {/* Cards */}
        <div className="max-w-6xl mx-auto px-6 py-12">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-2 border-white/10 border-t-gold rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {chakras.map((chakra, i) => {
                const isActive = activeChakra?.id === chakra.id || activeChakra === chakra;
                return (
                  <div
                    key={i}
                    className="group relative rounded-2xl overflow-hidden glass-card glass-card-hover p-6 animate-fade-in-up"
                    style={{ animationDelay: `${i * 0.08}s`, opacity: 0 }}
                  >
                    {/* Glow */}
                    <div
                      className="absolute -top-12 -right-12 w-32 h-32 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"
                      style={{ background: chakra.color_hex }}
                    />

                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <p className="text-xs text-muted-silver font-heading tracking-widest uppercase">{chakra.day_of_week}</p>
                          <h3 className="text-lg font-heading font-medium text-silver mt-1">{chakra.name_sanskrit}</h3>
                          <p className="text-xs text-muted-silver">{chakra.name_common}</p>
                        </div>
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center"
                          style={{ background: `${chakra.color_hex}15`, border: `1px solid ${chakra.color_hex}30` }}
                        >
                          <span className="text-xs font-heading" style={{ color: chakra.color_hex }}>{chakra.frequency_hz}Hz</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 mb-4">
                        <span className="px-2.5 py-1 rounded-full bg-white/5 text-xs font-heading text-gold tracking-wider"> {chakra.mantra_bija}</span>
                        <span className="text-xs text-muted-silver">{chakra.sacred_symbol}</span>
                      </div>

                      <p className="text-xs text-silver/60 leading-relaxed mb-4">{chakra.benefits}</p>

                      <div className="text-xs text-muted-silver/60 italic leading-relaxed mb-4 line-clamp-2">{chakra.ritual}</div>

                      <button
                        onClick={() => playTone(chakra)}
                        className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-carbon text-sm text-silver hover:text-gold hover:border-white/20 transition-colors"
                      >
                        {isActive && playing ? <Pause size={14} strokeWidth={1.5} /> : <Play size={14} strokeWidth={1.5} />}
                        <span className="font-heading tracking-wide text-xs">{isActive && playing ? 'Pausar' : 'Reproducir tono'}</span>
                      </button>
                    </div>

                    {/* Expanded ritual */}
                    {isActive && (
                      <div className="relative z-10 mt-4 p-3 rounded-lg bg-black/30 border border-carbon animate-fade-in">
                        <p className="text-xs text-gold font-heading mb-1">Ritual de activación</p>
                        <p className="text-xs text-silver/70 leading-relaxed font-body italic">{chakra.ritual}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}