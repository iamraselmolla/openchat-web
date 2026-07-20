import { Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function ModelBadge({ model }: { model: string }) {
  return (
    <Badge variant="accent" className="font-mono">
      <Sparkles className="h-3 w-3" />
      {model}
    </Badge>
  );
}
