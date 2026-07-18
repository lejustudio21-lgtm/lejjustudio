import React, { useState } from 'react';
import { IMAGES } from '@/lib/images';
import AppShell from '@/components/AppShell';
import { useLang } from '@/lib/LanguageContext';
import { base44 } from '@/api/base44Client';
import { Hash, Calculator, Sparkles, Check } from 'lucide-react';
import { startCheckout } from '@/lib/checkout';

const LIFE_PATH_NUMBERS = {
  1: { title: 'El Líder', desc: 'Independencia, determinación y pionero. Tu camino es liderar con originalidad y valentía. Viene a crear, no a seguir.' },
  2: { title: 'El Diplomático', desc: 'Cooperación, sensibilidad y equilibrio. Tu don es armonizar, mediar y construir puentes entre opuestos.' },
  3: { title: 'El Comunicador', desc: 'Expresión, creatividad y alegría. Tu camino es inspirar a través del arte, la palabra y la espontaneidad.' },
  4: { title: 'El Constructor', desc: 'Estabilidad, trabajo y estructura. Tu misión es construir cimientos sólidos y perdurables.' },
  5: { title: 'El Aventurero', desc: 'Libertad, cambio y experiencia. Viene a romper moldes y explorar los límites de la existencia.' },
  6: { title: 'El Nutricio', desc: 'Amor, familia y responsabilidad. Tu camino es cuidar, sanar y crear armonía en tu entorno.' },
  7: { title: 'El Buscador', desc: 'Sabiduría, introspección y misterio. Viene a desentrañar los secretos del universo y de sí mismo.' },
  8: { title: 'El Poderoso', desc: 'Ambición, autoridad y abundancia. Tu misión es dominar el mundo material con visión espiritual.' },
  9: { title: 'El Humanitario', desc: 'Compasión, cierre y trascendencia. Viene a soltar, perdonar y servir a la colectividad.' },
  11: { title: 'El Iluminador', desc: 'Maestro espiritual, intuición elevada. Tu camino es inspirar consciencia a través de la verdad interior.' },
  22: { title: 'El Maestro Constructor', desc: 'Visión práctica a gran escala. Tu misión es materializar sueños que transforman el mundo.' },
};

export default function Numerologia() {
  const { t } = useLang();
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [result, setResult] = useState(null);
  const [requesting, setRequesting] = useState(false);
  const [requested, setRequested] = useState(false);

  const calculate = () => {
    if (!birthDate) return;
    const digits = birthDate.replace(/-/g, '').split('').map(Number);
    let sum = digits.reduce((a, b) => a + b, 0);
    while (sum > 9 && sum !== 11 && sum !== 22) {
      sum = sum.toString().split('').map(Number).reduce((a, b) => a + b, 0);
    }
    setResult(sum);
  };

  const requestReading = async () => {
    setRequesting(true);
    try {
      const me = await base44.auth.me();
      const serviceRequest = await base44.entities.ServiceRequest.create({
        user_id: me.id,
        user_email: me.email,
        user_name: name || me.full_name || me.email,
        service_type: 'numerologia',
        form_data: { full_name: name, birth_date: birthDate, intention: 'Lectura numérica personal completa' },
        price: 50,
        status: 'pendiente',
      });
      await base44.integrations.Core.SendEmail({
        to: 'lejustudio21@gmail.com',
        subject: `🔔 Nueva solicitud: Lectura Numerológica — ${name || me.full_name || me.email}`,
        body: `Nueva solicitud de lectura numerológica recibida.\n\nUsuario: ${name || me.full_name || me.email}\nEmail: ${me.email}\nFecha de nacimiento: ${birthDate}\nPrecio: U$S 50\n\nRevisa el panel de administración para gestionar esta solicitud.`,
      });
      await startCheckout(
        [{ name: 'Lectura Numérica Personal', price: 50, quantity: 1 }],
        { type: 'service', serviceRequestId: serviceRequest.id, successUrl: `${window.location.origin}/perfil` }
      );
    } catch (e) {
      if (e.message !== 'Checkout blocked in iframe') {
        setRequested(true);
      }
    }
    setRequesting(false);
  };

  return (
    <AppShell>
      <div className="min-h-screen">
        <div className="relative h-56 overflow-hidden">
          <img src={IMAGES.diamondPure} alt="" className="absolute inset-0 w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-carbon" />
          <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
            <Hash size={28} strokeWidth={1} className="text-gold mb-3" />
            <h1 className="text-3xl sm:text-4xl font-heading font-light tracking-wide text-gold text-glow-gold">{t('nav.numerologia')}</h1>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-6 py-12">
          {/* Intro */}
          <div className="glass-card rounded-2xl p-6 mb-8">
            <h2 className="text-base font-heading font-medium text-gold mb-3">Numerología Pitagórica</h2>
            <p className="text-sm text-silver/60 leading-relaxed font-body">
              La numerología pitagórica es un sistema ancestral que asigna significado a los números. Tu número de vida se calcula a partir de tu fecha de nacimiento y revela el camino del alma, sus lecciones y su propósito. Cada número vibra en una frecuencia arquetípica que resuena con tu esencia.
            </p>
          </div>

          {/* Calculator */}
          <div className="glass-card rounded-2xl p-6 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Calculator size={18} strokeWidth={1.5} className="text-gold" />
              <h3 className="text-sm font-heading font-medium text-silver">Calculadora de Número de Vida</h3>
            </div>
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-xs text-muted-silver mb-1 block">Nombre completo</label>
                <input value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-black/30 border border-carbon rounded-lg px-3 py-2 text-sm text-silver focus:outline-none focus:border-white/20" />
              </div>
              <div>
                <label className="text-xs text-muted-silver mb-1 block">Fecha de nacimiento</label>
                <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} className="w-full bg-black/30 border border-carbon rounded-lg px-3 py-2 text-sm text-silver focus:outline-none focus:border-white/20" />
              </div>
            </div>
            <button onClick={calculate} disabled={!birthDate} className="w-full py-2.5 rounded-lg bg-white/5 border border-white/20 text-gold font-heading text-xs tracking-wider hover:bg-white/10 disabled:opacity-30 transition-colors">Calcular</button>

            {result && (
              <div className="mt-6 text-center animate-scale-in">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gold/5 border border-gold/20 mb-3">
                  <span className="text-3xl font-heading font-light text-gold">{result}</span>
                </div>
                {LIFE_PATH_NUMBERS[result] && (
                  <>
                    <p className="text-lg font-heading text-silver">{LIFE_PATH_NUMBERS[result].title}</p>
                    <p className="text-sm text-silver/60 leading-relaxed font-body mt-2 max-w-md mx-auto">{LIFE_PATH_NUMBERS[result].desc}</p>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Request reading */}
          {requested ? (
            <div className="glass-card rounded-2xl p-6 text-center">
              <Check size={24} strokeWidth={1.5} className="text-gold mx-auto mb-3" />
              <p className="text-sm text-silver font-heading">Solicitud enviada</p>
              <p className="text-xs text-muted-silver mt-1">Recibirás tu lectura completa por email y en tu perfil.</p>
            </div>
          ) : (
            <div className="glass-card rounded-2xl p-6 text-center">
              <Sparkles size={20} strokeWidth={1.5} className="text-gold mx-auto mb-3" />
              <h3 className="text-sm font-heading text-silver mb-2">Lectura Numérica Personal</h3>
              <p className="text-xs text-muted-silver mb-4 max-w-md mx-auto">Análisis profundo de tu nombre y fecha de nacimiento. Incluye número de vida, número del alma, personalidad y año personal.</p>
              <p className="text-lg font-heading text-gold mb-4">$50</p>
              <button onClick={requestReading} disabled={requesting} className="px-6 py-2.5 rounded-full bg-white/5 border border-white/20 text-gold font-heading text-xs tracking-wider hover:bg-white/10 disabled:opacity-30 transition-colors">Solicitar Lectura</button>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}