import { GoogleGenAI } from "@google/genai";
import { Transaction, IncomeSource, Goal } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateFinancialInsights = async (
  transactions: Transaction[],
  incomeSources: IncomeSource[],
  goals: Goal[]
): Promise<string> => {
  if (!apiKey) {
    return "A chave da API está faltando. Por favor, configure seu ambiente para usar recursos de IA.";
  }

  const prompt = `
    Analise os seguintes dados financeiros para um usuário chamado "Usuário Cashfy".
    
    Dados:
    - Transações (Últimas 50): ${JSON.stringify(transactions.slice(0, 50))}
    - Fontes de Renda: ${JSON.stringify(incomeSources)}
    - Metas Financeiras: ${JSON.stringify(goals)}

    Forneça um resumo financeiro conciso e profissional em Português do Brasil.
    1. Destaque tendências de gastos.
    2. Dê conselhos específicos sobre como atingir as metas mais rapidamente.
    3. Aponte quaisquer riscos potenciais com base nos gastos vs renda.
    
    Formate a resposta em Markdown. Mantenha um tom encorajador, mas realista.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: "Você é um consultor financeiro de classe mundial para a plataforma SaaS Cashfy. Responda sempre em Português do Brasil.",
        thinkingConfig: { thinkingBudget: 0 } // Disable thinking for faster response on simple analysis
      }
    });
    return response.text || "Não foi possível gerar insights neste momento.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Ocorreu um erro ao gerar insights. Por favor, tente novamente mais tarde.";
  }
};