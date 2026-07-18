import React, { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { useNotificationSound } from '@/hooks/useNotificationSound';
import { Send, Bell, Clock, Check, DollarSign, AlertCircle, X } from 'lucide-react';

const ADMIN_EMAIL = 'lejustudio2@gmail.com';

export default function AdminServices({ initialServices }) {
  const [services, setServices] = useState(initialServices);
  const [newRequests, setNewRequests] = useState([]);
  const [notification, setNotification] = useState(null);
  const knownIdsRef = useRef(new Set((initialServices || []).map((s) => s.id)));
  const { playChime } = useNotificationSound();

  useEffect(() => {
    setServices(initialServices);
    knownIdsRef.current = new Set((initialServices || []).map((s) => s.id));
  }, [initialServices]);

  // Real-time subscription
  useEffect(() => {
    const unsubscribe = base44.entities.ServiceRequest.subscribe((event) => {
      if (event.type === 'create' && event.data) {
        const newReq = event.data;
        if (!knownIdsRef.current.has(newReq.id)) {
          knownIdsRef.current.add(newReq.id);
          setServices((s) => [newReq, ...s]);
          setNewRequests((n) => [newReq, ...n]);
          playChime();
          setNotification(newReq);
          setTimeout(() => setNotification(null), 8000);
        }
      }
    });
    return () => unsubscribe();
  }, [playChime]);

  const deliverService = async (srv) => {
    const result = window.prompt('Ingresa el resultado del servicio (se enviará por email y al perfil del usuario):');
    if (!result) return;
    try {
      await base44.entities.ServiceRequest.update(srv.id, {
        status: 'entregado',
        result,
        delivered_date: new Date().toISOString(),
      });
      await base44.integrations.Core.SendEmail({
        to: srv.user_email,
        subject: `Tu servicio LEJJU Studio — ${srv.service_type}`,
        body: result,
      });
      setServices((s) => s.map((x) => (x.id === srv.id ? { ...x, status: 'entregado', result, delivered_date: new Date().toISOString() } : x)));
    } catch {}
  };

  const pending = services.filter((s) => s.status === 'pendiente');
  const delivered = services.filter((s) => s.status === 'entregado');
  const totalRevenue = services.reduce((sum, s) => sum + (s.price || 0), 0);

  return (
    <div className="space-y-4">
      {/* Real-time notification banner */}
      {notification && (
        <div className="fixed top-4 right-4 z-[70] glass-card rounded-2xl p-4 w-80 animate-scale-in glow-gold border-gold/30">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center flex-shrink-0">
              <Bell size={18} strokeWidth={1.5} className="text-gold animate-pulse" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-heading text-gold tracking-wide">Nueva solicitud de servicio</p>
              <p className="text-sm text-silver mt-1 truncate">{notification.user_name}</p>
              <p className="text-[0.65rem] text-muted-silver capitalize">{notification.service_type} — U$S {notification.price}</p>
              {notification.form_data?.intention && (
                <p className="text-[0.65rem] text-silver/50 mt-1 line-clamp-2">{notification.form_data.intention}</p>
              )}
            </div>
            <button onClick={() => setNotification(null)} className="text-muted-silver hover:text-silver">
              <X size={14} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      )}

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="glass-card rounded-xl p-4 text-center">
          <Clock size={16} strokeWidth={1} className="text-orange-400 mx-auto mb-1" />
          <p className="text-xl font-heading text-silver">{pending.length}</p>
          <p className="text-[0.6rem] text-muted-silver">Pendientes</p>
        </div>
        <div className="glass-card rounded-xl p-4 text-center">
          <Check size={16} strokeWidth={1} className="text-green-400 mx-auto mb-1" />
          <p className="text-xl font-heading text-silver">{delivered.length}</p>
          <p className="text-[0.6rem] text-muted-silver">Entregados</p>
        </div>
        <div className="glass-card rounded-xl p-4 text-center">
          <DollarSign size={16} strokeWidth={1} className="text-gold mx-auto mb-1" />
          <p className="text-xl font-heading text-silver">{totalRevenue.toFixed(0)}</p>
          <p className="text-[0.6rem] text-muted-silver">U$S Total</p>
        </div>
      </div>

      {/* New requests alert */}
      {newRequests.length > 0 && (
        <div className="glass-card rounded-xl p-3 border-gold/20 flex items-center gap-2">
          <AlertCircle size={14} strokeWidth={1.5} className="text-gold flex-shrink-0" />
          <p className="text-xs text-gold">{newRequests.length} nueva(s) solicitud(es) recibida(s) en tiempo real</p>
          <button onClick={() => setNewRequests([])} className="ml-auto text-[0.65rem] text-muted-silver hover:text-silver">Limpiar</button>
        </div>
      )}

      {/* Service list */}
      {services.length === 0 ? (
        <p className="text-center text-muted-silver text-sm py-10">Sin solicitudes</p>
      ) : (
        <div className="space-y-3">
          {services.map((srv) => {
            const isNew = newRequests.some((n) => n.id === srv.id);
            return (
              <div key={srv.id} className={`glass-card rounded-xl p-4 ${isNew ? 'border-gold/30 glow-soft' : ''}`}>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="text-xs text-gold font-heading tracking-wider uppercase">{srv.service_type}</span>
                    {isNew && <span className="ml-2 text-[0.6rem] text-gold bg-gold/10 px-1.5 py-0.5 rounded-full">NUEVA</span>}
                    <p className="text-xs text-muted-silver mt-0.5">{srv.user_name} — {srv.user_email}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-heading text-gold">U$S {srv.price}</p>
                    <span className={`text-[0.65rem] px-2 py-1 rounded-full ${srv.status === 'entregado' ? 'bg-green-500/10 text-green-400' : 'bg-orange-500/10 text-orange-400'}`}>
                      {srv.status}
                    </span>
                  </div>
                </div>
                {srv.form_data?.intention && <p className="text-xs text-silver/60 bg-black/20 rounded p-2 mt-2">{srv.form_data.intention}</p>}
                {srv.form_data?.birth_date && <p className="text-[0.65rem] text-muted-silver mt-1">Nacimiento: {srv.form_data.birth_date}</p>}
                {srv.status === 'pendiente' && (
                  <button onClick={() => deliverService(srv)} className="mt-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/20 text-xs text-gold font-heading hover:bg-white/10 transition-colors">
                    <Send size={12} strokeWidth={1.5} /> Entregar servicio
                  </button>
                )}
                {srv.result && <p className="text-xs text-silver/70 mt-2 leading-relaxed font-body whitespace-pre-line border-t border-carbon pt-2">{srv.result}</p>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}