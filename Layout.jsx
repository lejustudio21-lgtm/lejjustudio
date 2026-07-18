import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useLang } from '@/lib/LanguageContext';
import SelloIcon from './SelloIcon';
import {
  Home, Radio, Headphones, Mic, BookOpen, Users, Hash,
  Sparkles, FlaskConical, GraduationCap, Video, ShoppingBag,
  Info, Mail, User, Settings, Menu, X, Globe, LogOut, ChevronRight
} from 'lucide-react';

const LOGO_URL = 'https://media.base44.com/images/public/user_6a490d244e51c397a0df34fb/067115bd0_lejju.jpg';

export default function Layout({ children }) {
  const { lang, setLang, t } = useLang();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { path: '/', label: t('nav.home'), icon: Home },
    { path: '/frecuencias', label: t('nav.frecuencias'), icon: Radio },
    { path: '/meditaciones', label: t('nav.meditaciones'), icon: Headphones },
    { path: '/podcasts', label: t('nav.podcasts'), icon: Mic },
    { path: '/raices', label: t('nav.raices'), icon: BookOpen },
    { path: '/comunidad', label: t('nav.comunidad'), icon: Users },
    { path: '/numerologia', label: t('nav.numerologia'), icon: Hash },
    { path: '/rituales', label: t('nav.rituales'), icon: Sparkles },
    { path: '/cursos', label: t('nav.cursos'), icon: GraduationCap },
    { path: '/videoconferencias', label: t('nav.videoconferencias'), icon: Video },
    { path: '/tienda', label: t('nav.tienda'), icon: ShoppingBag },
    { path: '/sobre', label: t('nav.sobre'), icon: Info },
    { path: '/contacto', label: t('nav.contacto'), icon: Mail },
  ];

  const handleLogout = async () => {
    await base44.auth.logout('/');
  };

  const NavLink = ({ item }) => {
    const isActive = location.pathname === item.path;
    return (
      <Link
        to={item.path}
        onClick={() => setMobileOpen(false)}
        className={`capsule-nav flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-heading font-light transition-all ${
          isActive ? 'bg-white/5 text-gold' : 'text-muted-silver hover:text-silver hover:bg-white/[0.03]'
        }`}
      >
        <item.icon size={16} strokeWidth={1.5} />
        <span>{item.label}</span>
      </Link>
    );
  };

  const openMantra = () => window.dispatchEvent(new Event('leju-open-mantra'));

  return (
    <div className="min-h-screen flex bg-carbon">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 fixed inset-y-0 left-0 border-r border-carbon bg-black/40 backdrop-blur-xl z-40">
        <div className="p-6 flex flex-col items-center">
          <img src={LOGO_URL} alt="LEJJU" className="w-14 h-14 rounded-full object-cover ring-1 ring-white/10" />
          <span className="mt-2 text-sm font-heading font-semibold tracking-[0.3em] text-silver">LEJJU</span>
          <span className="text-[0.6rem] font-heading tracking-[0.3em] text-muted-silver">STUDIO</span>
        </div>
        <button
          onClick={openMantra}
          className="mx-3 mb-2 px-4 py-2.5 rounded-lg text-xs font-heading tracking-wider bg-white/[0.03] border border-carbon text-gold hover:bg-white/5 hover:border-white/20 transition-all flex items-center gap-2"
        >
          <span className="w-2 h-2 rounded-full bg-gold animate-pulse-glow" />
          Espacio del Mantra
        </button>
        <nav className="flex-1 px-3 overflow-y-auto space-y-0.5 pb-4">
          {navItems.map((item) => <NavLink key={item.path} item={item} />)}
        </nav>
        <div className="px-3 py-4 border-t border-carbon space-y-1">
          <Link to="/perfil" className="capsule-nav flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-muted-silver hover:text-silver hover:bg-white/[0.03]">
            <User size={16} strokeWidth={1.5} />
            <span>{t('nav.perfil')}</span>
          </Link>
          <Link to="/admin" className="capsule-nav flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-muted-silver hover:text-silver hover:bg-white/[0.03]">
            <Settings size={16} strokeWidth={1.5} />
            <span>{t('nav.admin')}</span>
          </Link>
          <button onClick={() => setLang(lang === 'es' ? 'en' : 'es')} className="capsule-nav w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-muted-silver hover:text-silver hover:bg-white/[0.03]">
            <Globe size={16} strokeWidth={1.5} />
            <span>{lang === 'es' ? 'English' : 'Español'}</span>
          </button>
          <button onClick={handleLogout} className="capsule-nav w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-muted-silver hover:text-silver hover:bg-white/[0.03]">
            <LogOut size={16} strokeWidth={1.5} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-50 bg-black/80 backdrop-blur-xl border-b border-carbon">
        <div className="flex items-center justify-between px-4 h-16">
          <Link to="/" className="flex items-center gap-2">
            <img src={LOGO_URL} alt="LEJJU" className="w-8 h-8 rounded-full object-cover ring-1 ring-white/10" />
            <span className="text-xs font-heading font-semibold tracking-[0.25em] text-silver">LEJJU STUDIO</span>
          </Link>
          <button onClick={() => setMobileOpen(true)} className="text-silver p-2">
            <Menu size={22} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="relative w-72 max-w-[80vw] bg-card-dark border-r border-carbon flex flex-col animate-fade-in">
            <div className="p-4 flex items-center justify-between border-b border-carbon">
              <img src={LOGO_URL} alt="LEJJU" className="w-10 h-10 rounded-full object-cover ring-1 ring-white/10" />
              <button onClick={() => setMobileOpen(false)} className="text-silver p-2">
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>
            <nav className="flex-1 px-3 overflow-y-auto py-4 space-y-0.5">
              <button
                onClick={() => { setMobileOpen(false); window.dispatchEvent(new Event('leju-open-mantra')); }}
                className="w-full mb-2 px-4 py-2.5 rounded-lg text-xs font-heading tracking-wider bg-white/[0.03] border border-carbon text-gold hover:bg-white/5 transition-all flex items-center gap-2"
              >
                <span className="w-2 h-2 rounded-full bg-gold animate-pulse-glow" />
                Espacio del Mantra
              </button>
              {navItems.map((item) => <NavLink key={item.path} item={item} />)}
              <Link to="/perfil" onClick={() => setMobileOpen(false)} className="capsule-nav flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-muted-silver hover:text-silver">
                <User size={16} strokeWidth={1.5} />
                <span>{t('nav.perfil')}</span>
              </Link>
              <Link to="/admin" onClick={() => setMobileOpen(false)} className="capsule-nav flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-muted-silver hover:text-silver">
                <Settings size={16} strokeWidth={1.5} />
                <span>{t('nav.admin')}</span>
              </Link>
              <button onClick={() => setLang(lang === 'es' ? 'en' : 'es')} className="capsule-nav w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-muted-silver hover:text-silver">
                <Globe size={16} strokeWidth={1.5} />
                <span>{lang === 'es' ? 'English' : 'Español'}</span>
              </button>
              <button onClick={handleLogout} className="capsule-nav w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-muted-silver hover:text-silver">
                <LogOut size={16} strokeWidth={1.5} />
                <span>Logout</span>
              </button>
            </nav>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 pt-16 lg:pt-0 min-h-screen">
        {children}
      </main>
    </div>
  );
}