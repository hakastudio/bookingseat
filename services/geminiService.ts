
import { GoogleGenAI } from "@google/genai";
import { Transaction, FinancialSummary } from "../types";

export const getFinancialAdvice = async (transactions: Transaction[], summary: FinancialSummary): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Anda adalah Financial Analyst untuk Jejak Langkah.
      Data Keuangan:
      - Saldo: Rp ${summary.balance.toLocaleString('id-ID')}
      - Total Pemasukan: Rp ${summary.totalIncome.toLocaleString('id-ID')}
      - Total Pengeluaran: Rp ${summary.totalExpense.toLocaleString('id-ID')}
      
      Daftar 5 Transaksi Terakhir:
      ${transactions.slice(0, 5).map(t => `- ${t.date}: ${t.description} (${t.type === 'INCOME' ? '+' : '-'} Rp ${t.amount})`).join('\n')}
      
      Berikan analisis singkat, peringatan jika pengeluaran terlalu tinggi, dan saran penghematan. 
      Gunakan bahasa yang profesional dan motivatif. Maksimal 150 kata.`,
      config: {
        temperature: 0.7,
      }
    });

    return response.text || "Terus pantau pengeluaran Anda agar saldo tetap terjaga.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Gagal mendapatkan saran AI. Pastikan koneksi internet stabil.";
  }
};
