import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "../../lib/utils"

const Accordion = ({ children, type = "single", collapsible = false, className, ...props }) => {
  const [openItems, setOpenItems] = React.useState(new Set())

  const toggleItem = (value) => {
    if (type === "single") {
      setOpenItems(openItems.has(value) && collapsible ? new Set() : new Set([value]))
    } else {
      const newItems = new Set(openItems)
      if (newItems.has(value)) {
        newItems.delete(value)
      } else {
        newItems.add(value)
      }
      setOpenItems(newItems)
    }
  }

  return (
    <div className={cn("w-full", className)} {...props}>
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child, {
              isOpen: openItems.has(child.props.value),
              toggle: () => toggleItem(child.props.value),
            })
          : child
      )}
    </div>
  )
}

const AccordionItem = React.forwardRef(({ className, value, isOpen, toggle, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("border-b border-neutral-200", className)}
    {...props}
  >
    {React.Children.map(children, (child) =>
      React.isValidElement(child)
        ? React.cloneElement(child, { isOpen, toggle })
        : child
    )}
  </div>
))
AccordionItem.displayName = "AccordionItem"

const AccordionTrigger = React.forwardRef(({ className, children, isOpen, toggle, ...props }, ref) => (
  <button
    ref={ref}
    onClick={toggle}
    className={cn(
      "flex w-full items-center justify-between py-5 text-left font-medium transition-all hover:text-neutral-600",
      className
    )}
    {...props}
  >
    {children}
    <ChevronDown
      className={cn(
        "h-4 w-4 shrink-0 transition-transform duration-200",
        isOpen && "rotate-180"
      )}
    />
  </button>
))
AccordionTrigger.displayName = "AccordionTrigger"

const AccordionContent = React.forwardRef(({ className, children, isOpen, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "overflow-hidden text-sm transition-all",
      isOpen ? "animate-slideDown" : "animate-slideUp hidden"
    )}
    {...props}
  >
    <div className={cn("pb-5 pt-0", className)}>{children}</div>
  </div>
))

AccordionContent.displayName = "AccordionContent"

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
