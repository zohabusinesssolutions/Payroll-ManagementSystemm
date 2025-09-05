import { cn } from "@/lib/utils"
import { Loader2 } from 'lucide-react'

interface LoaderWrapperProps {
  loading: boolean
  children: React.ReactNode
  className?: string
  loadingText?: string
  minHeight?: string
  showSpinner?: boolean
  overlay?: boolean
}

export function AdminityLoader({
  loading,
  children,
  className,
  loadingText = "Loading...",
  minHeight = "min-h-[400px]",
  showSpinner = true,
  overlay = false,
}: LoaderWrapperProps) {
  if (overlay) {
    return (
      <div className={cn("relative", className)}>
        {children}
        {loading && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="flex flex-col items-center space-y-4">
              {showSpinner && (
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              )}
              <p className="text-sm text-muted-foreground font-medium">
                {loadingText}
              </p>
            </div>
          </div>
        )}
      </div>
    )
  }

  if (loading) {
    return (
      <div className={cn(
        "flex items-center justify-center",
        minHeight,
        className
      )}>
        <div className="flex flex-col items-center space-y-4">
          {showSpinner && (
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          )}
          <p className="text-sm text-muted-foreground font-medium">
            {loadingText}
          </p>
        </div>
      </div>
    )
  }

  return <div className={className}>{children}</div>
}
