import { useRef } from 'react';

export function useThrottle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): T {
  const timeoutRef = useRef<number | undefined>(undefined);
  const lastExecRef = useRef<number>(0);

  return ((...args: Parameters<T>) => {
    const now = Date.now();

    if (now - lastExecRef.current >= delay) {
      lastExecRef.current = now;
      return func(...args);
    }

    clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => {
      lastExecRef.current = Date.now();
      func(...args);
    }, delay - (now - lastExecRef.current));
  }) as T;
}

export function useDebounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): T {
  const timeoutRef = useRef<number | undefined>(undefined);

  return ((...args: Parameters<T>) => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => func(...args), delay);
  }) as T;
}