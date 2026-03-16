/**
 * Pick defined keys from object. Omits undefined values.
 */
export function pick<T extends object, K extends keyof T>(
  obj: T,
  keys: readonly K[]
): Pick<T, K> {
  const result = {} as Pick<T, K>;
  for (const key of keys) {
    const v = obj[key];
    if (v !== undefined) {
      result[key] = v;
    }
  }
  return result;
}

/**
 * Omit keys from object.
 */
export function omit<T extends object, K extends keyof T>(
  obj: T,
  keys: readonly K[]
): Omit<T, K> {
  const set = new Set(keys);
  return Object.fromEntries(
    Object.entries(obj).filter(([k]) => !set.has(k as K))
  ) as Omit<T, K>;
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
