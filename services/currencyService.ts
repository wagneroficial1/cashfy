
export interface ExchangeRateResponse {
  amount: number;
  base: string;
  date: string;
  rates: {
    [key: string]: number;
  };
}

const BASE_URL = 'https://api.frankfurter.app';

export const getExchangeRate = async (from: string, to: string): Promise<number | null> => {
  if (from === to) return 1;

  try {
    const response = await fetch(`${BASE_URL}/latest?from=${from}&to=${to}`);
    if (!response.ok) throw new Error('Falha ao buscar cotação');
    
    const data: ExchangeRateResponse = await response.json();
    return data.rates[to];
  } catch (error) {
    console.error("Erro no serviço de câmbio:", error);
    return null;
  }
};
