
const API_URL = process.env.NEXT_PUBLIC_API_URL;

const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') {
    return null; // localStorage tidak tersedia di server-side
  }
  return localStorage.getItem('authToken');
};

const loginAndStoreToken = async (): Promise<string> => {
  console.log('Attempting to login and get new token...');
  try {
    const response = await fetch(`${API_URL}/login`, {
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
    const token = data.token; // Sesuaikan key ini jika berbeda di response API Anda

    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token);
    }
    
    return token;
  } catch (error) {
    console.error("Error during login:", error);
    throw new Error('Could not authenticate with the server.');
  }
};

export const fetchWithAuth = async <T>(
  endpoint: string, 
  options: RequestInit = {} // Terima options sebagai argumen
): Promise<T> => {
  let token = getAuthToken();

  if (!token) {
    token = await loginAndStoreToken();
  }

  const fetchOptions = {
    ...options, // <-- Masukkan options (termasuk signal) di sini
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  };

  const response = await fetch(`${API_URL}${endpoint}`, fetchOptions);

  if (response.status === 401) {
    console.log('Token might be expired. Re-authenticating...');
    token = await loginAndStoreToken();
    
    const retryResponse = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (!retryResponse.ok) {
      throw new Error('Failed to fetch data even after re-authentication.');
    }
    const data = await retryResponse.json();
    return data.data; // Mengembalikan nested object 'data' sesuai contoh JSON Anda
  }
  
  if (!response.ok) {
    throw new Error('API request failed.');
  }

  const data = await response.json();
  return data.data; // Mengembalikan nested object 'data' sesuai contoh JSON Anda
};