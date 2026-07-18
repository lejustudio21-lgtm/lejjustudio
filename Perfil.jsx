import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { IMAGES } from '@/lib/images';
import AppShell from '@/components/AppShell';
import { useLang } from '@/lib/LanguageContext';
import { User, Calendar, ShoppingBag, Sparkles, Settings, Check } from 'lucide-react';

export default function Perfil() {
  const { t, lang, setLang } = useLang();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const me = await base44.auth.me();
        setUser(me);
        const [ord, srv] = await Promise.all([
          base44.entities.Order.filter({ user_id: me.id }, '-created_date', 20).catch(() => []),
          base44.entities.ServiceRequest.filter({ user_id: me.id }, '-created_date', 20).catch(() => []),
        ]);
        setOrders(ord || []);
        setServices(srv || []);
      } catch {}
      setLoading(false);
    };
    load();
  }, []);

  if (loading) {
    return (
      <AppShell>
        <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-white/10 border-t-gold rounded-full animate-spin" /></div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="min-h-screen">
        <div className="relative h-48 overflow-hidden">
          <img src={IMAGES.diamondCentered} alt="" className="absolute inset-0 w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-carbon" />
          <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
            <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gold mb-2">
              <User size={24} strokeWidth={1} />
            </div>
            <h1 className="text-xl font-heading font-light text-silver">{user?.full_name || user?.email}</h1>
            <p className="text-xs text-muted-silver mt-1">{user?.email}</p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-6 py-12 space-y-8">
          {/* Sello info */}
          <div className="glass-card rounded-2xl p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gold/5 border border-gold/20 flex items-center justify-center text-gold">
              <Check size={20} strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-sm font-heading text-silver">{t('sello.signed')}</p>
              <p className="text-xs text-muted-silver mt-0.5 flex items-center gap-1">
                <Calendar size={11} strokeWidth={1.5} />
                {user?.sovereignty_signed_date ? new Date(user.sovereignty_signed_date).toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'}
              </p>
            </div>
          </div>

          {/* Settings */}
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Settings size={16} strokeWidth={1.5} className="text-gold" />
              <h2 className="text-sm font-heading text-silver tracking-wide">Ajustes</h2>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-silver">Idioma</span>
              <button onClick={() => setLang(lang === 'es' ? 'en' : 'es')} className="px-3 py-1.5 rounded-full bg-white/5 border border-carbon text-xs text-silver hover:text-gold hover:border-white/20 transition-colors">
                {lang === 'es' ? 'Español' : 'English'}
              </button>
            </div>
          </div>

          {/* Orders */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <ShoppingBag size={16} strokeWidth={1.5} className="text-gold" />
              <h2 className="text-sm font-heading text-silver tracking-wide">Mis Compras</h2>
            </div>
            {orders.length === 0 ? (
              <p className="text-center text-muted-silver text-sm py-6">Sin compras aún</p>
            ) : (
              <div className="space-y-2">
                {orders.map((ord) => (
                  <div key={ord.id} className="glass-card rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-silver">{new Date(ord.created_date).toLocaleDateString()}</p>
                      <p className="text-sm text-silver mt-0.5">{ord.items?.length || 0} artículo(s)</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-heading text-gold">${ord.total}</p>
                      <span className={`text-[0.65rem] px-1.5 py-0.5 rounded-full ${ord.status === 'entregado' ? 'bg-green-500/10 text-green-400' : 'bg-white/5 text-muted-silver'}`}>{ord.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Services */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={16} strokeWidth={1.5} className="text-gold" />
              <h2 className="text-sm font-heading text-silver tracking-wide">Mis Servicios</h2>
            </div>
            {services.length === 0 ? (
              <p className="text-center text-muted-silver text-sm py-6">Sin servicios solicitados</p>
            ) : (
              <div className="space-y-2">
                {services.map((srv) => (
                  <div key={srv.id} className="glass-card rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gold font-heading tracking-wider uppercase">{srv.service_type}</span>
                      <span className={`text-[0.65rem] px-1.5 py-0.5 rounded-full ${srv.status === 'entregado' ? 'bg-green-500/10 text-green-400' : 'bg-white/5 text-muted-silver'}`}>{srv.status}</span>
                    </div>
                    <p className="text-xs text-muted-silver">{new Date(srv.created_date).toLocaleDateString()}</p>
                    {srv.result && <p className="text-sm text-silver/70 mt-2 leading-relaxed font-body whitespace-pre-line">{srv.result}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}