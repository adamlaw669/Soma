import { cn } from "@/lib/utils"

interface SomaLogoProps {
  className?: string
  /** Icon-mark size in px. Defaults to 22. */
  size?: number
  /** Show the "Soma" wordmark next to the icon. */
  wordmark?: boolean
  /** Extra classes for the wordmark. */
  wordmarkClassName?: string
}

/**
 * Soma logo mark — outlined aperture with a filled inner dot.
 * Uses currentColor for both stroke and fill, so wrap in a coloured element
 * (e.g. `text-primary`) to theme it.
 */
export function SomaLogo({
  className,
  size = 22,
  wordmark = false,
  wordmarkClassName,
}: SomaLogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M 13.5 3.15 A 9 9 0 1 1 10.5 3.15"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <circle cx="12" cy="12" r="3.5" fill="currentColor" />
      </svg>
      {wordmark && (
        <span
          className={cn(
            "text-lg font-semibold tracking-tight text-foreground",
            wordmarkClassName,
          )}
        >
          Soma
        </span>
      )}
    </span>
  )
}
