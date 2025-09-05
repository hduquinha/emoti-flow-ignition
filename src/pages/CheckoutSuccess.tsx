import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';

const CheckoutSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const plan = searchParams.get('plan') || 'Plano';
  const price = searchParams.get('price') || '0';

  return (
    <div className="container max-w-2xl mx-auto py-20 px-4 text-center">
      <h1 className="text-3xl font-bold mb-4 text-turquoise">Pagamento Confirmado</h1>
      <p className="mb-6 text-gray-300">Obrigado! Seu pedido para <strong>{plan}</strong> no valor de R$ {price} foi concluído.</p>

      <div className="space-y-3">
        <Link to="/" className="inline-block px-6 py-3 bg-turquoise text-black rounded-md font-semibold">Voltar para o site</Link>
      </div>
    </div>
  );
};

export default CheckoutSuccess;
