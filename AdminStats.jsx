import React from 'react';
import { Users, Package, FlaskConical, Check, DollarSign, MessageSquare, Activity, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, CartesianGrid } from 'recharts';

const CHAKRA_COLORS = ['#EF4444', '#F97316', '#EAB308', '#22C55E', '#3B82F6', '#6366F1', '#FFFFFF'];

export default function AdminStats({ users, orders, services, posts, messages }) {
  const revenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const pendingServices = services.filter((s) => s.status === 'pendiente').length;
  const signedUsers = users.filter((u) => u.sovereignty_signed_date).length;

  const stats = [
    { label: 'Usuarios', value: users.length, icon: Users, sub: `${signedUsers} sellos firmados` },
    { label: 'Pedidos', value: orders.length, icon: Package, sub: `U$S ${revenue.toFixed(2)} totales` },
    { label: 'Servicios', value: services.length, icon: FlaskConical, sub: `${pendingServices} pendientes` },
    { label: 'Mensajes', value: messages.length, icon: MessageSquare, sub: `${posts.length} posts foro` },
  ];

  // Services by type
  const serviceTypes = ['numerologia', 'ritual'].map((type, i) => ({
    name: type,
    value: services.filter((s) => s.service_type === type).length,
    color: CHAKRA_COLORS[i],
  }));

  // Orders by status
  const orderStatuses = ['pendiente', 'pagado', 'enviado', 'entregado'].map((status) => ({
    name: status,
    cantidad: orders.filter((o) => o.status === status).length,
  }));

  // Users registered last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dayStr = d.toLocaleDateString('es-UY', { weekday: 'short', day: 'numeric' });
    const dayStart = new Date(d);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(d);
    dayEnd.setHours(23, 59, 59, 999);
    const count = users.filter((u) => {
      const cd = new Date(u.created_date);
      return cd >= dayStart && cd <= dayEnd;
    }).length;
    return { name: dayStr, usuarios: count };
  });

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="glass-card rounded-2xl p-5 relative overflow-hidden">
            <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-gold/5 blur-2xl" />
            <div className="relative z-10">
              <stat.icon size={18} strokeWidth={1} className="text-gold mb-2" />
              <p className="text-2xl font-heading font-light text-silver">{stat.value}</p>
              <p className="text-xs text-muted-silver mt-0.5">{stat.label}</p>
              <p className="text-[0.6rem] text-gold/50 mt-1">{stat.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Orders by status */}
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={14} strokeWidth={1.5} className="text-gold" />
            <p className="text-xs font-heading tracking-widest text-gold/70 uppercase">Pedidos por estado</p>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={orderStatuses} margin={{ top: 5, right: 5, bottom: 5, left: -25 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 6% 14%)" />
              <XAxis dataKey="name" tick={{ fill: 'hsl(220 10% 52%)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'hsl(220 10% 52%)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip cursor={{ fill: 'hsl(240 6% 14% / 0.3)' }} contentStyle={{ background: 'hsl(240 6% 8%)', border: '1px solid hsl(240 6% 14%)', borderRadius: 8, fontSize: 11 }} />
              <Bar dataKey="cantidad" fill="hsl(42 55% 82%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Services by type */}
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Activity size={14} strokeWidth={1.5} className="text-gold" />
            <p className="text-xs font-heading tracking-widest text-gold/70 uppercase">Servicios por tipo</p>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={serviceTypes} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={3}>
                {serviceTypes.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: 'hsl(240 6% 8%)', border: '1px solid hsl(240 6% 14%)', borderRadius: 8, fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-2">
            {serviceTypes.map((s, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: s.color }} />
                <span className="text-[0.65rem] text-muted-silver capitalize">{s.name} ({s.value})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Users last 7 days */}
      <div className="glass-card rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Users size={14} strokeWidth={1.5} className="text-gold" />
          <p className="text-xs font-heading tracking-widest text-gold/70 uppercase">Nuevos usuarios (7 días)</p>
        </div>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={last7Days} margin={{ top: 5, right: 5, bottom: 5, left: -25 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 6% 14%)" />
            <XAxis dataKey="name" tick={{ fill: 'hsl(220 10% 52%)', fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'hsl(220 10% 52%)', fontSize: 10 }} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip cursor={{ fill: 'hsl(240 6% 14% / 0.3)' }} contentStyle={{ background: 'hsl(240 6% 8%)', border: '1px solid hsl(240 6% 14%)', borderRadius: 8, fontSize: 11 }} />
            <Bar dataKey="usuarios" fill="hsl(42 50% 78%)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}