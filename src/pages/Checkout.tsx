import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

/**
 * Checkout page that requests a checkout preference from a local backend
 * endpoint (`/api/create_preference`) and redirects the user to Mercado Pago's
 * `init_point` returned by the server.
 *
 * Server must create the preference using the Mercado Pago secret key and
 * return JSON: { init_point: string }
 */
const Checkout: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const plan = searchParams.get('plan') || 'Plano';
  const price = searchParams.get('price') || '0';
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preferPix, setPreferPix] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [addRecording, setAddRecording] = useState(false);

  const handlePay = async () => {
    setLoading(true);
    setError(null);
    try {
      // basic client-side validation
      if (!name || !email || !phone) {
        throw new Error('Preencha nome, email e telefone antes de continuar.');
      }

      // Call your backend to create a Mercado Pago preference
      const apiBase = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');
      const endpoint = apiBase ? `${apiBase}/api/create_preference` : `/api/create_preference`;
      const basePrice = Number(price) || 0;
      const totalPrice = basePrice + (addRecording ? 100 : 0);

      const payload = {
        title: plan,
        price: String(totalPrice),
        payer: { name, email, phone },
        addRecording,
        preferPix,
      };

      const resp = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!resp.ok) {
        const text = await resp.text().catch(() => null);
        throw new Error(`Erro ao criar preferência (status ${resp.status}) ${text ? '- ' + text : ''}`);
      }
      const data = await resp.json();

      if (data.init_point) {
        // Redirect user to Mercado Pago checkout
        window.location.href = data.init_point;
      } else if (data.preference_id) {
        // Alternative: open Mercado Pago checkout with preference_id
        window.location.href = `https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=${data.preference_id}`;
      } else {
        throw new Error('Resposta inválida do servidor');
      }
    } catch (e: any) {
      setError(e.message || 'Não foi possível iniciar o pagamento.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-2xl mx-auto py-20 px-4">
      <h1 className="text-3xl font-bold mb-4">Finalizar Compra</h1>
      <p className="mb-6 text-gray-400">Você escolheu: <strong>{plan}</strong> — R$ {price}</p>

      <div className="space-y-4">
        <div className="p-6 bg-[#0b0b0b] rounded-lg border border-gray-800">
          <p className="text-sm text-gray-300">Descrição do pedido</p>
          <p className="mt-2 font-medium">{plan}</p>
          <p className="text-turquoise font-bold mt-1">R$ {price}</p>
        </div>

        <div className="p-6 bg-[#0b0b0b] rounded-lg border border-gray-800">
          <h3 className="font-semibold mb-3">Seus dados</h3>
          <div className="grid grid-cols-1 gap-3">
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Nome" className="w-full p-3 bg-[#0b0b0b] border border-gray-700 rounded" />
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="w-full p-3 bg-[#0b0b0b] border border-gray-700 rounded" />
            <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Telefone" className="w-full p-3 bg-[#0b0b0b] border border-gray-700 rounded" />
          </div>
        </div>

        <div className="p-6 bg-[#0b0b0b] rounded-lg border border-gray-800 flex flex-col gap-3">
          <label className="flex items-center gap-3">
            <input type="checkbox" checked={addRecording} onChange={e => setAddRecording(e.target.checked)} />
            <span>Adicionar gravação da aula (+ R$100)</span>
          </label>
        </div>

        <div className="flex gap-3">
          <button
            className="btn-primary px-6 py-3 bg-turquoise text-black rounded-md font-semibold"
            onClick={handlePay}
            disabled={loading}
          >
            {loading ? 'Redirecionando...' : 'Pagar com Mercado Pago'}
          </button>
          <div className="flex items-center pl-4">
            <div className="text-sm text-gray-300">Total:</div>
            <div className="ml-2 font-bold text-turquoise">R$ {Number(price) + (addRecording ? 100 : 0)}</div>
          </div>
          <button
            className="px-4 py-3 rounded-md border border-gray-700 text-gray-300"
            onClick={() => navigate(-1)}
            disabled={loading}
          >
            Voltar
          </button>
        </div>

        <div className="mt-3">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={preferPix} onChange={e => setPreferPix(e.target.checked)} />
            <span className="text-sm text-gray-300">Preferir pagamento por PIX</span>
          </label>
        </div>

        {error && <div className="text-red-400">{error}</div>}

        <div className="text-xs text-gray-500 mt-4">
          Nota: Este front-end chama um endpoint local <code>/api/create_preference</code>.
          Você precisa criar esse endpoint no servidor com sua chave privada do Mercado Pago.
        </div>
      </div>
    </div>
  );
};

export default Checkout;
