import { useCallback, useRef } from "react";
import { debounce, DebouncedFunc } from "lodash";

export function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): DebouncedFunc<T> {
  const debouncedCallback = useRef(debounce(callback, delay)).current;

  return useCallback(debouncedCallback, [debouncedCallback]);
}
