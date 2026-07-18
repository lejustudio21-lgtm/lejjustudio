import { base44 } from '@/api/base44Client';

export async function startCheckout(items, options = {}) {
  // Block checkout if running inside an iframe (preview)
  if (window.self !== window.top) {
    alert('Checkout solo funciona desde la app publicada. Abre la app en una nueva pestaña para completar tu compra.');
    throw new Error('Checkout blocked in iframe');
  }

  const response = await base44.functions.invoke('stripe-checkout', {
    items,
    type: options.type || 'product',
    serviceRequestId: options.serviceRequestId,
    courseTitle: options.courseTitle,
    successUrl: options.successUrl || `${window.location.origin}/perfil`,
    cancelUrl: options.cancelUrl || window.location.href,
  });

  if (response.data?.url) {
    window.location.href = response.data.url;
  } else {
    throw new Error('No checkout URL returned');
  }
}