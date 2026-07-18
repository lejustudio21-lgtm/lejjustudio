import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { IMAGES } from '@/lib/images';
import AppShell from '@/components/AppShell';
import { useLang } from '@/lib/LanguageContext';
import { Sparkles, Check, Flame } from 'lucide-react';
import { startCheckout } from '@/lib/checkout';

const RITUAL_CATALOG = [
  { title: 'Ritual de Protección', desc: 'Limpieza energética y escudo para tu espacio personal.', price: 40 },
  { title: 'Ritual de Abundancia', desc: 'Apertura de caminos materiales y flujo de prosperidad.', price: 45 },
  { title: 'Ritual de Sanación', desc: 'Liberación de bloqueos emocionales y restauración del equilibrio.', price: 50 },
  { title: 'Ritual de Amor', desc: 'Atracción de vibración amorosa y armonización del corazón.', price: 45 },
  { title: 'Ritual de Corte', desc: 'Cierre de ciclos, cordones y vínculos que ya no sirven.', price: 40 },
  { title: 'Ritual Personalizado', desc: 'Diseñado específicamente para tu intención y momento.', price: 60 },
];

export default function Rituales() {
  const { t } = useLang();
  const [requests, setRequests] = useState([]);
  const [selected, setSelected] = useState(null);
  const [intention, setIntention] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const me = await base44.auth.me();
        setUser(me);
        const reqs = await base44.entities.ServiceRequest.filter({ user_id: me.id, service_type: 'ritual' }, '-created_date', 20);
        setRequests(reqs || []);
      } catch {}
    };
    load();
  }, []);

  const submit = async () => {
    if (!selected || !intention.trim()) return;
    setSubmitting(true);
    try {
      const serviceRequest = await base44.entities.ServiceRequest.create({
        user_id: user.id,
        user_email: user.email,
        user_name: user.full_name || user.email,
        service_type: 'ritual',
        form_data: { full_name: user.full_name || user.email, birth_date: user.birth_date || '', intention: intention.trim() },
        price: selected.price,
        status: 'pendiente',
      });
      await base44.integrations.Core.SendEmail({
        to: 'lejustudio21@gmail.com',
        subject: `🔔 Nueva solicitud: ${selected.title} — ${user.full_name || user.email}`,
        body: `Nueva solicitud de ritual recibida.\n\nTipo: ${selected.title}\nUsuario: ${user.full_name || user.email}\nEmail: ${user.email}\nPrecio: U$S ${selected.price}\nIntención: ${intention.trim()}\n\nRevisa el panel de administración para gestionar esta solicitud.`,
      });
      await startCheckout(
        [{ name: selected.title, price: selected.price, quantity: 1 }],
        { type: 'service', serviceRequestId: serviceRequest.id, successUrl: `${window.location.origin}/perfil` }
      );
    } catch (e) {
      if (e.message !== 'Checkout blocked in iframe') {
        setDone(true);
        setSelected(null);
        setIntention('');
      }
    }
    setSubmitting(false);
  };

  return (
    <AppShell>
      <div className="min-h-screen">
        <div className="relative h-56 overflow-hidden">
          <img src={IMAGES.diamondGrid} alt="" className="absolute inset-0 w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-carbon" />
          <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
            <Sparkles size={28} strokeWidth={1} className="text-gold mb-3" />
            <h1 className="text-3xl sm:text-4xl font-heading font-light tracking-wide text-gold text-glow-gold">{t('nav.rituales')}</h1>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-12">
          {/* Catalog */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
            {RITUAL_CATALOG.map((ritual, i) => (
              <div key={i} className="glass-card glass-card-hover rounded-2xl p-5 animate-fade-in-up" style={{ animationDelay: `${i * 0.08}s`, opacity: 0 }}>
                <Flame size={18} strokeWidth={1} className="text-gold mb-2" />
                <h3 className="text-sm font-heading font-medium text-silver mb-1">{ritual.title}</h3>
                <p className="text-xs text-muted-silver leading-relaxed mb-3">{ritual.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-base font-heading text-gold">${ritual.price}</span>
                  <button onClick={() => setSelected(ritual)} className="px-3 py-1.5 rounded-full bg-white/5 border border-white/20 text-xs text-gold font-heading hover:bg-white/10 transition-colors">Solicitar</button>
                </div>
              </div>
            ))}
          </div>

          {/* My requests */}
          {requests.length > 0 && (
            <div>
              <h2 className="text-sm font-heading text-silver mb-4 tracking-wide">Mis Rituales</h2>
              <div className="space-y-2">
                {requests.map((req) => (
                  <div key={req.id} className="glass-card rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-silver">{new Date(req.created_date).toLocaleDateString()}</p>
                      <p className="text-sm text-silver/80 mt-0.5 line-clamp-1">{req.form_data?.intention}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${req.status === 'entregado' ? 'bg-green-500/10 text-green-400' : 'bg-white/5 text-muted-silver'}`}>
                      {req.status === 'entregado' ? 'Entregado' : 'Pendiente'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal */}
        {selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelected(null)} />
            <div className="relative glass-card rounded-2xl p-6 w-full max-w-md animate-scale-in">
              <h3 className="text-lg font-heading text-gold mb-2">{selected.title}</h3>
              <p className="text-xs text-muted-silver mb-4">{selected.desc}</p>
              <div className="mb-4">
                <label className="text-xs text-muted-silver mb-1 block">Tu intención</label>
                <textarea value={intention} onChange={(e) => setIntention(e.target.value)} rows={3} placeholder="Describe lo que buscas con este ritual..." className="w-full bg-black/30 border border-carbon rounded-lg px-3 py-2 text-sm text-silver placeholder:text-muted-silver focus:outline-none focus:border-white/20 resize-none" />
              </div>
              <p className="text-base font-heading text-gold mb-4">${selected.price}</p>
              <button onClick={submit} disabled={submitting || !intention.trim()} className="w-full py-2.5 rounded-lg bg-white/5 border border-white/20 text-gold font-heading text-xs tracking-wider hover:bg-white/10 disabled:opacity-30 transition-colors">Solicitar Ritual</button>
            </div>
          </div>
        )}

        {done && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setDone(false)} />
            <div className="relative glass-card rounded-2xl p-8 w-full max-w-sm text-center animate-scale-in">
              <Check size={32} strokeWidth={1.5} className="text-gold mx-auto mb-4" />
              <p className="text-sm font-heading text-silver">Solicitud enviada</p>
              <p className="text-xs text-muted-silver mt-2">Recibirás tu ritual por email y en tu perfil.</p>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}