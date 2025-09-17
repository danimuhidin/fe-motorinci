// src/hooks/useDebounce.ts
import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay?: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Atur timer untuk memperbarui nilai setelah jeda waktu (delay)
    const timer = setTimeout(() => setDebouncedValue(value), delay || 500);

    // Bersihkan timer jika nilai atau jeda waktu berubah
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}