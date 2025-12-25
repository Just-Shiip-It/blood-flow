import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const commonClasses = cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-lg font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
      {
        "bg-primary text-primary-foreground hover:opacity-90 shadow-sm": variant === "default",
        "bg-destructive text-destructive-foreground hover:bg-destructive/90": variant === "destructive",
        "border border-input bg-background hover:bg-accent hover:text-accent-foreground": variant === "outline",
        "bg-secondary text-secondary-foreground hover:bg-secondary/80": variant === "secondary",
        "hover:bg-accent hover:text-accent-foreground": variant === "ghost",
        "text-primary underline-offset-4 hover:underline": variant === "link",
      },
      {
        "h-10 px-4 py-2": size === "default",
        "h-9 px-3 text-sm": size === "sm",
        "h-11 px-8 text-base": size === "lg",
        "h-10 w-10": size === "icon",
      },
      className
    );

    if (asChild) {
      const children = React.Children.toArray(props.children);
      if (children.length !== 1) {
        throw new Error("Button with asChild must have exactly one child");
      }
      
      const child = children[0] as React.ReactElement<{ className?: string }>;
      
      // Filter out children from props to avoid overwriting the child's content
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { children: _, ...restProps } = props;

      return React.cloneElement(child, {
        className: cn(commonClasses, child.props.className),
        ...restProps,
      } as React.HTMLAttributes<HTMLElement>);
    }

    return (
      <button
        className={commonClasses}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
