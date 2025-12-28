import { GoogleGenAI, Type } from "@google/genai";
import { Transaction, IncomeSource, Goal, AIAnalysisResult } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateFinancialInsights = async (
  transactions: Transaction[],
  incomeSources: IncomeSource[],
  goals: Goal[]
): Promise<AIAnalysisResult | null> => {
  if (!apiKey) {
    console.error("API Key missing");
    return null;
  }

  const prompt = `
    Analise os seguintes dados financeiros do usuário.
    
    Dados:
    - Transações (Últimas 50): ${JSON.stringify(transactions.slice(0, 50))}
    - Fontes de Renda: ${JSON.stringify(incomeSources)}
    - Metas: ${JSON.stringify(goals)}

    Gere uma análise estruturada contendo:
    1. Um resumo executivo curto.
    2. Uma pontuação de saúde financeira de 0 a 100 baseada em economia, dívidas e investimentos.
    3. Status financeiro (Excelente, Bom, Atenção, Crítico).
    4. 3 principais tendências observadas (gastos subindo/descendo, categorias vilãs).
    5. 3 recomendações práticas.
    6. Riscos potenciais.

    Responda EXCLUSIVAMENTE em JSON seguindo o schema. O idioma deve ser Português do Brasil.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: "Você é um analista financeiro sênior. Seja direto, prático e visual.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            healthScore: { type: Type.INTEGER, description: "0-100 score" },
            financialStatus: { type: Type.STRING, enum: ["Excelente", "Bom", "Atenção", "Crítico"] },
            trends: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  icon: { type: Type.STRING, enum: ["up", "down", "flat"] },
                  text: { type: Type.STRING },
                  type: { type: Type.STRING, enum: ["positive", "negative", "neutral"] }
                }
              }
            },
            recommendations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  difficulty: { type: Type.STRING, enum: ["Fácil", "Médio", "Difícil"] }
                }
              }
            },
            risks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  severity: { type: Type.STRING, enum: ["low", "medium", "high"] },
                  description: { type: Type.STRING }
                }
              }
            }
          },
          required: ["summary", "healthScore", "financialStatus", "trends", "recommendations", "risks"]
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) return null;
    
    return JSON.parse(jsonText) as AIAnalysisResult;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return null;
  }
};