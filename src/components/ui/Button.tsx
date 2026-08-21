import Link from "next/link";
import type { ButtonHTMLAttributes, ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "secondary" | "ghost";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-accent text-background shadow-[0_10px_30px_rgb(34_211_238/0.18)] hover:bg-accent-strong",
  secondary: "border border-border bg-surface text-foreground hover:border-accent/50 hover:bg-surface-hover",
  ghost: "text-muted hover:bg-surface hover:text-foreground",
};

const base =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent active:scale-[0.98]";

export function Button({
  className,
  variant = "primary",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }) {
  return <button className={cn(base, variants[variant], className)} {...props} />;
}

export function ButtonLink({
  href,
  children,
  className,
  variant = "primary",
  ...props
}: {
  href: string;
  children: ReactNode;
  className?: string;
  variant?: ButtonVariant;
} & Omit<ComponentProps<typeof Link>, "href" | "className" | "children">) {
  return (
    <Link href={href} className={cn(base, variants[variant], className)} {...props}>
      {children}
    </Link>
  );
}
