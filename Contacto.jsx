import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { IMAGES } from '@/lib/images';
import AppShell from '@/components/AppShell';
import { useLang } from '@/lib/LanguageContext';
import { Mail, MessageCircle, Send, Instagram, Youtube, Facebook, Check } from 'lucide-react';

export default function Contacto() {
  const { t } = useLang();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async () => {
    if (!name.trim() || !email.trim() || !message.trim()) return;
    setSending(true);
    try {
      await base44.integrations.Core.SendEmail({
        to: 'lejustudio2@gmail.com',
        subject: `Mensaje de ${name} — LEJJU Studio`,
        body: `Nombre: ${name}\nEmail: ${email}\n\n${message}`,
      });
      setSent(true);
      setName(''); setEmail(''); setMessage('');
    } catch {}
    setSending(false);
  };

  return (
    <AppShell>
      <div className="min-h-screen">
        <div className="relative h-56 overflow-hidden">
          <img src={IMAGES.diamondSacred} alt="" className="absolute inset-0 w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-carbon" />
          <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
            <Mail size={28} strokeWidth={1} className="text-gold mb-3" />
            <h1 className="text-3xl sm:text-4xl font-heading font-light tracking-wide text-gold text-glow-gold">{t('nav.contacto')}</h1>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Form */}
            <div className="glass-card rounded-2xl p-6">
              <h2 className="text-sm font-heading text-silver mb-4 tracking-wide">Envía un mensaje</h2>
              {sent ? (
                <div className="text-center py-8">
                  <Check size={28} strokeWidth={1.5} className="text-gold mx-auto mb-3" />
                  <p className="text-sm text-silver">Mensaje enviado</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nombre" className="w-full bg-black/30 border border-carbon rounded-lg px-3 py-2 text-sm text-silver placeholder:text-muted-silver focus:outline-none focus:border-white/20" />
                  <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" type="email" className="w-full bg-black/30 border border-carbon rounded-lg px-3 py-2 text-sm text-silver placeholder:text-muted-silver focus:outline-none focus:border-white/20" />
                  <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Tu mensaje..." rows={4} className="w-full bg-black/30 border border-carbon rounded-lg px-3 py-2 text-sm text-silver placeholder:text-muted-silver focus:outline-none focus:border-white/20 resize-none" />
                  <button onClick={submit} disabled={sending || !name.trim() || !email.trim() || !message.trim()} className="w-full py-2.5 rounded-lg bg-white/5 border border-white/20 text-gold font-heading text-xs tracking-wider hover:bg-white/10 disabled:opacity-30 transition-colors">{sending ? '...' : t('common.submit')}</button>
                </div>
              )}
            </div>

            {/* Contact info */}
            <div className="space-y-4">
              <a href="mailto:lejustudio2@gmail.com" className="glass-card glass-card-hover rounded-2xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/5 border border-carbon flex items-center justify-center text-gold"><Mail size={16} strokeWidth={1.5} /></div>
                <div>
                  <p className="text-xs text-muted-silver">Email</p>
                  <p className="text-sm text-silver">lejustudio2@gmail.com</p>
                </div>
              </a>
              <a href="https://wa.me/598293823368" target="_blank" rel="noreferrer" className="glass-card glass-card-hover rounded-2xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/5 border border-carbon flex items-center justify-center text-gold"><MessageCircle size={16} strokeWidth={1.5} /></div>
                <div>
                  <p className="text-xs text-muted-silver">WhatsApp</p>
                  <p className="text-sm text-silver">+598 293 823 368</p>
                </div>
              </a>
              <a href="https://www.instagram.com/lejju.studio/" target="_blank" rel="noreferrer" className="glass-card glass-card-hover rounded-2xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/5 border border-carbon flex items-center justify-center text-gold"><Instagram size={16} strokeWidth={1.5} /></div>
                <div>
                  <p className="text-xs text-muted-silver">Instagram</p>
                  <p className="text-sm text-silver">@lejju.studio</p>
                </div>
              </a>
              <a href="https://t.me/Sunegga" target="_blank" rel="noreferrer" className="glass-card glass-card-hover rounded-2xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/5 border border-carbon flex items-center justify-center text-gold"><Send size={16} strokeWidth={1.5} /></div>
                <div>
                  <p className="text-xs text-muted-silver">Telegram</p>
                  <p className="text-sm text-silver">t.me/Sunegga</p>
                </div>
              </a>
              <a href="https://www.youtube.com/@lejustudio" target="_blank" rel="noreferrer" className="glass-card glass-card-hover rounded-2xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/5 border border-carbon flex items-center justify-center text-gold"><Youtube size={16} strokeWidth={1.5} /></div>
                <div>
                  <p className="text-xs text-muted-silver">YouTube</p>
                  <p className="text-sm text-silver">@lejustudio</p>
                </div>
              </a>
              <a href="https://www.facebook.com/profile.php?id=61585894630982" target="_blank" rel="noreferrer" className="glass-card glass-card-hover rounded-2xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/5 border border-carbon flex items-center justify-center text-gold"><Facebook size={16} strokeWidth={1.5} /></div>
                <div>
                  <p className="text-xs text-muted-silver">Facebook</p>
                  <p className="text-sm text-silver">LEJJU Studio</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}