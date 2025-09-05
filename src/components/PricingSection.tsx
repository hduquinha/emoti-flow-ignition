import { Check, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const PricingSection = () => {
  const plans = [
    {
      name: "Acesso Essencial",
      price: "297",
      description:
        "Para quem quer dar o primeiro passo e ter acesso ao vivo à transformação.",
      features: [
        "Acesso aos 2 dias de treinamento ao vivo",
        "Material de apoio em PDF",
        "Acesso à comunidade de alunos",
      ],
      cta: "Começar Agora",
      isRecommended: false,
    },
    {
      name: "Plano UP",
      price: "497",
      description:
        "A experiência completa para absorver, rever e aplicar todo o conhecimento.",
      features: [
        "Tudo do plano Essencial, e mais:",
        "Acesso à gravação por 1 ano",
        "Sessão Bônus de Q&A em grupo",
        "Módulo extra: 'Produtividade Acelerada'",
      ],
      cta: "Garantir Minha Vaga",
      isRecommended: true,
    },
    {
      name: "Experiência Premium",
      price: "997",
      description:
        "Para quem busca maestria e acompanhamento individualizado.",
      features: [
        "Tudo do plano UP, e mais:",
        "Acesso VITALÍCIO às gravações",
        "1 Sessão de mentoria individual",
        "Acesso ao grupo Mastermind",
      ],
      cta: "Aplicar para Premium",
      isRecommended: false,
    },
  ];

  return (
    <section
      id="pricing"
      className="relative bg-black py-16 sm:py-20 px-4 sm:px-6 overflow-hidden"
    >
      <div className="absolute inset-0 flex justify-center items-center opacity-30 pointer-events-none">
        <div className="w-[900px] h-[900px] bg-turquoise/10 rounded-full blur-[140px]" />
      </div>

      <div className="relative z-10 container max-w-7xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white uppercase tracking-wider">
            Escolha seu Nível de <span className="text-turquoise">Comprometimento</span>
          </h2>
          <p className="max-w-3xl mx-auto mt-4 text-gray-400">
            Cada plano é um passo em direção à sua melhor versão. Encontre a experiência ideal para o seu momento.
          </p>
        </div>

        {/* Grid responsivo: 1 → 2 → 3 colunas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
          {plans.map((plan, index) => {
            const checkoutUrl = `/checkout?plan=${encodeURIComponent(plan.name)}&price=${plan.price}`;
            return (
              <div
                key={index}
                className={`relative bg-[#111] rounded-xl border flex flex-col transition-all duration-300 h-full w-full max-w-sm mx-auto ${
                  plan.isRecommended
                    ? 'border-turquoise shadow-2xl shadow-turquoise/20'
                    : 'border-gray-800 lg:hover:scale-105'
                }`}
              >
                {plan.isRecommended && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-turquoise text-black font-bold text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full uppercase tracking-wider">
                    Mais Popular
                  </div>
                )}

                <div className={`flex-grow p-6 sm:p-8 ${plan.isRecommended ? 'pt-8 sm:pt-10 lg:pt-16' : ''}`}>
                  <h3 className={`text-2xl font-bold text-center ${plan.isRecommended ? 'text-turquoise' : 'text-white'}`}>
                    {plan.name}
                  </h3>

                  <div className="text-center my-5 sm:my-6">
                    <span className="text-4xl sm:text-5xl font-extrabold text-white">R$ {plan.price}</span>
                    <span className="text-gray-400"> / à vista</span>
                  </div>

                  <p className="text-gray-400 text-center text-sm min-h-[3.5rem] mb-5 sm:mb-6">
                    {plan.description}
                  </p>

                  <hr className="border-gray-700 my-5" />
                  <ul className="space-y-4 text-gray-300">
                    {plan.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-start gap-3">
                        <Check
                          className={`w-5 h-5 mt-1 flex-shrink-0 ${
                            plan.isRecommended ? 'text-turquoise' : 'text-gray-500'
                          }`}
                        />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-auto p-6 sm:p-8 pt-0">
                  <Button
                    asChild
                    variant={plan.isRecommended ? 'cta' : 'secondary'}
                    className="w-full text-base sm:text-lg py-4 sm:py-5 whitespace-normal break-words leading-tight text-center"
                  >
                    <Link to={checkoutUrl}>
                      {plan.isRecommended && <Star className="w-5 h-5 mr-2" />}
                      {plan.cta}
                    </Link>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
