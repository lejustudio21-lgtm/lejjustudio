import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { IMAGES } from '@/lib/images';
import AppShell from '@/components/AppShell';
import { useLang } from '@/lib/LanguageContext';
import { GraduationCap, Calendar, Clock, ChevronRight } from 'lucide-react';
import { startCheckout } from '@/lib/checkout';

export default function Cursos() {
  const { t } = useLang();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(null);

  const buyCourse = async (course) => {
    if (buying) return;
    setBuying(course.id);
    try {
      await startCheckout(
        [{ name: course.title, price: course.price, quantity: 1 }],
        { type: 'course', courseTitle: course.title, successUrl: `${window.location.origin}/perfil` }
      );
    } catch (e) {
      if (e.message !== 'Checkout blocked in iframe') {
        alert('Error al procesar el pago. Intenta nuevamente.');
      }
      setBuying(null);
    }
  };

  useEffect(() => {
    const load = async () => {
      try {
        const data = await base44.entities.Course.list('order', 50);
        setCourses(data || []);
      } catch {}
      setLoading(false);
    };
    load();
  }, []);

  return (
    <AppShell>
      <div className="min-h-screen">
        <div className="relative h-56 overflow-hidden">
          <img src={IMAGES.heroExplosion2} alt="" className="absolute inset-0 w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-carbon" />
          <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
            <GraduationCap size={28} strokeWidth={1} className="text-gold mb-3" />
            <h1 className="text-3xl sm:text-4xl font-heading font-light tracking-wide text-gold text-glow-gold">{t('nav.cursos')}</h1>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-6 py-12">
          {loading ? (
            <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-white/10 border-t-gold rounded-full animate-spin" /></div>
          ) : courses.length === 0 ? (
            <div className="text-center py-20 text-muted-silver text-sm">{t('common.noContent')}</div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {courses.map((course, i) => (
                <div key={course.id || i} className="glass-card glass-card-hover rounded-2xl overflow-hidden animate-fade-in-up" style={{ animationDelay: `${i * 0.08}s`, opacity: 0 }}>
                  <div className="aspect-video bg-black/30 relative">
                    {course.image ? <img src={course.image} alt="" className="absolute inset-0 w-full h-full object-cover opacity-50" /> : <div className="absolute inset-0 flex items-center justify-center"><GraduationCap size={32} strokeWidth={0.5} className="text-gold/30" /></div>}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <span className="absolute top-3 left-3 px-2 py-1 rounded-full bg-black/50 backdrop-blur-sm text-[0.65rem] text-gold font-heading tracking-wider uppercase">{course.type}</span>
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-heading font-medium text-silver mb-1">{course.title}</h3>
                    <p className="text-xs text-muted-silver leading-relaxed mb-3 line-clamp-2">{course.description}</p>
                    <div className="flex items-center gap-3 text-[0.65rem] text-muted-silver mb-3">
                      {course.date && <span className="flex items-center gap-1"><Calendar size={11} strokeWidth={1.5} />{course.date}</span>}
                      {course.duration && <span className="flex items-center gap-1"><Clock size={11} strokeWidth={1.5} />{course.duration}</span>}
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-carbon">
                      <span className="text-base font-heading text-gold">${course.price}</span>
                      <button onClick={() => buyCourse(course)} disabled={buying === course.id} className="flex items-center gap-1 text-xs text-silver hover:text-gold transition-colors font-heading disabled:opacity-30">
                        {buying === course.id ? '...' : t('common.buy')} <ChevronRight size={12} strokeWidth={1.5} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}