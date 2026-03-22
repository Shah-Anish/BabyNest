import * as React from "react"
import { cn } from "../../lib/utils"
import { AlertCircle, CheckCircle2, Info, XCircle } from "lucide-react"

const alertVariants = {
  default: {
    container: "bg-neutral-50 text-neutral-900 border-neutral-200",
    icon: Info,
    iconClass: "text-neutral-600"
  },
  success: {
    container: "bg-green-50 text-green-900 border-green-200",
    icon: CheckCircle2,
    iconClass: "text-green-600"
  },
  error: {
    container: "bg-red-50 text-red-900 border-red-200",
    icon: XCircle,
    iconClass: "text-red-600"
  },
  warning: {
    container: "bg-yellow-50 text-yellow-900 border-yellow-200",
    icon: AlertCircle,
    iconClass: "text-yellow-600"
  }
}

const Alert = React.forwardRef(({ className, variant = "default", children, ...props }, ref) => {
  const variantStyles = alertVariants[variant] || alertVariants.default
  const Icon = variantStyles.icon

  return (
    <div
      ref={ref}
      role="alert"
      className={cn(
        "relative w-full rounded-xl border px-4 py-3 text-sm flex items-start gap-3",
        variantStyles.container,
        className
      )}
      {...props}
    >
      <Icon className={cn("h-5 w-5 flex-shrink-0 mt-0.5", variantStyles.iconClass)} />
      <div className="flex-1">{children}</div>
    </div>
  )
})
Alert.displayName = "Alert"

export { Alert }
