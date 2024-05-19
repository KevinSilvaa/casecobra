import { cn } from '@/utils/cn'

type MaxWidthWrapperProps = {
  className?: string
  children: React.ReactNode
}

export function MaxWidthWrapper({ className, children }: MaxWidthWrapperProps) {
  return (
    <div
      className={cn(
        'mx-auto size-full max-w-screen-2xl px-2.5 md:px-20',
        className,
      )}
    >
      {children}
    </div>
  )
}
