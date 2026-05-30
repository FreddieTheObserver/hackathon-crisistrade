import { useEffect, useState } from "react";

/**
 * Returns a copy of `value` that only updates after `delay` ms have passed
 * without `value` changing. Each change cancels the previous pending update.
 */
export function useDebouncedValue<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}
