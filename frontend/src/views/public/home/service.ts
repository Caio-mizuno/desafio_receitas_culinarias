export function debounce<T extends (...args: any[]) => any>(func: T, wait: number): T {
  let timeout: any
  return ((...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func.apply(null, args), wait)
  }) as T
}

