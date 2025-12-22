import { cn } from "@/lib/utils";

interface MatchScoreProps {
  score: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export function MatchScore({ score, size = "md", showLabel = true }: MatchScoreProps) {
  const getScoreColor = (s: number) => {
    if (s >= 80) return "text-success";
    if (s >= 60) return "text-accent";
    if (s >= 40) return "text-warning";
    return "text-destructive";
  };

  const getScoreGradient = (s: number) => {
    if (s >= 80) return "from-success to-success/70";
    if (s >= 60) return "from-accent to-accent/70";
    if (s >= 40) return "from-warning to-warning/70";
    return "from-destructive to-destructive/70";
  };

  const sizes = {
    sm: { ring: "w-10 h-10", text: "text-xs", label: "text-[10px]" },
    md: { ring: "w-14 h-14", text: "text-sm", label: "text-xs" },
    lg: { ring: "w-20 h-20", text: "text-lg", label: "text-sm" },
  };

  return (
    <div className="flex flex-col items-center gap-1">
      <div 
        className={cn(
          "relative rounded-full flex items-center justify-center",
          sizes[size].ring
        )}
        style={{
          background: `conic-gradient(
            hsl(var(--${score >= 80 ? 'success' : score >= 60 ? 'accent' : score >= 40 ? 'warning' : 'destructive'})) ${score}%,
            hsl(var(--border)) ${score}%
          )`
        }}
      >
        <div className={cn(
          "absolute inset-1 bg-card rounded-full flex items-center justify-center",
        )}>
          <span className={cn("font-semibold", sizes[size].text, getScoreColor(score))}>
            {score}%
          </span>
        </div>
      </div>
      {showLabel && (
        <span className={cn("text-muted-foreground", sizes[size].label)}>
          Match
        </span>
      )}
    </div>
  );
}
