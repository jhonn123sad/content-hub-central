import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Plus, Bookmark, Search, ExternalLink, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/empty-state";
import { FormDialog } from "@/components/form-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useReferences, useProjects, useCreateReference, useUpdateReference, useDeleteReference } from "@/hooks/use-database";

export const Route = createFileRoute("/references")({
  head: () => ({ meta: [{ title: "Referências — Central de Conteúdo" }] }),
  component: ReferencesPage,
});

function ReferencesPage() {
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [projectFilter, setProjectFilter] = useState("all");
 
  const { data: references = [], isLoading: isLoadingRefs } = useReferences();
  const { data: projects = [] } = useProjects();
  const createReference = useCreateReference();
  const updateReference = useUpdateReference();
  const deleteReference = useDeleteReference();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "video",
    url: "",
    image_url: "",
    project_id: "",
    notes: "",
  });

  const filtered = useMemo(() => {
    return references.filter((r) => {
      if (q && !r.title.toLowerCase().includes(q.toLowerCase())) return false;
      if (typeFilter !== "all" && r.type !== typeFilter) return false;
      if (projectFilter !== "all" && r.project_id !== projectFilter) return false;
      return true;
    });
  }, [references, q, typeFilter, projectFilter]);

  const handleSubmit = async () => {
    try {
      if (editingId) {
        await updateReference.mutateAsync({
          id: editingId,
          ...formData,
          project_id: formData.project_id || null,
        });
        toast.success("Referência atualizada!");
      } else {
        await createReference.mutateAsync({
          ...formData,
          project_id: formData.project_id || null,
        });
        toast.success("Referência salva!");
      }
      handleClose();
    } catch (error) {
      toast.error("Erro ao salvar referência");
    }
  };

  const handleEdit = (r: any) => {
    setEditingId(r.id);
    setFormData({
      title: r.title || "",
      description: r.description || "",
      type: r.type || "video",
      url: r.url || "",
      image_url: r.image_url || "",
      project_id: r.project_id || "",
      notes: r.notes || "",
    });
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Deseja excluir esta referência?")) {
      try {
        await deleteReference.mutateAsync(id);
        toast.success("Referência excluída");
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
      type: "video",
      url: "",
      image_url: "",
      project_id: "",
      notes: "",
    });
  };

  return (
    <div>
      <PageHeader
        title="Referências"
        description="Inspirações para seus conteúdos"
        action={
          <Button onClick={() => setOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Nova referência
          </Button>
        }
      />
      <div className="space-y-6 p-6">
        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar..."
              className="w-[240px] pl-9"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os tipos</SelectItem>
              <SelectItem value="video">Vídeo</SelectItem>
              <SelectItem value="post">Post</SelectItem>
              <SelectItem value="artigo">Artigo</SelectItem>
              <SelectItem value="imagem">Imagem</SelectItem>
              <SelectItem value="outro">Outro</SelectItem>
            </SelectContent>
          </Select>
          <Select value={projectFilter} onValueChange={setProjectFilter}>
            <SelectTrigger className="w-[200px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os projetos</SelectItem>
              {projects.map((p) => <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {isLoadingRefs ? (
          <div className="flex justify-center p-12">Carregando referências...</div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<Bookmark className="h-6 w-6" />}
            title="Sem referências"
            description="Salve inspirações para usar nos seus conteúdos."
            action={<Button onClick={() => setOpen(true)}><Plus className="mr-2 h-4 w-4" /> Nova referência</Button>}
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
             {filtered.map((r) => (
              <Card key={r.id} className="group transition-all hover:shadow-md">
                <CardContent className="space-y-2 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h3 className="font-semibold leading-tight">{r.title}</h3>
                      <Badge variant="outline" className="mt-1 text-[10px] uppercase font-bold">{r.type}</Badge>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 -mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(r)}>
                          <Pencil className="mr-2 h-4 w-4" /> Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(r.id)}>
                          <Trash2 className="mr-2 h-4 w-4" /> Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{r.description}</p>
                  {r.url && (
                    <a href={r.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
                      Abrir <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <FormDialog 
        open={open} 
        onOpenChange={(val) => !val && handleClose()} 
        title={editingId ? "Editar referência" : "Nova referência"}
        onSubmit={handleSubmit}>
        <Field label="Título"><Input value={formData.title} onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))} /></Field>
        <Field label="Descrição"><Textarea value={formData.description} onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))} /></Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Tipo">
            <Select value={formData.type} onValueChange={v => setFormData(prev => ({ ...prev, type: v }))}>
              <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="video">Vídeo</SelectItem>
                <SelectItem value="post">Post</SelectItem>
                <SelectItem value="artigo">Artigo</SelectItem>
                <SelectItem value="imagem">Imagem</SelectItem>
                <SelectItem value="outro">Outro</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Link"><Input value={formData.url} onChange={e => setFormData(prev => ({ ...prev, url: e.target.value }))} placeholder="https://..." /></Field>
        </div>
        <Field label="Imagem principal (URL)"><Input value={formData.image_url} onChange={e => setFormData(prev => ({ ...prev, image_url: e.target.value }))} placeholder="https://..." /></Field>
        <Field label="Projeto relacionado">
          <Select value={formData.project_id} onValueChange={v => setFormData(prev => ({ ...prev, project_id: v }))}>
            <SelectTrigger><SelectValue placeholder="—" /></SelectTrigger>
            <SelectContent>
              {projects.map((p) => <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>)}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Observações"><Textarea value={formData.notes} onChange={e => setFormData(prev => ({ ...prev, notes: e.target.value }))} /></Field>
      </FormDialog>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><Label>{label}</Label>{children}</div>;
}
