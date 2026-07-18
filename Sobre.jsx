import React from 'react';
import { IMAGES } from '@/lib/images';
import AppShell from '@/components/AppShell';
import { useLang } from '@/lib/LanguageContext';

export default function Sobre() {
  const { t } = useLang();

  return (
    <AppShell>
      <div className="min-h-screen">
        <div className="relative h-64 overflow-hidden">
          <img src={IMAGES.diamondChrome} alt="" className="absolute inset-0 w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-carbon" />
          <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
            <img src={IMAGES.diamondCentered} alt="Sello LEJJU" className="w-16 h-16 rounded-full object-cover ring-1 ring-white/10 animate-float mb-4" />
            <h1 className="text-3xl sm:text-4xl font-heading font-light tracking-wide text-gold text-glow-gold">{t('nav.sobre')}</h1>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-6 py-12 space-y-8">
          <div className="glass-card rounded-2xl p-8">
            <h2 className="text-base font-heading font-medium text-gold mb-3 tracking-wide">Misión</h2>
            <p className="text-sm text-silver/70 leading-relaxed font-body">
              LEJJU Studio existe para facilitar el viaje del alma desde el ruido hacia la claridad. Somos un taller alquímico del ser donde cada herramienta es un crisol, cada frecuencia un catalizador y cada pregunta una llave. No vendemos respuestas: activamos las que ya viven en ti.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-8">
            <h2 className="text-base font-heading font-medium text-gold mb-3 tracking-wide">Valores</h2>
            <div className="space-y-3">
              {[
                { title: 'Soberanía', desc: 'Cada ser es el autor de su propia existencia.' },
                { title: 'Verdad', desc: 'Buscamos la que nace de adentro, no la impuesta.' },
                { title: 'Tribu', desc: 'Conectamos almas en resonancia, no en dependencia.' },
                { title: 'Transformación', desc: 'No se consume: se transforma. Todo es crisol.' },
                { title: 'Equilibrio', desc: 'Entre cielo y tierra, entre forma y vacío.' },
              ].map((v, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-gold mt-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-heading text-silver">{v.title}</p>
                    <p className="text-xs text-muted-silver leading-relaxed">{v.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-2xl p-8">
            <h2 className="text-base font-heading font-medium text-gold mb-3 tracking-wide">Historia</h2>
            <p className="text-sm text-silver/70 leading-relaxed font-body">
              LEJJU nace del Sello: un dispositivo arquetípico de desprogramación que mapea el viaje del alma desde el punto de origen hasta la expansión cuántica. Su geometría —punto, cruz, rombo, cuadrado, triángulos, pirámide, círculo abierto, nodos y líneas cardinales— no es decorativa: es un mapa vivo. Cada símbolo desmonta un condicionamiento externo. Cada línea, un camino. El Studio es donde ese mapa se vuelve práctica: meditaciones, frecuencias, rituales, comunidad y conocimiento.
            </p>
          </div>

          <div className="text-center py-6">
            <p className="text-sm font-heading font-light text-gold tracking-[0.15em] italic">"Vivo según la Ley, en Equilibrio, con Justicia, desde el Juicio consciente, en Unidad"</p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}