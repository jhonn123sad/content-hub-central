import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Plus, FileText, Filter, LayoutGrid, List, Search, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/empty-state";
import { FormDialog } from "@/components/form-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";

import {
  StatusBadge,
  contentStatusOptions,
  type ContentStatus,
} from "@/components/status-badge";
import { useContents, useProjects, useCreateContent, useUpdateContent, useDeleteContent } from "@/hooks/use-database";
import { DraggableContentCard } from "@/components/draggable-content-card";

export const Route = createFileRoute("/contents")({
  head: () => ({ meta: [{ title: "Conteúdos — Central de Conteúdo" }] }),
  component: ContentsPage,
});

function ContentsPage() {
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [projectFilter, setProjectFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [formatFilter, setFormatFilter] = useState<string>("all");
  const [platformFilter, setPlatformFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");

  const { data: contents = [], isLoading: isLoadingContents } = useContents();
  const { data: projects = [] } = useProjects();
  const createContent = useCreateContent();
  const updateContent = useUpdateContent();
  const deleteContent = useDeleteContent();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    script_or_copy: "",
    project_id: "",
    status: "idea",
    format: "",
    platform: "",
    priority: "medium",
    planned_date: "",
    published_date: "",
    drive_url: "",
    published_url: "",
    image_url: "",
    notes: "",
  });

  const filtered = useMemo(() => {
    return contents.filter((c) => {
      if (projectFilter !== "all" && c.project_id !== projectFilter) return false;
      if (statusFilter !== "all" && c.status !== statusFilter) return false;
      if (formatFilter !== "all" && c.format !== formatFilter) return false;
      if (platformFilter !== "all" && c.platform !== platformFilter) return false;
      if (searchQuery && !c.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [contents, projectFilter, statusFilter, formatFilter, platformFilter, searchQuery]);

  const counts = useMemo(() => {
    const byStatus: Partial<Record<ContentStatus, number>> = {};
    for (const c of contents) {
      const s = c.status as ContentStatus;
      byStatus[s] = (byStatus[s] || 0) + 1;
    }
    return byStatus;
  }, [contents]);

  const formats = Array.from(new Set(contents.map((c) => c.format).filter(Boolean)));
  const platforms = Array.from(new Set(contents.map((c) => c.platform).filter(Boolean)));

  const handleSubmit = async () => {
    try {
      if (editingId) {
        await updateContent.mutateAsync({
          id: editingId,
          ...formData,
          project_id: formData.project_id || null,
        });
        toast.success("Conteúdo atualizado!");
      } else {
        await createContent.mutateAsync({
          ...formData,
          project_id: formData.project_id || null,
          sort_order: contents.length,
        });
        toast.success("Conteúdo criado!");
      }
      handleClose();
    } catch (error) {
      toast.error("Erro ao salvar conteúdo");
    }
  };

  const handleEdit = (c: any) => {
    setEditingId(c.id);
    setFormData({
      title: c.title || "",
      description: c.description || "",
      script_or_copy: c.script_or_copy || "",
      project_id: c.project_id || "",
      status: c.status || "idea",
      format: c.format || "",
      platform: c.platform || "",
      priority: c.priority || "medium",
      planned_date: c.planned_date || "",
      published_date: c.published_date || "",
      drive_url: c.drive_url || "",
      published_url: c.published_url || "",
      image_url: c.image_url || "",
      notes: c.notes || "",
    });
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Deseja excluir este conteúdo?")) {
      try {
        await deleteContent.mutateAsync(id);
        toast.success("Conteúdo excluído");
      } catch (error) {
        toast.error("Erro ao excluir");
      }
    }
  };

  const handleClose = () => {
    setOpen(false);
    setEditingId(null);
    setFormData({
      title: "",
      description: "",
      script_or_copy: "",
      project_id: "",
      status: "idea",
      format: "",
      platform: "",
      priority: "medium",
      planned_date: "",
      published_date: "",
      drive_url: "",
      published_url: "",
      image_url: "",
      notes: "",
    });
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = contents.findIndex((c) => c.id === active.id);
      const newIndex = contents.findIndex((c) => c.id === over.id);
      
      const newOrder = arrayMove(contents, oldIndex, newIndex);
      
      // Update local state optimistic (via TanStack Query cache preferably, but here we just wait for the update)
      // Actually we should update the sort_order in the database
      try {
        const item = contents[oldIndex];
        // For simplicity in MVP, we just update the specific item's order or all if needed.
        // A better way is to update all affected items, but let's do a simple update for now.
        await updateContent.mutateAsync({
          id: item.id,
          sort_order: newIndex
        });
      } catch (error) {
        toast.error("Erro ao reordenar");
      }
    }
  };

  return (
    <div>
      <PageHeader
        title="Conteúdos"
        description="Pipeline de produção"
        action={
          <Button onClick={() => setOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Novo conteúdo
          </Button>
        }
      />
      <div className="space-y-6 p-6">
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {(["idea", "draft", "editing", "ready", "published"] as ContentStatus[]).map((s) => (
            <Card key={s} className="bg-muted/30 border-dashed">
              <CardContent className="flex items-center justify-between p-3">
                <StatusBadge status={s} />
                <span className="text-xl font-bold opacity-50">{counts[s] ?? 0}</span>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-1 items-center gap-2 max-w-md">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar conteúdo..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex border rounded-md p-1">
                <Button 
                  variant={viewMode === "kanban" ? "secondary" : "ghost"} 
                  size="sm" 
                  className="h-8 w-8 p-0"
                  onClick={() => setViewMode("kanban")}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button 
                  variant={viewMode === "list" ? "secondary" : "ghost"} 
                  size="sm" 
                  className="h-8 w-8 p-0"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <FilterSelect value={projectFilter} onChange={setProjectFilter} placeholder="Projeto"
              options={[{ value: "all", label: "Todos os projetos" }, ...projects.map((p) => ({ value: p.id, label: p.title }))]} />
            <FilterSelect value={statusFilter} onChange={setStatusFilter} placeholder="Status"
              options={[{ value: "all", label: "Todos status" }, ...contentStatusOptions]} />
            <FilterSelect value={formatFilter} onChange={setFormatFilter} placeholder="Formato"
              options={[{ value: "all", label: "Todos formatos" }, ...formats.map((f) => ({ value: f!, label: f! }))]} />
            <FilterSelect value={platformFilter} onChange={setPlatformFilter} placeholder="Plataforma"
              options={[{ value: "all", label: "Todas plataformas" }, ...platforms.map((p) => ({ value: p!, label: p! }))]} />
          </div>
        </div>

        {isLoadingContents ? (
          <div className="flex justify-center p-12">Carregando conteúdos...</div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<FileText className="h-6 w-6" />}
            title="Nenhum conteúdo"
            description="Crie seu primeiro conteúdo ou ajuste os filtros."
            action={<Button onClick={() => setOpen(true)}><Plus className="mr-2 h-4 w-4" /> Novo conteúdo</Button>}
          />
        ) : viewMode === "kanban" ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 h-full items-start">
            {(["idea", "draft", "editing", "ready", "published"] as ContentStatus[]).map((status) => {
              const statusItems = filtered.filter((c) => c.status === status);
              return (
                <div key={status} className="flex flex-col gap-3 min-h-[500px] bg-muted/20 rounded-xl p-3 border">
                  <div className="flex items-center justify-between mb-1 px-1">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-primary/40" />
                      {contentStatusOptions.find(o => o.value === status)?.label}
                    </h3>
                    <span className="text-[10px] font-bold bg-muted px-1.5 py-0.5 rounded text-muted-foreground">
                      {statusItems.length}
                    </span>
                  </div>
                  
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                    modifiers={[restrictToVerticalAxis]}
                  >
                    <SortableContext
                      items={statusItems.map(i => i.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="space-y-3">
                        {statusItems.map((c) => (
                          <DraggableContentCard
                            key={c.id}
                            content={c as any}
                            projectName={projects.find(p => p.id === c.project_id)?.title}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                  
                  {statusItems.length === 0 && (
                    <div className="flex-1 flex items-center justify-center border-2 border-dashed rounded-lg p-4">
                      <p className="text-[10px] text-muted-foreground text-center">Arraste para cá ou crie novo</p>
                    </div>
                  )}
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full justify-start text-muted-foreground hover:text-foreground text-xs h-8"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, status }));
                      setOpen(true);
                    }}
                  >
                    <Plus className="mr-2 h-3 w-3" /> Novo
                  </Button>
                </div>
              );
            })}
          </div>
        ) : (
          <Card className="overflow-hidden border-none shadow-sm">
            {/* List View logic remains similar but simplified */}
            <div className="divide-y bg-card border rounded-lg">
               {filtered.map((c) => (
                <div key={c.id} className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="flex flex-col">
                      <span className="font-medium">{c.title}</span>
                      <span className="text-xs text-muted-foreground">
                        {projects.find(p => p.id === c.project_id)?.title ?? "Sem projeto"} · {c.platform ?? "—"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="hidden sm:block">
                      <StatusBadge status={c.status as ContentStatus} />
                    </div>
                    <div className="text-xs text-muted-foreground w-24 hidden md:block">
                      {c.planned_date ?? "—"}
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(c)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(c.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>

      <FormDialog
        open={open}
        onOpenChange={(val) => !val && handleClose()}
        title={editingId ? "Editar conteúdo" : "Novo conteúdo"}
        onSubmit={handleSubmit}
      >
        <Field label="Título"><Input value={formData.title} onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))} placeholder="Título do conteúdo" /></Field>
        <Field label="Descrição"><Textarea value={formData.description} onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))} placeholder="Resumo" /></Field>
        <Field label="Roteiro / Copy"><Textarea rows={5} value={formData.script_or_copy} onChange={e => setFormData(prev => ({ ...prev, script_or_copy: e.target.value }))} placeholder="Roteiro ou copy completo" /></Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Projeto relacionado">
            <Select value={formData.project_id} onValueChange={v => setFormData(prev => ({ ...prev, project_id: v }))}>
              <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>
                {projects.map((p) => <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Status">
            <Select value={formData.status} onValueChange={v => setFormData(prev => ({ ...prev, status: v }))}>
              <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                {contentStatusOptions.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Formato"><Input value={formData.format} onChange={e => setFormData(prev => ({ ...prev, format: e.target.value }))} placeholder="Reels, vídeo..." /></Field>
          <Field label="Plataforma"><Input value={formData.platform} onChange={e => setFormData(prev => ({ ...prev, platform: e.target.value }))} placeholder="YouTube..." /></Field>
          <Field label="Prioridade">
            <Select value={formData.priority} onValueChange={v => setFormData(prev => ({ ...prev, priority: v }))}>
              <SelectTrigger><SelectValue placeholder="—" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Baixa</SelectItem>
                <SelectItem value="medium">Média</SelectItem>
                <SelectItem value="high">Alta</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Data planejada"><Input type="date" value={formData.planned_date} onChange={e => setFormData(prev => ({ ...prev, planned_date: e.target.value }))} /></Field>
          <Field label="Data publicada"><Input type="date" value={formData.published_date} onChange={e => setFormData(prev => ({ ...prev, published_date: e.target.value }))} /></Field>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Link do Drive"><Input value={formData.drive_url} onChange={e => setFormData(prev => ({ ...prev, drive_url: e.target.value }))} placeholder="https://drive..." /></Field>
          <Field label="Link publicado"><Input value={formData.published_url} onChange={e => setFormData(prev => ({ ...prev, published_url: e.target.value }))} placeholder="https://..." /></Field>
        </div>
        <Field label="Imagem principal (URL)"><Input value={formData.image_url} onChange={e => setFormData(prev => ({ ...prev, image_url: e.target.value }))} placeholder="https://..." /></Field>
        <Field label="Observações"><Textarea value={formData.notes} onChange={e => setFormData(prev => ({ ...prev, notes: e.target.value }))} placeholder="Notas internas" /></Field>
      </FormDialog>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><Label>{label}</Label>{children}</div>;
}

function FilterSelect({
  value, onChange, options, placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder: string;
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[180px]"><SelectValue placeholder={placeholder} /></SelectTrigger>
      <SelectContent>
        {options.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
      </SelectContent>
    </Select>
  );
}
