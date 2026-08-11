import { useEffect, useState } from 'react'

// Delays updating the returned value until the input has stopped changing
// for `delayMs`. With a few dozen movies this is invisible either way, but
// once the catalog is in the hundreds/thousands, filtering on every single
// keystroke starts to visibly lag on slower phones — this keeps the input
// itself instant while the (potentially expensive) filtering waits a beat.
export function useDebouncedValue<T>(value: T, delayMs = 200): T {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delayMs)
    return () => clearTimeout(id)
  }, [value, delayMs])

  return debounced
}
