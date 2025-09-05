import React, { useEffect, useMemo, useState, useRef } from 'react';

// Simple CheckoutPage.jsx using Tailwind for styles
// - Dynamically requests a preference_id from /create_preference
// - Shows total, items, upsells, and PIX QR (when MP returns point_of_interaction)

export default function CheckoutPage() {
  const baseItems = [
    { id: 'plan_basic', title: 'Acesso Essencial', unit_price: 297, quantity: 1 },
  ];

  const upsells = [
    { id: 'warranty', title: 'Garantia Estendida', unit_price: 49 },
    { id: 'accessory', title: 'Acessório Extra', unit_price: 79 },
  ];

  const [selectedUpsells, setSelectedUpsells] = useState({});
  const [preferPix, setPreferPix] = useState(false);
  const [preferenceId, setPreferenceId] = useState(null);
  const [initPoint, setInitPoint] = useState(null);
  const [mpResponseRaw, setMpResponseRaw] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const mpLoadedRef = useRef(false);
  const [activeTab, setActiveTab] = useState('card'); // 'card' | 'pix'
  const [buyer, setBuyer] = useState({ name: '', email: '', emailConfirm: '' });
  const [formErrors, setFormErrors] = useState({});
  const [pollingStatus, setPollingStatus] = useState(null);
  const pollRef = useRef({ attempts: 0, timer: null });

  // total calculation
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-2/3 p-8 bg-white">
            <header className="flex items-center gap-4 mb-6">
              <img src="/up.png" alt="logo" className="w-14 h-14 rounded-md shadow-sm object-cover" />
              <div>
                <div className="text-sm text-gray-500">Produto</div>
                <div className="text-2xl font-extrabold tracking-widest">R-E-N-D-A&nbsp;E-X-T-R-A&nbsp;2.0</div>
              </div>
            </header>

            <div className="space-y-6">
              <section className="bg-gray-50 p-4 rounded-lg border">
                <h3 className="text-lg font-medium mb-3">Dados do comprador</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm text-gray-600">Nome completo</label>
                    <input value={buyer.name} onChange={(e)=>setBuyer({...buyer, name: e.target.value})} className="mt-1 w-full px-3 py-2 rounded border focus:ring-2 focus:ring-indigo-300 outline-none" placeholder="Seu nome" />
                    {formErrors.name && <div className="text-xs text-red-600 mt-1">{formErrors.name}</div>}
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Email</label>
                    <input value={buyer.email} onChange={(e)=>setBuyer({...buyer, email: e.target.value})} className="mt-1 w-full px-3 py-2 rounded border focus:ring-2 focus:ring-indigo-300 outline-none" placeholder="email@exemplo.com" />
                    {formErrors.email && <div className="text-xs text-red-600 mt-1">{formErrors.email}</div>}
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm text-gray-600">Confirmar email</label>
                    <input value={buyer.emailConfirm} onChange={(e)=>setBuyer({...buyer, emailConfirm: e.target.value})} className="mt-1 w-full px-3 py-2 rounded border focus:ring-2 focus:ring-indigo-300 outline-none" placeholder="repita o email" />
                    {formErrors.emailConfirm && <div className="text-xs text-red-600 mt-1">{formErrors.emailConfirm}</div>}
                  </div>
                </div>
              </section>

              <section className="bg-white p-4 rounded-lg border">
                <h3 className="text-lg font-medium mb-3">Seu Pedido</h3>
                <ul className="space-y-3">
                  {baseItems.map((it) => (
                    <li key={it.id} className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">{it.title}</div>
                        <div className="text-sm text-gray-500">Quantidade: {it.quantity || 1}</div>
                      </div>
                      <div className="font-semibold">R$ {it.unit_price.toFixed(2)}</div>
                    </li>
                  ))}
                </ul>

                <div className="mt-4">
                  <h4 className="font-medium">Adicionais</h4>
                  <div className="mt-3 flex flex-wrap gap-3">
                    {upsells.map((u) => (
                      <button
                        key={u.id}
                        onClick={() => toggleUpsell(u.id)}
                        className={`px-3 py-2 rounded-full border transition-colors duration-150 ${selectedUpsells[u.id] ? 'bg-indigo-600 text-white border-indigo-600 shadow' : 'bg-white text-gray-700 hover:bg-gray-50'}`}>
                        <div className="text-sm font-medium">{u.title}</div>
                        <div className="text-xs">+R$ {u.unit_price}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </section>
            </div>
    return sum;
          <div className="md:w-1/3 p-6 bg-gray-50 border-l">
            <div className="sticky top-6">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-500">Total</div>
                    <div className="text-2xl font-bold">R$ {total.toFixed(2)}</div>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex gap-2 bg-white rounded p-1 border">
                    <button onClick={() => { setActiveTab('card'); setPreferPix(false); }} className={`flex-1 py-2 rounded ${activeTab==='card'? 'bg-blue-600 text-white':'bg-white text-gray-700'}`}>Cartão</button>
                    <button onClick={() => { setActiveTab('pix'); setPreferPix(true); }} className={`flex-1 py-2 rounded ${activeTab==='pix'? 'bg-green-600 text-white':'bg-white text-gray-700'}`}>PIX</button>
                  </div>
                </div>

                <div className="mt-4">
                  {activeTab === 'card' ? (
                    <div className="space-y-3">
                      <label className="text-sm text-gray-600">Número do cartão</label>
                      <input className="w-full px-3 py-2 rounded border" placeholder="0000 0000 0000 0000" />

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-sm text-gray-600">Validade (MM/AA)</label>
                          <input className="w-full px-3 py-2 rounded border" placeholder="MM/AA" />
                        </div>
                        <div>
                          <label className="text-sm text-gray-600">CVC</label>
                          <input className="w-full px-3 py-2 rounded border" placeholder="CVC" />
                        </div>
                      </div>

                      <div>
                        <label className="text-sm text-gray-600">Parcelas</label>
                        <select className="w-full px-3 py-2 rounded border">
                          <option>1x de R$ {total.toFixed(2)}</option>
                          <option>2x de R$ {(total/2).toFixed(2)}</option>
                          <option>3x de R$ {(total/3).toFixed(2)}</option>
                        </select>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="text-sm text-gray-600">PIX QR / Código</div>
                      <div className="mt-3 p-3 bg-white rounded border text-center">
                        {mpResponseRaw && mpResponseRaw.pix ? renderPix() : <div className="text-sm text-gray-500">{isLoading ? 'Gerando QR...' : 'Aguardando preferência/QR'}</div>}
                      </div>
                      <div className="mt-3 text-xs text-gray-500">O status é verificado automaticamente após a geração do PIX.</div>
                    </div>
                  )}
                </div>

                <div className="mt-6">
                  <button
                    disabled={!preferenceId && !import.meta.env.VITE_MP_PREFERENCE_ID}
                    onClick={async ()=>{
                      if (!validateBuyer()) return;
                      // reuse existing logic to create preference and redirect / show pix
                      const apiBase = import.meta.env.VITE_API_BASE_URL || '';
                      const endpoint = apiBase ? `${apiBase.replace(/\/$/, '')}/create_preference` : '/create_preference';
                      setIsLoading(true);
                      try {
                        const items = [
                          ...baseItems,
                          ...upsells.filter((u)=>selectedUpsells[u.id]).map((u)=>({ id: u.id, title: u.title, unit_price: u.unit_price, quantity: 1 })),
                        ];
                        const res = await fetch(endpoint, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ items, prefer_pix: activeTab==='pix', payer: buyer }) });
                        const body = await res.json().catch(()=>null);
                        if (res.ok && body) {
                          setPreferenceId(body.preference_id || body.preferenceId || import.meta.env.VITE_MP_PREFERENCE_ID);
                          setInitPoint(body.init_point || body.sandbox_init_point || null);
                          setMpResponseRaw(body);
                          try{ window.VITE_MP_PREFERENCE_ID = body.preference_id || body.preferenceId }catch(e){}
                          if (activeTab==='card' && body.init_point) window.open(body.init_point, '_blank');
                        } else {
                          const envPref = import.meta.env.VITE_MP_PREFERENCE_ID;
                          if (envPref) setPreferenceId(envPref);
                        }
                      } catch(e){ console.error(e) } finally { setIsLoading(false) }
                    }}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c.667-1.333 2-2 3.333-2s2.666.666 3.333 2M12 11v6m0-6c-.667-1.333-2-2-3.333-2S6 9.667 5.333 11M12 11c0 3.333-1 5-3 6"/></svg>
                    PAGAR AGORA
                  </button>

                  <div className="mt-3 text-center text-xs text-gray-500 flex items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c.667-1.333 2-2 3.333-2s2.666.666 3.333 2M12 11v6m0-6c-.667-1.333-2-2-3.333-2S6 9.667 5.333 11M12 11c0 3.333-1 5-3 6"/></svg>
                    <span>Pagamento 100% seguro</span>
                  </div>
                </div>

                <div className="mt-4 text-xs text-gray-400">
                  Esse site é protegido pelo reCAPTCHA do Google. Política de Privacidade e Termos de Serviço. <br /> Taxa de parcelamento: 2,99% a.m.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    };
    tick();
  }

  // Helper: renders PIX QR and copy-paste code if available in mpResponseRaw or mpResponse.pix
  function renderPix() {
  // Prefer backend-provided pix object (response.pix)
  const pixObj = mpResponseRaw?.pix || mpResponseRaw?.raw?.point_of_interaction;
  if (!pixObj) return <div className="text-sm text-gray-500">PIX ainda não gerado para esta preferência.</div>;

  const qrBase64 = mpResponseRaw?.pix?.qr_code_base64 || mpResponseRaw?.raw?.point_of_interaction?.qr_code_base64;
  const qr = mpResponseRaw?.pix?.qr_code || mpResponseRaw?.raw?.point_of_interaction?.transaction_data?.qr_code || mpResponseRaw?.pix?.raw?.point_of_interaction?.transaction_data?.qr_code;

    return (
      <div className="bg-white p-4 rounded-md shadow-md">
        <h4 className="font-semibold mb-2">Pagamento via PIX</h4>
        {qrBase64 ? (
          <img src={`data:image/png;base64,${qrBase64}`} alt="PIX QR Code" className="mx-auto" />
        ) : (
          <div className="p-4 border border-dashed rounded text-sm">QR Code não disponível</div>
        )}
        {qr && (
          <div className="mt-3">
            <label className="block text-xs text-gray-500">Código copia e cola</label>
            <textarea readOnly className="w-full mt-1 p-2 border rounded" value={qr} />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Seu Pedido</h2>
          <ul className="mt-3 space-y-2">
            {baseItems.map((it) => (
              <li key={it.id} className="flex justify-between">
                <div>
                  <div className="font-medium">{it.title}</div>
                  <div className="text-sm text-gray-500">Quantidade: {it.quantity || 1}</div>
                </div>
                <div className="font-semibold">R$ {it.unit_price.toFixed(2)}</div>
              </li>
            ))}
          </ul>

          <div className="mt-4">
            <h3 className="font-medium">Adicionais</h3>
            <div className="mt-2 flex gap-2">
              {upsells.map((u) => (
                <button
                  key={u.id}
                  onClick={() => toggleUpsell(u.id)}
                  className={`px-3 py-2 rounded border ${selectedUpsells[u.id] ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-700'}`}>
                  {u.title} (+R$ {u.unit_price})
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={preferPix} onChange={(e) => setPreferPix(e.target.checked)} />
              <span>Preferir PIX</span>
            </label>
          </div>

          <div className="mt-4">
            <div className="flex justify-between items-center">
              <div className="text-lg font-semibold">Total</div>
              <div className="text-2xl font-bold">R$ {total.toFixed(2)}</div>
            </div>
          </div>

          <div className="mt-6">
            {isLoading ? (
              <div className="w-full py-3 rounded text-center bg-yellow-200 text-yellow-800">Gerando preferência...</div>
            ) : (
              <>
                <div className="mb-2">
                  <button
                    disabled={!preferenceId && !import.meta.env.VITE_MP_PREFERENCE_ID}
                    onClick={async () => {
                      // Validate form before proceeding
                      if (!validateBuyer()) return;

                      // If preferPix, ensure tab and behavior
                      if (activeTab === 'pix') setPreferPix(true);

                      // Call create_preference again synchronously to create live preference
                      setIsLoading(true);
                      try {
                        const apiBase = import.meta.env.VITE_API_BASE_URL || '';
                        const endpoint = apiBase ? `${apiBase.replace(/\/$/, '')}/create_preference` : '/create_preference';
                        const items = [
                          ...baseItems,
                          ...upsells.filter((u) => selectedUpsells[u.id]).map((u) => ({ id: u.id, title: u.title, unit_price: u.unit_price, quantity: 1 })),
                        ];
                        const res = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ items, prefer_pix: activeTab === 'pix', payer: buyer }) });
                        const body = await res.json().catch(() => null);
                        if (res.ok && body) {
                          setPreferenceId(body.preference_id || body.preferenceId || import.meta.env.VITE_MP_PREFERENCE_ID);
                          setInitPoint(body.init_point || body.sandbox_init_point || null);
                          setMpResponseRaw(body);
                          try { window.VITE_MP_PREFERENCE_ID = body.preference_id || body.preferenceId; } catch (e) {}

                          if (activeTab === 'pix' && body.pix && body.pix.qr_code_base64) {
                            // show pix area (already handled by render)
                          } else if (body.init_point) {
                            // redirect to Mercado Pago checkout page
                            window.open(body.init_point, '_blank');
                          } else if (import.meta.env.VITE_MP_PREFERENCE_ID && activeTab === 'card') {
                            // fallback: use public preference id from env to render SDK button
                          }
                        } else {
                          // Fallback: if no backend available, use env var and mock
                          const envPref = import.meta.env.VITE_MP_PREFERENCE_ID;
                          if (envPref) {
                            setPreferenceId(envPref);
                            // Render SDK button (it will use preference id from window.VITE_MP_PREFERENCE_ID too)
                            try { window.VITE_MP_PREFERENCE_ID = envPref; } catch (e) {}
                          } else {
                            alert('Erro ao criar preferência. Verifique backend.');
                          }
                        }
                      } catch (err) {
                        console.error(err);
                      } finally {
                        setIsLoading(false);
                      }
                    }}
                    className="w-full py-3 rounded text-white bg-green-600 hover:bg-green-700 disabled:opacity-60">
                    PAGAR AGORA
                  </button>
                </div>

                <div className="text-center text-xs text-gray-500 flex items-center justify-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c.667-1.333 2-2 3.333-2s2.666.666 3.333 2M12 11v6m0-6c-.667-1.333-2-2-3.333-2S6 9.667 5.333 11M12 11c0 3.333-1 5-3 6"/></svg>
                  <span>Pagamento 100% seguro</span>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold">Métodos de Pagamento</h3>

          <div className="mt-3 space-y-3">
            <div className="flex items-center justify-between border p-3 rounded">
              <div>
                <div className="font-medium">PIX</div>
                <div className="text-sm text-gray-500">Pagamento instantâneo via PIX</div>
              </div>
              <div>
                <button onClick={() => setPreferPix(true)} className="px-3 py-2 bg-green-500 text-white rounded">Selecionar PIX</button>
              </div>
            </div>

            <div className="flex items-center justify-between border p-3 rounded">
              <div>
                <div className="font-medium">Cartão</div>
                <div className="text-sm text-gray-500">Crédito/Débito</div>
              </div>
              <div>
                <button onClick={() => setPreferPix(false)} className="px-3 py-2 bg-blue-600 text-white rounded">Cartão</button>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <h4 className="font-semibold">PIX QR / Código</h4>
            <div className="mt-2">{mpResponseRaw ? renderPix() : <div className="text-sm text-gray-500">Aguardando preferência...</div>}</div>
            <div id="mp-checkout-btn" className="mt-4" />
          </div>
        </div>
      </div>

      <div className="mt-6 text-sm text-gray-600">Preference ID: {preferenceId || '—'}</div>
    </div>
  );
}
    