export const isPromise = <T>(target: unknown): target is Promise<T> => {
  return Promise.resolve(target) === target
}

export const genId = (() => {
  let id = 0
  return () => ++id
})()

export const pickBy = <T extends object>(obj: T, fn: (key: string, value: unknown) => boolean): T => {
  const result: T = {} as unknown as T

  for (const [key, value] of Object.entries(obj)) {
    if (fn(key, value)) {
      Reflect.set(result, key, value)
    }
  }

  return result
}
