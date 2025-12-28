import React, { useState } from 'react';
import { Card, Button, cn } from './UI';
import { 
  BookOpen, TrendingUp, Building, Landmark, CheckCircle, XCircle, 
  ArrowRight, GraduationCap, Coins, ArrowLeft, BrainCircuit, 
  Briefcase, ShieldCheck, Zap, Gem, PieChart, Anchor
} from 'lucide-react';

interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number; // Index
}

interface LearningModule {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  content: React.ReactNode;
  questions: Question[];
}

// Conteúdo Educativo (Micro-learning Data)
const MODULES: LearningModule[] = [
  {
    id: 'assets_def',
    title: 'O que são Ativos?',
    description: 'O conceito mais básico da riqueza: a diferença entre o que põe e o que tira dinheiro do seu bolso.',
    icon: Briefcase,
    color: 'bg-indigo-500',
    content: (
      <div className="space-y-4 text-slate-700 dark:text-slate-300">
        <p>
          Para construir riqueza, você precisa entender a diferença fundamental entre <strong>Ativos</strong> e <strong>Passivos</strong>.
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Ativos:</strong> São bens ou direitos que você possui e que <em>colocam dinheiro no seu bolso</em> (geram renda ou valorizam). Exemplos: Ações, imóveis alugados, títulos públicos.</li>
          <li><strong>Passivos:</strong> São bens que <em>tiram dinheiro do seu bolso</em> (geram despesas). Exemplos: Carro de uso pessoal (gasolina, seguro), casa própria (manutenção, impostos), dívidas de cartão.</li>
        </ul>
        <p className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-lg border-l-4 border-indigo-500 text-sm">
          Regra de Ouro: Pessoas ricas focam em acumular Ativos. A classe média muitas vezes compra Passivos achando que são Ativos.
        </p>
      </div>
    ),
    questions: [
      {
        id: 'q1',
        text: 'Qual a definição simples de um Ativo financeiro?',
        options: ['Algo que você comprou parcelado', 'Algo que gera despesa mensal', 'Algo que coloca dinheiro no seu bolso', 'Um bem de luxo que desvaloriza'],
        correctAnswer: 2
      },
      {
        id: 'q2',
        text: 'Um carro de uso pessoal é geralmente considerado:',
        options: ['Um Ativo Gerador de Renda', 'Um Passivo (pois gera despesas)', 'Um Investimento de Baixo Risco', 'Uma Reserva de Emergência'],
        correctAnswer: 1
      }
    ]
  },
  {
    id: 'fixed_income',
    title: 'Renda Fixa',
    description: 'A base da segurança financeira. Empreste dinheiro para bancos ou governo em troca de juros.',
    icon: Anchor,
    color: 'bg-emerald-500',
    content: (
      <div className="space-y-4 text-slate-700 dark:text-slate-300">
        <p>
          Na <strong>Renda Fixa</strong>, as regras de rendimento são definidas no momento da aplicação. É como um empréstimo onde VOCÊ é o banco.
        </p>
        <h4 className="font-bold text-lg text-emerald-600 dark:text-emerald-400">Principais Tipos:</h4>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Tesouro Direto:</strong> Você empresta para o Governo Federal. É considerado o investimento mais seguro do país.</li>
          <li><strong>CDB (Certificado de Depósito Bancário):</strong> Você empresta para bancos. Protegido pelo FGC até R$ 250 mil.</li>
          <li><strong>LCI/LCA:</strong> Empréstimo para setores imobiliário e agrícola. Isento de Imposto de Renda.</li>
        </ul>
        <p className="bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-lg border-l-4 border-emerald-500 text-sm">
          A rentabilidade geralmente segue a taxa Selic ou o CDI. É ideal para segurança e previsibilidade.
        </p>
      </div>
    ),
    questions: [
      {
        id: 'q1',
        text: 'Ao investir no Tesouro Direto, para quem você está emprestando dinheiro?',
        options: ['Para uma empresa privada', 'Para o Governo Federal', 'Para a Bolsa de Valores', 'Para um Banco'],
        correctAnswer: 1
      },
      {
        id: 'q2',
        text: 'Qual a principal vantagem das LCI e LCA?',
        options: ['Altíssimo risco', 'Garantia de dobrar o capital', 'Isenção de Imposto de Renda', 'Liquidez imediata sempre'],
        correctAnswer: 2
      }
    ]
  },
  {
    id: 'low_risk',
    title: 'Investimentos de Baixo Risco',
    description: 'Onde guardar sua Reserva de Emergência e dinheiro de curto prazo.',
    icon: ShieldCheck,
    color: 'bg-teal-500',
    content: (
      <div className="space-y-4 text-slate-700 dark:text-slate-300">
        <p>
          Investimentos de <strong>Baixo Risco</strong> priorizam a proteção do capital (não perder dinheiro) e a liquidez (poder sacar rápido) em vez de retornos explosivos.
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Tesouro Selic:</strong> Risco soberano (menor risco de crédito do país). Liquidez diária.</li>
          <li><strong>CDB de Liquidez Diária:</strong> Rendimento próximo a 100% do CDI, garantido pelo FGC.</li>
          <li><strong>Poupança:</strong> Baixíssimo risco, mas historicamente perde para a inflação (dinheiro perde poder de compra).</li>
        </ul>
        <p className="bg-teal-50 dark:bg-teal-900/20 p-3 rounded-lg border-l-4 border-teal-500 text-sm">
          Nunca busque "alto retorno" com sua Reserva de Emergência. A função dela é segurança, não riqueza.
        </p>
      </div>
    ),
    questions: [
      {
        id: 'q1',
        text: 'Qual o principal objetivo de um investimento de baixo risco?',
        options: ['Ficar rico rápido', 'Apostar na sorte', 'Preservação de capital e segurança', 'Comprar criptomoedas'],
        correctAnswer: 2
      },
      {
        id: 'q2',
        text: 'Por que a poupança costuma ser considerada um investimento ruim apesar da segurança?',
        options: ['Porque é difícil de sacar', 'Porque cobra muitas taxas', 'Porque frequentemente rende menos que a inflação', 'Porque é ilegal'],
        correctAnswer: 2
      }
    ]
  },
  {
    id: 'stock_market_investing',
    title: 'Como investir na Bolsa',
    description: 'O passo a passo para entrar no mercado de ações e se tornar sócio de grandes empresas.',
    icon: TrendingUp,
    color: 'bg-blue-600',
    content: (
      <div className="space-y-4 text-slate-700 dark:text-slate-300">
        <p>
          Investir na Bolsa (B3 no Brasil) parece complexo, mas o processo operacional é simples. O desafio é a escolha dos ativos.
        </p>
        <ol className="list-decimal pl-5 space-y-2">
          <li><strong>Abra conta em uma Corretora:</strong> Bancos tradicionais costumam cobrar taxas altas. Corretoras digitais geralmente são taxa zero.</li>
          <li><strong>Transfira o dinheiro:</strong> Envie um PIX ou TED para sua conta na corretora.</li>
          <li><strong>Acesse o Home Broker:</strong> É a plataforma onde você digita o código da ação (Ticker). Ex: PETR4, VALE3.</li>
          <li><strong>Emita a Ordem:</strong> Defina quantas ações quer e o preço. Ao "casar" com uma ordem de venda, o negócio é feito.</li>
        </ol>
        <p className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border-l-4 border-blue-600 text-sm">
          Atenção: A Bolsa é Renda Variável. Você pode ganhar com a valorização da cota e com dividendos, mas também pode ver seu patrimônio oscilar para baixo.
        </p>
      </div>
    ),
    questions: [
      {
        id: 'q1',
        text: 'Qual é o código que você digita para encontrar uma ação no Home Broker?',
        options: ['Senha', 'Ticker', 'Token', 'CEP'],
        correctAnswer: 1
      },
      {
        id: 'q2',
        text: 'O que é necessário para começar a investir na Bolsa?',
        options: ['Ser milionário', 'Ter conta em uma corretora de valores', 'Ter um diploma de economia', 'Ir fisicamente até a B3'],
        correctAnswer: 1
      }
    ]
  },
  {
    id: 'passive_income',
    title: 'Renda Passiva',
    description: 'Faça o dinheiro trabalhar para você. A chave para a liberdade financeira.',
    icon: Coins,
    color: 'bg-yellow-500',
    content: (
      <div className="space-y-4 text-slate-700 dark:text-slate-300">
        <p>
          <strong>Renda Passiva</strong> é o dinheiro que entra na sua conta sem que você precise trabalhar ativamente por ele naquele momento.
        </p>
        <h4 className="font-bold text-lg text-yellow-600 dark:text-yellow-400">Exemplos Clássicos:</h4>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Dividendos de Ações:</strong> Parte do lucro das empresas pago a você.</li>
          <li><strong>Proventos de FIIs:</strong> "Aluguéis" mensais de fundos imobiliários, isentos de IR.</li>
          <li><strong>Juros sobre Capital Próprio (JCP):</strong> Similar a dividendos, mas com tributação.</li>
          <li><strong>Royalties:</strong> Direitos autorais de livros, músicas ou patentes.</li>
        </ul>
        <p className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg border-l-4 border-yellow-500 text-sm">
          O objetivo final do investidor é que sua Renda Passiva pague todas as suas despesas mensais. Isso se chama Independência Financeira.
        </p>
      </div>
    ),
    questions: [
      {
        id: 'q1',
        text: 'Qual é a definição de Renda Passiva?',
        options: ['Salário do seu emprego', 'Dinheiro ganho fazendo hora extra', 'Renda gerada sem trabalho ativo imediato', 'Dinheiro de herança'],
        correctAnswer: 2
      },
      {
        id: 'q2',
        text: 'Qual destes ativos gera renda passiva mensal geralmente isenta de IR?',
        options: ['Bitcoin', 'Fundos Imobiliários (FIIs)', 'Terreno vazio', 'Dólar em espécie'],
        correctAnswer: 1
      }
    ]
  },
  {
    id: 'variable_income',
    title: 'Renda Variável',
    description: 'Maior potencial de retorno, mas sem garantias. O motor de crescimento da carteira.',
    icon: PieChart,
    color: 'bg-purple-600',
    content: (
      <div className="space-y-4 text-slate-700 dark:text-slate-300">
        <p>
          Na <strong>Renda Variável</strong>, você não sabe quanto vai ganhar e nem <em>se</em> vai ganhar. O retorno depende do desempenho do ativo e do mercado.
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Risco vs Retorno:</strong> Historicamente, a renda variável supera a renda fixa no longo prazo, mas exige estômago para aguentar as quedas (volatilidade).</li>
          <li><strong>Principais Ativos:</strong> Ações, Fundos Imobiliários (FIIs), ETFs (Fundos de Índice), BDRs (Ações estrangeiras).</li>
          <li><strong>Longo Prazo:</strong> O tempo dilui o risco. Investir em boas empresas por 10+ anos tende a ser muito lucrativo.</li>
        </ul>
        <p className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg border-l-4 border-purple-600 text-sm">
          Dica: Não invista em Renda Variável o dinheiro que você vai precisar usar no curto prazo (ex: menos de 2 anos).
        </p>
      </div>
    ),
    questions: [
      {
        id: 'q1',
        text: 'Qual a principal característica da Renda Variável?',
        options: ['Retorno garantido de 1% ao mês', 'Sem risco de perda', 'Oscilação de preços e retorno não garantido', 'Proteção do FGC'],
        correctAnswer: 2
      },
      {
        id: 'q2',
        text: 'Qual o melhor horizonte de tempo para Renda Variável?',
        options: ['1 semana', '1 mês', 'Longo prazo (5, 10+ anos)', 'Day trade apenas'],
        correctAnswer: 2
      }
    ]
  },
  {
    id: 'high_risk',
    title: 'Investimentos de Alto Risco',
    description: 'Possibilidade de ganhos explosivos ou perda total. Para investidores experientes.',
    icon: Zap,
    color: 'bg-orange-500',
    content: (
      <div className="space-y-4 text-slate-700 dark:text-slate-300">
        <p>
          Investimentos de <strong>Alto Risco</strong> são aqueles onde a volatilidade é extrema ou há possibilidade real de perder todo o capital investido.
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Criptomoedas:</strong> Projetos inovadores mas sem regulação e altamente voláteis.</li>
          <li><strong>Day Trade:</strong> Comprar e vender no mesmo dia. Estatísticas mostram que a maioria perde dinheiro no longo prazo.</li>
          <li><strong>Opções e Derivativos:</strong> Instrumentos complexos de alavancagem financeira.</li>
        </ul>
        <p className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg border-l-4 border-orange-500 text-sm">
          Regra de Gestão de Risco: Nunca coloque mais do que 5% a 10% do seu patrimônio em ativos de altíssimo risco.
        </p>
      </div>
    ),
    questions: [
      {
        id: 'q1',
        text: 'O que significa "Volatilidade" no mercado financeiro?',
        options: ['O ativo sempre sobe', 'O preço varia muito intensamente para cima e para baixo', 'O ativo não tem liquidez', 'O ativo é seguro'],
        correctAnswer: 1
      },
      {
        id: 'q2',
        text: 'Qual estratégia é considerada de alto risco?',
        options: ['Tesouro Selic', 'Comprar ações de empresas sólidas para longo prazo', 'Day Trade alavancado', 'Fundos Imobiliários'],
        correctAnswer: 2
      }
    ]
  },
  {
    id: 'alternatives',
    title: 'Investimentos Alternativos',
    description: 'Diversificação fora do mercado financeiro tradicional.',
    icon: Gem,
    color: 'bg-pink-500',
    content: (
      <div className="space-y-4 text-slate-700 dark:text-slate-300">
        <p>
          <strong>Investimentos Alternativos</strong> são classes de ativos que não se correlacionam diretamente com a bolsa de valores ou renda fixa tradicional.
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Venture Capital:</strong> Investir em startups ou empresas de capital fechado.</li>
          <li><strong>Ouro e Metais Preciosos:</strong> Reserva de valor em tempos de crise.</li>
          <li><strong>Objetos de Coleção:</strong> Obras de arte, vinhos finos, relógios de luxo.</li>
          <li><strong>P2P Lending:</strong> Empréstimo direto para empresas ou pessoas (Peer-to-Peer).</li>
        </ul>
        <p className="bg-pink-50 dark:bg-pink-900/20 p-3 rounded-lg border-l-4 border-pink-500 text-sm">
          Geralmente possuem baixa liquidez (difícil vender rápido), mas são ótimos para diversificar grandes patrimônios e descorrelacionar da bolsa.
        </p>
      </div>
    ),
    questions: [
      {
        id: 'q1',
        text: 'Qual é uma característica comum de investimentos alternativos como Obras de Arte?',
        options: ['Altíssima liquidez (vende na hora)', 'Baixa liquidez (difícil vender rápido)', 'Garantia do governo', 'Isento de risco'],
        correctAnswer: 1
      },
      {
        id: 'q2',
        text: 'Investir em Startups (Venture Capital) é um exemplo de:',
        options: ['Renda Fixa', 'Investimento Alternativo', 'Poupança', 'Fundo Imobiliário'],
        correctAnswer: 1
      }
    ]
  }
];

interface LearningHubProps {
  onEarnXP: (amount: number) => void;
}

export const LearningHub: React.FC<LearningHubProps> = ({ onEarnXP }) => {
  const [activeModule, setActiveModule] = useState<LearningModule | null>(null);
  const [quizMode, setQuizMode] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizStatus, setQuizStatus] = useState<'idle' | 'success' | 'failure'>('idle');

  const handleOpenModule = (module: LearningModule) => {
    setActiveModule(module);
    setQuizMode(false);
    setQuizStatus('idle');
    setSelectedOption(null);
  };

  const handleStartQuiz = () => {
    if (!activeModule) return;
    // Pick random question to ensure micro-learning format
    const randomQ = activeModule.questions[Math.floor(Math.random() * activeModule.questions.length)];
    setCurrentQuestion(randomQ);
    setQuizMode(true);
    setQuizStatus('idle');
    setSelectedOption(null);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null || !currentQuestion) return;

    if (selectedOption === currentQuestion.correctAnswer) {
      setQuizStatus('success');
      onEarnXP(50);
    } else {
      setQuizStatus('failure');
      onEarnXP(-20); // Penalty logic added
    }
  };

  const handleClose = () => {
    setActiveModule(null);
    setQuizMode(false);
  };

  // --- Render: LISTA DE MÓDULOS ---
  if (!activeModule) {
    return (
      <div className="space-y-6 animate-fade-in pb-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <GraduationCap className="text-blue-500" /> Centro de Aprendizado
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Estude conceitos financeiros rápidos e ganhe XP para subir de nível.
            </p>
          </div>
          <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2">
            <BrainCircuit size={16} />
            +50 XP / -20 XP
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MODULES.map((module) => {
            const Icon = module.icon;
            return (
              <Card 
                key={module.id} 
                className="group cursor-pointer hover:-translate-y-1 transition-all duration-300 overflow-hidden relative border-2 border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                onClick={() => handleOpenModule(module)}
              >
                <div className={`h-2 ${module.color} w-full absolute top-0 left-0`} />
                <div className="p-6 pt-8">
                  <div className={`w-12 h-12 rounded-xl ${module.color} bg-opacity-10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-6 h-6 ${module.color.replace('bg-', 'text-')}`} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">{module.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">
                    {module.description}
                  </p>
                  <div className="flex items-center text-sm font-semibold text-slate-400 group-hover:text-slate-800 dark:group-hover:text-white transition-colors">
                    Começar Aula <ArrowRight size={16} className="ml-1" />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  // --- Render: CONTEÚDO / QUIZ ---
  const Icon = activeModule.icon;
  const themeColorBg = activeModule.color;

  return (
    <div className="max-w-3xl mx-auto animate-fade-in pb-10">
      <Button variant="ghost" onClick={handleClose} className="mb-4 pl-0 hover:bg-transparent hover:text-slate-800 dark:hover:text-white">
        <ArrowLeft size={20} className="mr-2" /> Voltar para Lista
      </Button>

      <Card className="overflow-hidden border-0 shadow-xl">
        {/* Header do Card */}
        <div className={`${themeColorBg} p-8 text-white relative overflow-hidden`}>
          <Icon className="absolute -bottom-6 -right-6 w-40 h-40 opacity-20 rotate-12" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                Micro-learning
              </span>
              {quizMode && <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide flex items-center gap-1"><BrainCircuit size={12}/> Quiz Valendo XP</span>}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{activeModule.title}</h1>
            <p className="text-white/90 text-lg max-w-xl">{activeModule.description}</p>
          </div>
        </div>

        <div className="p-6 md:p-8 bg-white dark:bg-slate-900 min-h-[400px]">
          
          {/* MODO LEITURA */}
          {!quizMode && (
            <div className="animate-fade-in space-y-8">
              <div className="prose dark:prose-invert max-w-none text-lg leading-relaxed">
                {activeModule.content}
              </div>
              
              <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <Button 
                  onClick={handleStartQuiz} 
                  className={`${themeColorBg} hover:opacity-90 text-white px-8 py-3 text-lg shadow-lg shadow-blue-900/10 flex items-center gap-2`}
                >
                  <BookOpen size={20} /> Finalizar e Testar
                </Button>
              </div>
            </div>
          )}

          {/* MODO QUIZ */}
          {quizMode && currentQuestion && (
            <div className="animate-fade-in max-w-xl mx-auto">
              {quizStatus === 'idle' && (
                <>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 text-center">
                    {currentQuestion.text}
                  </h3>
                  
                  <div className="space-y-3 mb-8">
                    {currentQuestion.options.map((option, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedOption(idx)}
                        className={cn(
                          "w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-3",
                          selectedOption === idx 
                            ? `border-${activeModule.color.split('-')[1]}-500 bg-${activeModule.color.split('-')[1]}-50 dark:bg-${activeModule.color.split('-')[1]}-900/20`
                            : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-transparent"
                        )}
                      >
                        <div className={cn(
                          "w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                          selectedOption === idx ? `border-${activeModule.color.split('-')[1]}-500` : "border-slate-300"
                        )}>
                          {selectedOption === idx && <div className={`w-3 h-3 rounded-full ${themeColorBg}`} />}
                        </div>
                        <span className={selectedOption === idx ? "font-semibold text-slate-900 dark:text-white" : "text-slate-600 dark:text-slate-300"}>
                          {option}
                        </span>
                      </button>
                    ))}
                  </div>

                  <Button 
                    onClick={handleSubmitAnswer}
                    disabled={selectedOption === null}
                    className="w-full py-4 text-lg font-bold"
                  >
                    Confirmar Resposta
                  </Button>
                </>
              )}

              {quizStatus === 'success' && (
                <div className="text-center py-10 animate-fade-in">
                  <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                    <CheckCircle className="w-12 h-12 text-emerald-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Resposta Correta!</h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-6">Você aprendeu algo novo hoje.</p>
                  
                  <div className="inline-block bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-500 px-6 py-2 rounded-full font-bold text-lg mb-8 border border-yellow-200 dark:border-yellow-700/50">
                    +50 XP Conquistados
                  </div>

                  <div className="flex gap-4 justify-center">
                    <Button variant="secondary" onClick={handleClose}>
                      Concluir
                    </Button>
                  </div>
                </div>
              )}

              {quizStatus === 'failure' && (
                <div className="text-center py-10 animate-fade-in">
                  <div className="w-24 h-24 bg-rose-100 dark:bg-rose-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                    <XCircle className="w-12 h-12 text-rose-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Ops, resposta errada.</h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-4">Atenção aos detalhes! Você pode tentar novamente.</p>
                  
                  <div className="inline-block bg-rose-100 dark:bg-rose-900/20 text-rose-700 dark:text-rose-500 px-6 py-2 rounded-full font-bold text-lg mb-8 border border-rose-200 dark:border-rose-700/50">
                    -20 XP
                  </div>
                  
                  <div className="flex gap-4 justify-center">
                    <Button variant="secondary" onClick={() => { setQuizMode(false); setQuizStatus('idle'); }}>
                      Ler Novamente
                    </Button>
                    <Button onClick={() => { setQuizStatus('idle'); setSelectedOption(null); }}>
                      Tentar de Novo
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};