import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/app/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-xl text-sm font-bold transition cursor-pointer disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/30",
  {
    variants: {
      variant: {
        default:
          "bg-indigo-600 text-white shadow-sm hover:bg-indigo-700",
        secondary:
          "bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200",
        outline:
          "border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50",
        ghost: "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
        destructive: "text-rose-600 hover:text-rose-800 hover:bg-rose-50",
        link: "text-indigo-600 underline-offset-4 hover:underline p-0 h-auto",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3.5 py-1.5",
        lg: "h-11 px-5 py-2.5",
        icon: "h-10 w-10 p-0",
        "icon-sm": "h-9 w-9 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, type = "button", ...props }, ref) => {
    return (
      <button
        type={type}
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
