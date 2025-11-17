import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ScoreBadgeProps {
  score: number;
  maxScore?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const ScoreBadge = ({ score, maxScore = 5, size = "md", className }: ScoreBadgeProps) => {
  const percentage = (score / maxScore) * 100;
  
  const getVariant = () => {
    if (percentage >= 80) return "default";
    if (percentage >= 60) return "secondary";
    return "destructive";
  };

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "text-xs px-2 py-1";
      case "lg":
        return "text-lg px-4 py-2";
      default:
        return "text-sm px-3 py-1.5";
    }
  };

  return (
    <Badge 
      variant={getVariant()} 
      className={cn(
        "font-semibold",
        getSizeClasses(),
        className
      )}
    >
      {score}/{maxScore}
    </Badge>
  );
};

export default ScoreBadge;
