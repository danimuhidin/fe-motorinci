// lib/api.ts

// Fungsi untuk mendapatkan token dari localStorage.
const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }
  return localStorage.getItem('authToken');
};

// Fungsi untuk login ke API dan menyimpan token.
const loginAndStoreToken = async (): Promise<string> => {
  console.log('Attempting to login and get new token...');
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        login: process.env.NEXT_PUBLIC_API_USERNAME,
        password: process.env.NEXT_PUBLIC_API_PASSWORD,
      }),
    });

    if (!response.ok) {
      throw new Error('Login failed!');
    }

    const data = await response.json();
    const token = data.token;

    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token);
    }
    
    return token;
  } catch (error) {
    console.error("Error during login:", error);
    throw new Error('Could not authenticate with the server.');
  }
};

/**
 * Fungsi utama untuk melakukan fetch ke API yang membutuhkan autentikasi.
 * Generik dan bisa digunakan oleh semua service API.
 */
export const fetchWithAuth = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  let token = getAuthToken();

  if (!token) {
    token = await loginAndStoreToken();
  }
  
  const headers = new Headers(options.headers);

  headers.set('Authorization', `Bearer ${token}`);
  headers.set('Accept', 'application/json');

  if (options.body instanceof FormData) {
    headers.delete('Content-Type'); 
  } else {
    headers.set('Content-Type', 'application/json');
  }

  const fetchOptions: RequestInit = {
    ...options,
    headers: headers,
  };

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, fetchOptions);

  if (response.status === 401) {
    console.log('Token might be expired. Re-authenticating...');
    token = await loginAndStoreToken();
    
    headers.set('Authorization', `Bearer ${token}`);
    
    const retryOptions: RequestInit = {
      ...fetchOptions,
      headers: headers,
    };
    const retryResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, retryOptions);

    if (!retryResponse.ok) {
        const errorData = await retryResponse.json().catch(() => ({ message: 'Failed to fetch data after re-authentication.' }));
        throw new Error(errorData.message);
    }
    return await retryResponse.json();
  }
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'API request failed.' }));
    throw new Error(errorData.message);
  }

  if (response.status === 204) {
    return null as T;
  }

  return await response.json();
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;
export const publicFetch = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Public API request failed.' }));
    throw new Error(errorData.message);
  }
  
  return response.json();
};