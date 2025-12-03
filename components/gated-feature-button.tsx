// components/gated-feature-button.tsx
import Link from "next/link";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type GatedFeatureButtonProps = {
  allowed: boolean;
  href: string;
  label: string;
  className?: string;
};

export function GatedFeatureButton({
  allowed,
  href,
  label,
  className,
}: GatedFeatureButtonProps) {
  if (!allowed) {
    return (
      <Button
        size="sm"
        variant="outline"
        disabled
        className={cn(
          "opacity-60 cursor-not-allowed flex items-center gap-1",
          className
        )}
      >
        <Lock className="h-3 w-3" />
        <span>{label}</span>
        <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
          Coming soon
        </span>
      </Button>
    );
  }

  return (
    <Button
      asChild
      size="sm"
      variant="default"
      className={cn("flex items-center gap-1", className)}
    >
      <Link href={href}>{label}</Link>
    </Button>
  );
}