import React, { useState } from 'react';
import { startCheckout } from '@/lib/checkout';
import { ChevronRight, Lock } from 'lucide-react';

const PRICE = 9.99;

const EXPLANATION = `Los números indican el mejor camino hacia tu libertad. Este es el comando desde la creación: te revela los obstáculos, te guía en la superación.

A veces te tira de lleno en situaciones que sostenes hasta que revientan por algún lado. También están las que se repiten todo el tiempo, y luego las que haces de modo inconsciente porque lo aprendiste así y nunca te lo cuestionaste. Aun sabiendo que algo no funciona como debería, no es tan malo — y seguimos infelices, insatisfechos. Muchas veces quienes te rodean pagan las consecuencias de tu incomodidad frente a la vida.

Esto es el mapa. Eso sí: acá no hay atajos, no hay tapas, no hay mentiras. Acá te enseña a mirarte a vos mismo, a todo tu "yo soy" — no solo a esa parte que vendemos como marketing, mostrando la mejor cara del producto. Acá no te muestra cómo hacerte cargo: por eso están todas las herramientas en este mismo lugar.`;

export default function NumerologyReadingCTA() {
  const [buying, setBuying] = useState(false);

  const handleBuy = async () => {
    if (buying) return;
    setBuying(true);
    try {
      await startCheckout(
        [{ name: 'Lectura Numerológica — Actual y Próximos Meses', price: PRICE, quantity: 1 }],
        { type: 'product', successUrl: `${window.location.origin}/perfil` }
      );
    } catch (e) {
      if (e.message !== 'Checkout blocked in iframe') {
        alert('Error al procesar el pago. Intenta nuevamente.');
        setBuying(false);
      }
    }
  };

  return (
    <div className="rounded-2xl bg-gradient-to-b from-gold/[0.06] to-transparent border border-gold/20 p-4">
      <div className="flex items-center gap-2 mb-3">
        <Lock size={12} strokeWidth={1.5} className="text-gold" />
        <p className="text-[0.65rem] font-heading tracking-widest text-gold uppercase">
          Lectura Numerológica Completa
        </p>
      </div>

      <p className="text-[0.7rem] text-muted-silver leading-relaxed font-body mb-4 whitespace-pre-line">
        {EXPLANATION}
      </p>

      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[0.6rem] text-muted-silver/60 mb-0.5">Actual + próximos meses</p>
          <p className="text-lg font-heading text-gold">U$S 9,99</p>
        </div>
        <button
          onClick={handleBuy}
          disabled={buying}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gold/10 border border-gold/30 text-gold font-heading text-xs tracking-wider hover:bg-gold/20 disabled:opacity-40 transition-colors"
        >
          {buying ? 'Procesando...' : <>Integrar mi energía <ChevronRight size={14} strokeWidth={1.5} /></>}
        </button>
      </div>
    </div>
  );
}