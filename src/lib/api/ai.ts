// lib/api/ai.ts
import { fetchWithAuth } from '../api';

// Tipe untuk respons dari API chat
interface AiResponse {
  code: number;
  message: string;
  data: string;
}

/**
 * Mengirimkan prompt ke API AI dan mendapatkan balasan.
 */
export const sendAiPrompt = async (prompt: string, signal?: AbortSignal): Promise<AiResponse> => {
  const response = await fetchWithAuth<AiResponse>('/motorinci/ai', { 
    signal, 
    method: 'POST',
    body: JSON.stringify({ prompt }), // Sesuaikan key ini dengan yang diharapkan backend
  });
  return response;
};