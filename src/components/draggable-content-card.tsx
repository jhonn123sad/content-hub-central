import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge, type ContentStatus } from "@/components/status-badge";
import { GripVertical, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Content } from "@/hooks/use-database";

interface DraggableContentCardProps {
  content: Content;
  onEdit: (content: Content) => void;
  onDelete: (id: string) => void;
  projectName?: string;
}

export function DraggableContentCard({
  content,
  onEdit,
  onDelete,
  projectName,
}: DraggableContentCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: content.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="touch-none">
      <Card className="group relative transition-all hover:shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-start gap-2">
            <div
              {...attributes}
              {...listeners}
              className="mt-1 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
            >
              <GripVertical className="h-4 w-4" />
            </div>
            
            <div className="flex-1 space-y-1">
              <div className="flex items-start justify-between">
                <h4 className="font-medium text-sm leading-tight pr-6">{content.title}</h4>
                <div className="absolute top-2 right-2">
                   <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreVertical className="h-3.5 w-3.5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(content)}>
                        <Pencil className="mr-2 h-3.5 w-3.5" /> Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive" onClick={() => onDelete(content.id)}>
                        <Trash2 className="mr-2 h-3.5 w-3.5" /> Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              
              {projectName && (
                <p className="text-[10px] font-semibold text-primary uppercase tracking-wider">
                  {projectName}
                </p>
              )}
              
              <div className="flex flex-wrap gap-1.5 pt-1">
                <StatusBadge status={content.status as ContentStatus} />
                {content.platform && (
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4">
                    {content.platform}
                  </Badge>
                )}
                {content.format && (
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
                    {content.format}
                  </Badge>
                )}
              </div>
              
              {content.planned_date && (
                <p className="text-[10px] text-muted-foreground pt-1">
                  📅 {new Date(content.planned_date).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
