import React, { useEffect } from "react"
import qs from "qs"

export type HistoryOptions = "replace" | "push"

export interface UseQueryStateOptions<T> {
  /**
   * The operation to use on state updates. Defaults to `replace`.
   */
  history?: HistoryOptions
}

export function useQueryState<T = string>(
  key: string,
  { defaultValue = undefined }: Partial<UseQueryStateOptions<T>> & { defaultValue?: T } = {
    history: "replace",
    defaultValue: undefined,
  }
): [T | null, (value: T) => void] {
  const [value, setValue] = React.useState<T | null>(defaultValue ?? null)

  const update = (newValue: T) => {
    const query = qs.parse(window.location.search, {
      ignoreQueryPrefix: true,
    })

    if (
      newValue === null ||
      newValue === undefined ||
      (typeof newValue === "string" && newValue.length === 0) ||
      (Array.isArray(newValue) && newValue.length === 0)
    ) {
      delete query[key]
    } else {
      query[key] = newValue
    }

    const search = qs.stringify(query, { addQueryPrefix: true })
    window.history.replaceState({}, undefined, `${window.location.pathname}${search}${window.location.hash}`)

    setValue(newValue)
  }

  useEffect(() => {
    if (typeof window === "undefined") {
      return null
    }

    const v = qs.parse(window.location.search, { ignoreQueryPrefix: true })[key] ?? defaultValue ?? null

    value === v ? null : setValue(v)
  }, [])

  return [value ?? defaultValue ?? null, update]
}
