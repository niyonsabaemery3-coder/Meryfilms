// Lightweight class-name combiner (shadcn convention: @/lib/utils -> cn).
// Kept dependency-free (no clsx/tailwind-merge) to match this project's
// minimal footprint — good enough since we never pass conflicting
// Tailwind utilities to the same element here.
export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ')
}
