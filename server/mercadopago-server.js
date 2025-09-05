/**
 * Example Express server demonstrating how to create a Mercado Pago preference.
 *
 * Usage:
 * 1. Install dependencies: npm install express node-fetch dotenv
 * 2. Set environment variable MP_ACCESS_TOKEN with your Mercado Pago access token
 * 3. Run: node mercadopago-server.js
 *
 * Notes: This is a simple example for local testing only.
 */
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load .env from project root (one level up from server folder) so running
// the server from either the repo root or the server folder works reliably.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, '..', '.env');
dotenv.config({ path: envPath });

const app = express();
app.use(cors());
app.use(express.json());

const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN;
if (!MP_ACCESS_TOKEN) {
  console.warn('Warning: MP_ACCESS_TOKEN is not set. Set it in your environment before running this server.');
} else {
  console.log('MP_ACCESS_TOKEN found in environment (not printed for security).');
}

app.post('/api/create_preference', async (req, res) => {
  const { title, price, payer, addRecording, preferPix } = req.body || {};
  if (!title || !price) return res.status(400).json({ error: 'Missing title or price' });

  try {
    console.log('[create_preference] req.body=', req.body);
    const frontendBase = (process.env.VITE_API_BASE_URL || process.env.FRONTEND_BASE_URL || 'http://localhost:5173').replace(/\/$/, '');

    const items = [
      {
        title: String(title).slice(0, 120),
        quantity: 1,
        currency_id: 'BRL',
        unit_price: Number(price),
      },
    ];

    if (addRecording) {
      items.push({ title: 'Gravação da aula (adicional)', quantity: 1, currency_id: 'BRL', unit_price: 100 });
    }

    const body = { items };

    // Build back_urls from FRONTEND_BASE_URL (or default localhost). Only set auto_return
    // if we have a success URL to avoid 'invalid_auto_return' from Mercado Pago.
    const backUrls = {
      success: `${frontendBase}/checkout/success`,
      failure: `${frontendBase}/checkout`,
      pending: `${frontendBase}/checkout`,
    };

  body.back_urls = backUrls;
    // Attach payer info if provided
    if (payer) {
      body.payer = {};
      if (payer.name) body.payer.name = payer.name;
      if (payer.email) body.payer.email = payer.email;
      if (payer.phone) body.payer.phone = { area_code: '', number: String(payer.phone) };
    }

    // Do NOT set auto_return for local testing with localhost back_urls — Mercado Pago
  // may reject auto_return when success URL is not publicly accessible.
  // If you have a public HTTPS frontend, you can set auto_return manually.

    // If preferPix is true, restrict payment methods to PIX
    if (preferPix) {
      // Exclude card payment types so PIX becomes available/preferred in checkout
      body.payment_methods = {
        excluded_payment_types: [
          {
            id: 'credit_card',
          },
          {
            id: 'debit_card',
          },
        ],
      };
      console.log('[create_preference] preferPix=true — excluding credit/debit card payment types');
    }

    console.log('[create_preference] body to send to Mercado Pago=', JSON.stringify(body));

    const resp = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${MP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const status = resp.status;
    const data = await resp.json().catch(() => null);
    console.log('[create_preference] mercadopago status=', status, 'body=', data);

    if (!data) {
      return res.status(502).json({ error: 'Empty response from Mercado Pago', status });
    }

    // Prefer returning init_point if present
    if (data.init_point || data.preference_id || data.id) {
      // normalize preference id field
      const preference_id = data.preference_id || data.id;
      return res.json({ init_point: data.init_point, preference_id, raw: data });
    }

    // Otherwise return a 502 with the original body to aid debugging
    return res.status(502).json({ error: 'Unexpected response from Mercado Pago', status, body: data });
  } catch (err) {
    console.error('[create_preference] error', err);
    return res.status(500).json({ error: 'failed to create preference', message: String(err) });
  }
});

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Mercado Pago example server listening on http://localhost:${port}`));
