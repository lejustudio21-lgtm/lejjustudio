import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';
import Stripe from 'npm:stripe@16.2.0';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');

    if (!webhookSecret) {
      return Response.json({ error: 'Webhook secret not configured' }, { status: 500 });
    }

    const event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      webhookSecret
    );

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const metadata = session.metadata || {};

      // Update order status to paid
      if (metadata.user_id) {
        try {
          const orders = await base44.asServiceRole.entities.Order.filter({
            user_id: metadata.user_id,
            status: 'pendiente',
          }, '-created_date', 5);

          for (const order of orders) {
            if (Math.abs(order.total - parseFloat(metadata.total || '0')) < 0.01) {
              await base44.asServiceRole.entities.Order.update(order.id, {
                status: 'pagado',
              });
              break;
            }
          }
        } catch (e) {
          console.log('Order update failed:', e.message);
        }
      }
    }

    return Response.json({ received: true });
  } catch (error) {
    console.error('Stripe webhook error:', error.message);
    return Response.json({ error: error.message }, { status: 400 });
  }
});