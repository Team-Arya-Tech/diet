import { cn } from '@/lib/utils'

function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="skeleton"
      className={cn('bg-accent/40 animate-pulse rounded-xl shadow-[0_1px_8px_0_rgba(220,150,80,0.07)] relative overflow-hidden', className)}
      {...props}
    >
      {/* Ayurveda leaf accent, floating in skeleton */}
      <svg
        className="absolute bottom-1 right-1 w-6 h-6 opacity-10 text-primary animate-float"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        style={{ pointerEvents: 'none' }}
      >
        <path d="M12 2C12 2 20 8 20 14C20 18 16 22 12 22C8 22 4 18 4 14C4 8 12 2 12 2Z" />
        <path d="M12 8V14" />
      </svg>
    </div>
  )
}

export { Skeleton }
