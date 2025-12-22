import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: ReactNode;
  variant?: "default" | "primary" | "accent" | "success";
}

export function StatCard({ title, value, change, icon, variant = "default" }: StatCardProps) {
  const isPositive = change && change > 0;
  
  return (
    <div className="card-interactive p-6 animate-fade-in">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="font-heading text-3xl font-semibold text-foreground">{value}</p>
          {change !== undefined && (
            <div className={cn(
              "flex items-center gap-1 text-sm font-medium",
              isPositive ? "text-success" : "text-destructive"
            )}>
              {isPositive ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              <span>{Math.abs(change)}% from last month</span>
            </div>
          )}
        </div>
        <div className={cn(
          "flex h-12 w-12 items-center justify-center rounded-xl",
          variant === "primary" && "bg-primary/10 text-primary",
          variant === "accent" && "bg-accent/10 text-accent",
          variant === "success" && "bg-success/10 text-success",
          variant === "default" && "bg-secondary text-muted-foreground"
        )}>
          {icon}
        </div>
      </div>
    </div>
  );
}
