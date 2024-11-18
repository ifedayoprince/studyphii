import { useCallback, useEffect, useRef } from "react";

/**
 * A custom hook that creates a debounced version of a callback function.
 * The debounced function will delay execution until after the specified delay,
 * and will cancel any pending executions when called again within that delay.
 * 
 * @param callback The function to debounce
 * @param delay The delay in milliseconds
 * @returns A debounced version of the callback function
 * 
 * @example
 * ```tsx
 * const handleSearch = (query: string) => {
 *   // API call or expensive operation
 * };
 * 
 * const debouncedSearch = useDebounce(handleSearch, 500);
 * 
 * // In your JSX
 * <input onChange={(e) => debouncedSearch(e.target.value)} />
 * ```
 */
const useDebounce = <T extends any[]>(
  callback: (...args: T) => void,
  delay: number
) => {
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Cleanup timeout on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return useCallback((...args: T) => {
    // Cancel previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay]);
};

export default useDebounce;
