import React from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '@/lib/LanguageContext';
import { Instagram, Youtube, Facebook, Mail, MessageCircle, Send } from 'lucide-react';

const LOGO_URL = 'https://media.base44.com/images/public/user_6a490d244e51c397a0df34fb/067115bd0_lejju.jpg';

export default function Footer() {
  const { t } = useLang();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-carbon bg-black/60 mt-20">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-3 gap-10">
          <div className="flex flex-col items-center md:items-start">
            <img src={LOGO_URL} alt="LEJJU Studio" className="w-12 h-12 rounded-full object-cover ring-1 ring-white/10 mb-3" />
            <p className="text-xs font-heading tracking-[0.3em] text-silver font-semibold">LEJJU STUDIO</p>
            <p className="text-xs text-muted-silver mt-2 font-body italic">Del ruido a la claridad</p>
          </div>
          <div className="text-center md:text-left">
            <p className="text-xs font-heading tracking-widest text-muted-silver uppercase mb-4">{t('footer.ecosystem')}</p>
            <div className="flex flex-wrap gap-x-4 gap-y-2 justify-center md:justify-start">
              <Link to="/" className="text-xs text-muted-silver hover:text-gold transition-colors">{t('nav.home')}</Link>
              <Link to="/frecuencias" className="text-xs text-muted-silver hover:text-gold transition-colors">{t('nav.frecuencias')}</Link>
              <Link to="/comunidad" className="text-xs text-muted-silver hover:text-gold transition-colors">{t('nav.comunidad')}</Link>
              <Link to="/tienda" className="text-xs text-muted-silver hover:text-gold transition-colors">{t('nav.tienda')}</Link>
              <Link to="/sobre" className="text-xs text-muted-silver hover:text-gold transition-colors">{t('nav.sobre')}</Link>
            </div>
          </div>
          <div className="text-center md:text-right">
            <p className="text-xs font-heading tracking-widest text-muted-silver uppercase mb-4">Contacto</p>
            <div className="flex justify-center md:justify-end gap-3">
              <a href="https://www.instagram.com/lejju.studio/" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full border border-carbon flex items-center justify-center text-muted-silver hover:text-gold hover:border-white/20 transition-colors">
                <Instagram size={14} strokeWidth={1.5} />
              </a>
              <a href="https://www.youtube.com/@lejustudio" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full border border-carbon flex items-center justify-center text-muted-silver hover:text-gold hover:border-white/20 transition-colors">
                <Youtube size={14} strokeWidth={1.5} />
              </a>
              <a href="https://www.facebook.com/profile.php?id=61585894630982" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full border border-carbon flex items-center justify-center text-muted-silver hover:text-gold hover:border-white/20 transition-colors">
                <Facebook size={14} strokeWidth={1.5} />
              </a>
              <a href="https://t.me/Sunegga" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full border border-carbon flex items-center justify-center text-muted-silver hover:text-gold hover:border-white/20 transition-colors">
                <Send size={14} strokeWidth={1.5} />
              </a>
              <a href="mailto:lejustudio2@gmail.com" className="w-8 h-8 rounded-full border border-carbon flex items-center justify-center text-muted-silver hover:text-gold hover:border-white/20 transition-colors">
                <Mail size={14} strokeWidth={1.5} />
              </a>
            </div>
            <p className="text-xs text-muted-silver mt-3">lejustudio2@gmail.com</p>
            <p className="text-xs text-muted-silver">WhatsApp: +598 293 823 368</p>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-carbon text-center">
          <p className="text-[0.65rem] text-muted-silver tracking-wider">© {year} LEJJU Studio. {t('footer.rights')}.</p>
        </div>
      </div>
    </footer>
  );
}