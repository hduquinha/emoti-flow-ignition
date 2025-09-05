import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Load .env from project root
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
app.use(cors());
app.use(express.json());

const MP_TOKEN = process.env.MERCADOPAGO_ACCESS_TOKEN || process.env.MP_ACCESS_TOKEN || process.env.MERCADOPAGO_ACCESS_TOKEN;
const FRONTEND_BASE = process.env.VITE_API_BASE_URL || 'http://localhost:5173';
const WHATSAPP_LINK = process.env.VITE_WHATSAPP_GROUP_LINK || 'https://chat.whatsapp.com/';

if (!MP_TOKEN) console.warn('MERCADOPAGO_ACCESS_TOKEN not set. See .env.example');

// Removed SDK usage and will create preferences using fetch

async function createPreferenceWithSdk(items = [], back_urls = {}, auto_return = 'approved', payment_methods = {}) {
  const url = 'https://api.mercadopago.com/checkout/preferences';
  const body = { items, back_urls, auto_return, payment_methods };
  const resp = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${MP_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await resp.json().catch(() => null);
  return data;
}

async function createPixPayment({ amount, description = 'Compra', payer = {} }) {
  const url = 'https://api.mercadopago.com/v1/payments';
  const body = {
    transaction_amount: Number(amount),
    description,
    payment_method_id: 'pix',
    payer: { email: payer.email || 'cliente@example.com', first_name: payer.name || 'Cliente' },
  };

  const resp = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${MP_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await resp.json().catch(() => null);
  return { status: resp.status, body: data };
}

app.post('/create_preference', async (req, res) => {
  try {
    const { items = [], prefer_pix = false, payer = {} } = req.body || {};
    if (!Array.isArray(items) || items.length === 0) return res.status(400).json({ error: 'items_required' });

    const back_urls = { success: WHATSAPP_LINK, failure: `${FRONTEND_BASE}/checkout`, pending: `${FRONTEND_BASE}/checkout` };
    const payment_methods = { excluded_payment_methods: [], excluded_payment_types: [], installments: 12 };

    const pref = await createPreferenceWithSdk(items, back_urls, 'approved', payment_methods);
    const response = { preference_id: pref.id || pref.preference_id, init_point: pref.init_point || pref.sandbox_init_point || null, raw: pref };

    if (prefer_pix) {
      const total = items.reduce((s, it) => s + Number(it.unit_price || it.price || 0) * (Number(it.quantity || 1)), 0);
      const pix = await createPixPayment({ amount: total, description: items.map((i) => i.title).join(' + '), payer });
      if (pix && pix.status >= 200 && pix.status < 300 && pix.body) {
        response.pix = { payment_id: pix.body.id, qr_code: pix.body.point_of_interaction?.transaction_data?.qr_code || pix.body.point_of_interaction?.qr_code, qr_code_base64: pix.body.point_of_interaction?.transaction_data?.qr_code_base64 || pix.body.point_of_interaction?.qr_code_base64, raw: pix.body };
      } else {
        response.pix_error = { status: pix?.status, body: pix?.body };
      }
    }

    return res.json(response);
  } catch (err) {
    console.error('create_preference error', err);
    return res.status(500).json({ error: 'server_error', message: String(err) });
  }
});

app.get('/payment_status/:id', async (req, res) => {
  const id = req.params.id;
  if (!id) return res.status(400).json({ error: 'missing_id' });
  try {
    const url = `https://api.mercadopago.com/v1/payments/${id}`;
    const resp = await fetch(url, { headers: { Authorization: `Bearer ${MP_TOKEN}` } });
    const data = await resp.json().catch(() => null);
    return res.json(data || {});
  } catch (err) {
    return res.status(500).json({ error: 'server_error', message: String(err) });
  }
});

app.get('/', (req, res) => res.send('Mercado Pago helper server'));

const port = Number(process.env.PORT || 3001);
app.listen(port, () => console.log(`Server listening on http://localhost:${port}`));
