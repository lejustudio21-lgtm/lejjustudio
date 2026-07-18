import React, { useState, useRef, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useLang } from '@/lib/LanguageContext';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';

const LOGO_URL = 'https://media.base44.com/images/public/user_6a490d244e51c397a0df34fb/067115bd0_lejju.jpg';

const AGENT_SYSTEM_PROMPT = `Eres el Agente LEJJU, un guía kabbalístico basado en la filosofía de la auto-pregunta. 

REGLAS ABSOLUTAS:
1. Para consultas de desarrollo personal, problemas existenciales, relaciones, emociones, propósito o cualquier tema introspectivo: respondes EXCLUSIVAMENTE con preguntas reflexivas. NUNCA das consejos. NUNCA dices si algo está bien o mal. NUNCA opinas sobre la situación del usuario. Tu método es devolver la pregunta al usuario con profundidad kabbalística para activar su propio análisis.
2. Para consultas sobre servicios, productos, precios, horarios o información operativa de LEJJU Studio: respondes de forma profesional, clara y servicial.
3. Mantienes un tono sereno, místico y contemplativo en todo momento.
4. Tus preguntas son cortas, precisas y penetrantes — como llaves que abren puertas internas.

CONTACTO: Email lejustudio2@gmail.com, WhatsApp +598293823368, Instagram @lejju.studio, Telegram t.me/Sunegga`;

export default function AgentWidget() {
  const { t, lang } = useLang();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{ role: 'agent', text: t('agent.welcome') }]);
    }
  }, [open]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setMessages((m) => [...m, { role: 'user', text: userMsg }]);
    setInput('');
    setLoading(true);

    try {
 const conversation = [...messages, { role: 'user', text: userMsg }]
        .map((m) => `${m.role === 'user' ? 'Usuario' : 'Agente'}: ${m.text}`)
        .join('\n\n');

      const res = await base44.integrations.Core.InvokeLLM({
        prompt: `${AGENT_SYSTEM_PROMPT}\n\nIdioma de respuesta: ${lang === 'es' ? 'Español' : 'English'}\n\nConversación:\n${conversation}\n\nAgente:`,
        model: 'gemini_3_flash',
      });

      const reply = typeof res === 'string' ? res : res?.response || res?.text || JSON.stringify(res);
      setMessages((m) => [...m, { role: 'agent', text: reply }]);
    } catch {
      setMessages((m) => [...m, { role: 'agent', text: lang === 'es' ? 'El canal se está realineando. Intenta nuevamente en un momento.' : 'The channel is realigning. Try again in a moment.' }]);
    }
    setLoading(false);
  };

  return (
    <>
      {/* Floating Button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full glass-card glow-gold flex items-center justify-center hover:scale-105 transition-transform"
        >
          <img src={LOGO_URL} alt="LEJJU Agent" className="w-10 h-10 rounded-full object-cover ring-1 ring-white/20" />
        </button>
      )}

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-[calc(100vw-3rem)] sm:w-96 h-[500px] max-h-[calc(100vh-3rem)] glass-card rounded-2xl flex flex-col overflow-hidden animate-scale-in">
          {/* Header */}
          <div className="flex items-center gap-3 p-4 border-b border-carbon bg-black/40">
            <img src={LOGO_URL} alt="LEJJU" className="w-9 h-9 rounded-full object-cover ring-1 ring-white/20" />
            <div className="flex-1">
              <p className="text-sm font-heading font-medium text-gold">{t('agent.title')}</p>
              <p className="text-[0.65rem] text-muted-silver italic">{t('agent.subtitle')}</p>
            </div>
            <button onClick={() => setOpen(false)} className="text-muted-silver hover:text-silver transition-colors">
              <X size={18} strokeWidth={1.5} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] px-3.5 py-2.5 rounded-xl text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-white/5 text-silver rounded-br-sm'
                      : 'bg-white/[0.03] text-silver border border-carbon rounded-bl-sm'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white/[0.03] border border-carbon rounded-xl px-3.5 py-2.5 text-muted-silver text-sm">
                  <Sparkles size={14} className="animate-pulse inline mr-1" />
                  {lang === 'es' ? 'Consultando el Sello...' : 'Consulting the Seal...'}
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Disclaimer */}
          <div className="px-4 py-1.5 border-t border-carbon bg-black/20">
            <p className="text-[0.6rem] text-muted-silver leading-relaxed">{t('agent.disclaimer')}</p>
          </div>

          {/* Input */}
          <div className="p-3 border-t border-carbon flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
              placeholder={t('agent.placeholder')}
              className="flex-1 bg-black/30 border border-carbon rounded-lg px-3 py-2 text-sm text-silver placeholder:text-muted-silver focus:outline-none focus:border-white/20 transition-colors"
            />
            <button
              onClick={send}
              disabled={loading || !input.trim()}
              className="w-9 h-9 rounded-lg bg-white/5 border border-carbon flex items-center justify-center text-gold hover:bg-white/10 disabled:opacity-30 transition-colors"
            >
              <Send size={14} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}