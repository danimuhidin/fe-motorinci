import { cache } from 'react';

const getAuthToken = cache(async (): Promise<string | null> => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const username = process.env.NEXT_PUBLIC_API_USERNAME;
  const password = process.env.NEXT_PUBLIC_API_PASSWORD;
  
  if (!apiUrl || !username || !password) {
    console.error("Missing API credentials in .env.local");
    return null;
  }
  try {
    const response = await fetch(`${apiUrl}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ login: username, password: password }),
    });
    if (!response.ok) return null;
    const data = await response.json();
    return data.token;
  } catch (error) {
    console.error("An error occurred during login:", error);
    return null;
  }
});

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const token = await getAuthToken();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!token) {
    throw new Error("Authentication token is not available.");
  }

  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    ...options.headers,
  };

  const response = await fetch(`${apiUrl}${endpoint}`, {
    ...options,
    headers,
    next: options.next || { revalidate: 0 },
  });

  if (!response.ok) {
    throw new Error(`API call failed for endpoint: ${endpoint} with status: ${response.status}`);
  }

  if (response.status === 204) {
    return response;
  }
  
  return response.json();
};