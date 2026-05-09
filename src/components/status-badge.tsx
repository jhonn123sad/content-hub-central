import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type ContentStatus =
  | "idea"
  | "draft"
  | "material_separated"
  | "recording"
  | "editing"
  | "review"
  | "ready"
  | "scheduled"
  | "published"
  | "archived";

const labels: Record<ContentStatus, string> = {
  idea: "Ideia",
  draft: "Rascunho",
  material_separated: "Material separado",
  recording: "Gravando",
  editing: "Editando",
  review: "Revisão",
  ready: "Pronto",
  scheduled: "Agendado",
  published: "Publicado",
  archived: "Arquivado",
};

const styles: Record<ContentStatus, string> = {
  idea: "bg-muted text-muted-foreground",
  draft: "bg-secondary text-secondary-foreground",
  material_separated: "bg-info/15 text-info",
  recording: "bg-warning/20 text-warning-foreground",
  editing: "bg-warning/20 text-warning-foreground",
  review: "bg-accent text-accent-foreground",
  ready: "bg-success/20 text-success",
  scheduled: "bg-info/20 text-info",
  published: "bg-success text-success-foreground",
  archived: "bg-muted text-muted-foreground",
};

export function StatusBadge({ status }: { status: ContentStatus }) {
  return (
    <Badge variant="outline" className={cn("border-transparent", styles[status])}>
      {labels[status]}
    </Badge>
  );
}

export const contentStatusOptions: { value: ContentStatus; label: string }[] = (
  Object.keys(labels) as ContentStatus[]
).map((value) => ({ value, label: labels[value] }));
