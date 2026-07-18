import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { IMAGES } from '@/lib/images';
import AppShell from '@/components/AppShell';
import { useLang } from '@/lib/LanguageContext';
import { ShoppingBag, ShoppingCart, X, ChevronRight } from 'lucide-react';
import { startCheckout } from '@/lib/checkout';

const CATEGORIES = [
  { key: 'all', label: 'Todos' },
  { key: 'geometria_sagrada', label: 'Geometría Sagrada' },
  { key: 'proteccion_poder', label: 'Protección y Poder' },
  { key: 'zen_oriental', label: 'Zen y Oriental' },
  { key: 'wicca_luna', label: 'Wicca y Luna' },
  { key: 'mandalas', label: 'Mandalas' },
];

export default function Tienda() {
  const { t } = useLang();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await base44.entities.Product.list('order', 100);
        setProducts(data || []);
      } catch {}
      setLoading(false);
    };
    load();
  }, []);

  const filtered = filter === 'all' ? products : products.filter((p) => p.category === filter);

  const addToCart = (product) => {
    setCart((c) => {
      const existing = c.find((i) => i.id === product.id);
      if (existing) return c.map((i) => (i.id === product.id ? { ...i, qty: i.qty + 1 } : i));
      return [...c, { ...product, qty: 1 }];
    });
  };

  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const [checkingOut, setCheckingOut] = useState(false);

  const handleCheckout = async () => {
    if (cart.length === 0 || checkingOut) return;
    setCheckingOut(true);
    try {
      await startCheckout(cart.map((item) => ({ name: item.name, price: item.price, quantity: item.qty })), { type: 'product' });
    } catch (e) {
      if (e.message !== 'Checkout blocked in iframe') {
        alert('Error al procesar el pago. Intenta nuevamente.');
      }
      setCheckingOut(false);
    }
  };

  return (
    <AppShell>
      <div className="min-h-screen">
        <div className="relative h-56 overflow-hidden">
          <img src={IMAGES.diamondPure} alt="" className="absolute inset-0 w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-carbon" />
          <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
            <ShoppingBag size={28} strokeWidth={1} className="text-gold mb-3" />
            <h1 className="text-3xl sm:text-4xl font-heading font-light tracking-wide text-gold text-glow-gold">{t('nav.tienda')}</h1>
          </div>
        </div>

        {/* Cart button */}
        <button onClick={() => setCartOpen(true)} className="fixed bottom-24 right-6 z-40 w-12 h-12 rounded-full glass-card glow-soft flex items-center justify-center text-gold hover:scale-105 transition-transform">
          <ShoppingCart size={18} strokeWidth={1.5} />
          {cartCount > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gold text-black text-[0.65rem] font-heading flex items-center justify-center">{cartCount}</span>}
        </button>

        <div className="max-w-5xl mx-auto px-6 py-12">
          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {CATEGORIES.map((c) => (
              <button key={c.key} onClick={() => setFilter(c.key)} className={`px-3 py-1.5 rounded-full text-xs font-heading tracking-wider transition-all ${filter === c.key ? 'bg-white/5 text-gold border border-white/20' : 'text-muted-silver border border-carbon hover:text-silver'}`}>{c.label}</button>
            ))}
          </div>

          {loading ? (
            <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-white/10 border-t-gold rounded-full animate-spin" /></div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-muted-silver text-sm">{t('common.noContent')}</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map((product, i) => (
                <div key={product.id || i} className="glass-card glass-card-hover rounded-2xl overflow-hidden animate-fade-in-up" style={{ animationDelay: `${i * 0.05}s`, opacity: 0 }}>
                  <div className="aspect-square bg-black/30 relative">
                    {product.image ? <img src={product.image} alt="" className="absolute inset-0 w-full h-full object-cover opacity-60" /> : <div className="absolute inset-0 flex items-center justify-center"><ShoppingBag size={24} strokeWidth={0.5} className="text-gold/20" /></div>}
                  </div>
                  <div className="p-3">
                    <h3 className="text-xs font-heading font-medium text-silver leading-tight line-clamp-2 mb-1">{product.name}</h3>
                    <p className="text-[0.65rem] text-muted-silver line-clamp-1 mb-2">{product.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-heading text-gold">${product.price}</span>
                      <button onClick={() => addToCart(product)} className="text-xs text-silver hover:text-gold transition-colors flex items-center gap-0.5 font-heading">Agregar</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cart drawer */}
        {cartOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setCartOpen(false)} />
            <div className="relative w-80 max-w-[85vw] bg-card-dark border-l border-carbon flex flex-col animate-fade-in">
              <div className="flex items-center justify-between p-4 border-b border-carbon">
                <p className="text-sm font-heading text-silver">Carrito</p>
                <button onClick={() => setCartOpen(false)} className="text-muted-silver hover:text-silver"><X size={18} strokeWidth={1.5} /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {cart.length === 0 ? <p className="text-center text-muted-silver text-sm py-10">Carrito vacío</p> : cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 glass-card rounded-lg p-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-silver truncate">{item.name}</p>
                      <p className="text-[0.65rem] text-muted-silver">${item.price} x {item.qty}</p>
                    </div>
                    <button onClick={() => setCart((c) => c.filter((i) => i.id !== item.id))} className="text-muted-silver hover:text-red-400"><X size={14} strokeWidth={1.5} /></button>
                  </div>
                ))}
              </div>
              {cart.length > 0 && (
                <div className="p-4 border-t border-carbon space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-silver">{t('common.total')}</span>
                    <span className="font-heading text-gold">${cartTotal}</span>
                  </div>
                  <button onClick={handleCheckout} disabled={checkingOut} className="w-full py-2.5 rounded-lg bg-white/5 border border-white/20 text-gold font-heading text-xs tracking-wider hover:bg-white/10 disabled:opacity-30 transition-colors flex items-center justify-center gap-1">{checkingOut ? 'Procesando...' : t('common.checkout')} <ChevronRight size={14} strokeWidth={1.5} /></button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}