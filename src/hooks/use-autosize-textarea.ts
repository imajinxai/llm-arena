import { useLayoutEffect, useRef } from "react"

interface UseAutosizeTextAreaProps {
  ref: React.RefObject<HTMLTextAreaElement | null>
  maxHeight?: number
  borderWidth?: number
  dependencies: React.DependencyList
}

export function useAutosizeTextArea({
  ref,
  maxHeight = Number.MAX_SAFE_INTEGER,
  borderWidth = 0,
  dependencies,
}: UseAutosizeTextAreaProps) {
  const originalHeight = useRef<number | null>(null)
  const lastValueLength = useRef<number>(0)
  const isMaxed = useRef<boolean>(false)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return

    const value = el.value ?? ""
    const growing = value.length > lastValueLength.current
    lastValueLength.current = value.length

    // If already maxed and still growing, skip expensive measurement
    if (isMaxed.current && growing) return

    const borderAdjustment = borderWidth * 2

    if (originalHeight.current === null) {
      originalHeight.current = el.scrollHeight - borderAdjustment
    }

    // Use height:auto rather than removeProperty (less janky)
    el.style.height = "auto"

    const scrollHeight = el.scrollHeight
    const clampedToMax = Math.min(scrollHeight, maxHeight)
    const clampedToMin = Math.max(clampedToMax, originalHeight.current)

    el.style.height = `${clampedToMin + borderAdjustment}px`

    isMaxed.current = clampedToMax >= maxHeight
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maxHeight, ref, ...dependencies])
}
