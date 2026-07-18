import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { IMAGES } from '@/lib/images';
import AppShell from '@/components/AppShell';
import { useLang } from '@/lib/LanguageContext';
import { Settings, BarChart3, FlaskConical, MessageSquare, Users, Bell } from 'lucide-react';
import AdminStats from '@/components/admin/AdminStats';
import AdminServices from '@/components/admin/AdminServices';
import AdminCommunity from '@/components/admin/AdminCommunity';

export default function Admin() {
  const { t } = useLang();
  const [tab, setTab] = useState('overview');
  const [orders, setOrders] = useState([]);
  const [services, setServices] = useState([]);
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [ord, srv, usr, pst, msg] = await Promise.all([
          base44.entities.Order.list('-created_date', 100).catch(() => []),
          base44.entities.ServiceRequest.list('-created_date', 100).catch(() => []),
          base44.entities.User.list('-created_date', 100).catch(() => []),
          base44.entities.ForumPost.list('-created_date', 30).catch(() => []),
          base44.entities.ChatMessage.list('-created_date', 30).catch(() => []),
        ]);
        setOrders(ord || []);
        setServices(srv || []);
        setUsers(usr || []);
        setPosts(pst || []);
        setMessages(msg || []);
      } catch {}
      setLoading(false);
    };
    load();
  }, []);

  const tabs = [
    { key: 'overview', label: 'Resumen', icon: BarChart3 },
    { key: 'services', label: 'Servicios', icon: FlaskConical, badge: services.filter((s) => s.status === 'pendiente').length },
    { key: 'community', label: 'Comunidad', icon: MessageSquare },
    { key: 'users', label: 'Usuarios', icon: Users },
  ];

  return (
    <AppShell>
      <div className="min-h-screen">
        <div className="relative h-48 overflow-hidden">
          <img src={IMAGES.diamondSacred} alt="" className="absolute inset-0 w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-carbon" />
          <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
            <div className="flex items-center gap-2">
              <Settings size={28} strokeWidth={1} className="text-gold mb-3" />
              <Bell size={14} strokeWidth={1.5} className="text-gold/60 mb-3 animate-pulse" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-heading font-light tracking-wide text-gold text-glow-gold">{t('nav.admin')}</h1>
            <p className="text-xs text-muted-silver mt-1 font-body italic">Panel de control privado</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-12">
          {/* Tabs */}
          <div className="flex justify-center gap-2 mb-8 flex-wrap">
            {tabs.map((tb) => (
              <button
                key={tb.key}
                onClick={() => setTab(tb.key)}
                className={`px-3 py-1.5 rounded-full text-xs font-heading tracking-wider transition-all flex items-center gap-1.5 ${tab === tb.key ? 'bg-white/5 text-gold border border-white/20' : 'text-muted-silver border border-carbon hover:text-silver'}`}
              >
                <tb.icon size={13} strokeWidth={1.5} />
                {tb.label}
                {tb.badge > 0 && <span className="ml-1 bg-gold/20 text-gold text-[0.6rem] px-1.5 py-0.5 rounded-full">{tb.badge}</span>}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-white/10 border-t-gold rounded-full animate-spin" /></div>
          ) : tab === 'overview' ? (
            <AdminStats users={users} orders={orders} services={services} posts={posts} messages={messages} />
          ) : tab === 'services' ? (
            <AdminServices initialServices={services} />
          ) : tab === 'community' ? (
            <AdminCommunity />
          ) : tab === 'users' ? (
            <div className="space-y-2">
              {users.map((usr) => (
                <div key={usr.id} className="glass-card rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/5 border border-carbon flex items-center justify-center text-gold text-xs font-heading">
                      {(usr.full_name || usr.email || '?')[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm text-silver">{usr.full_name || usr.email}</p>
                      <p className="text-xs text-muted-silver">{usr.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-[0.65rem] px-1.5 py-0.5 rounded-full ${usr.role === 'admin' ? 'bg-gold/10 text-gold' : 'bg-white/5 text-muted-silver'}`}>{usr.role}</span>
                    <p className="text-[0.6rem] text-muted-silver mt-1">{new Date(usr.created_date).toLocaleDateString('es-UY')}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </AppShell>
  );
}