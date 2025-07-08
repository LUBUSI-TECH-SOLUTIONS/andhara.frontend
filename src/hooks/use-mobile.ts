import * as React from "react"

const MOBILE_BREAKPOINT = 920

/**
 * Custom React hook that detects whether the current viewport width
 * is considered mobile based on a predefined breakpoint.
 *
 * @returns {boolean} `true` if the viewport width is below the mobile breakpoint, otherwise `false`.
 *
 * @example
 * const isMobile = useIsMobile();
 * if (isMobile) {
 *   // Render mobile layout
 * } else {
 *   // Render desktop layout
 * }
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)

    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }

    mql.addEventListener("change", onChange)

    // Set initial state
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)

    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}
