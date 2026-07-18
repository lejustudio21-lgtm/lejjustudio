import React from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '@/lib/LanguageContext';
import { IMAGES } from '@/lib/images';
import AppShell from '@/components/AppShell';
import {
  Radio, Headphones, Mic, BookOpen, Users, Hash,
  Sparkles, GraduationCap, Video, ShoppingBag, Info, ChevronRight
} from 'lucide-react';

export default function Home() {
  const { t } = useLang();

  const sections = [
    { path: '/frecuencias', label: t('nav.frecuencias'), desc: 'Sonido y chakras', icon: Radio, img: IMAGES.diamondSacred },
    { path: '/meditaciones', label: t('nav.meditaciones'), desc: 'Sanación interior', icon: Headphones, img: IMAGES.diamondShards },
    { path: '/podcasts', label: t('nav.podcasts'), desc: 'Voces y conversaciones', icon: Mic, img: IMAGES.diamondChrome },
    { path: '/raices', label: t('nav.raices'), desc: 'Historia y cultura', icon: BookOpen, img: IMAGES.diamondShards2 },
    { path: '/comunidad', label: t('nav.comunidad'), desc: 'Foro y chat', icon: Users, img: IMAGES.diamondCentered },
    { path: '/numerologia', label: t('nav.numerologia'), desc: 'Tu número de vida', icon: Hash, img: IMAGES.diamondPure },
    { path: '/rituales', label: t('nav.rituales'), desc: 'Práctica sagrada', icon: Sparkles, img: IMAGES.diamondGrid },
    { path: '/cursos', label: t('nav.cursos'), desc: 'Aprendizaje profundo', icon: GraduationCap, img: IMAGES.heroExplosion2 },
    { path: '/videoconferencias', label: t('nav.videoconferencias'), desc: 'Sesiones en vivo', icon: Video, img: IMAGES.diamondCentered },
    { path: '/tienda', label: t('nav.tienda'), desc: 'Geometría sagrada', icon: ShoppingBag, img: IMAGES.diamondPure },
    { path: '/sobre', label: t('nav.sobre'), desc: 'Misión y visión', icon: Info, img: IMAGES.diamondChrome },
    { path: '/contacto', label: t('nav.contacto'), desc: 'Conecta con LEJJU', icon: ChevronRight, img: IMAGES.diamondSacred },
  ];

  return (
    <AppShell>
      <div className="min-h-screen">
        {/* Hero */}
        <div className="relative h-[50vh] min-h-[400px] overflow-hidden">
          <img src={IMAGES.heroExplosion} alt="" className="absolute inset-0 w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-carbon" />
          <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
            <img src={IMAGES.diamondCentered} alt="Sello LEJJU" className="w-20 h-20 rounded-full object-cover ring-1 ring-white/10 animate-float mb-6" />
            <h1 className="text-3xl sm:text-5xl font-heading font-light tracking-[0.1em] text-silver text-glow-gold">LEJJU STUDIO</h1>
            <p className="mt-3 text-base text-gold font-heading font-light tracking-wide">Del ruido a la claridad</p>
            <p className="mt-1 text-sm font-body italic text-muted-silver">Donde la forma despierta la conciencia</p>
          </div>
        </div>

        {/* Grid */}
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {sections.map((section, i) => (
              <Link
                key={section.path}
                to={section.path}
                className="group relative aspect-square rounded-2xl overflow-hidden glass-card glass-card-hover animate-fade-in-up"
                style={{ animationDelay: `${i * 0.05}s`, opacity: 0 }}
              >
                <img src={section.img} alt="" className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="relative h-full flex flex-col items-center justify-end p-5 text-center">
                  <section.icon size={24} strokeWidth={1} className="text-gold mb-2 opacity-80 group-hover:opacity-100 transition-opacity" />
                  <p className="text-sm font-heading font-medium text-silver tracking-wide">{section.label}</p>
                  <p className="text-xs text-muted-silver mt-0.5">{section.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}