import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, FolderKanban, Pencil, Trash2, Globe, MoreVertical } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useProjects, useCreateProject, useUpdateProject, useDeleteProject } from "@/hooks/use-database";

export const Route = createFileRoute("/projects")({
  head: () => ({ meta: [{ title: "Projetos — Central de Conteúdo" }] }),
  component: ProjectsPage,
});

function ProjectsPage() {
  const [open, setOpen] = useState(false);
  const { data: projects = [], isLoading } = useProjects();
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();

  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    objective: "",
    niche: "",
    main_platform: "",
    status: "active",
    daily_content_goal: "0",
    drive_url: "",
    start_date: "",
  });

  const handleSubmit = async () => {
    try {
      if (editingId) {
        await updateProject.mutateAsync({
          id: editingId,
          ...formData,
          daily_content_goal: parseInt(formData.daily_content_goal) || 0,
        });
        toast.success("Projeto atualizado!");
      } else {
        await createProject.mutateAsync({
          ...formData,
          daily_content_goal: parseInt(formData.daily_content_goal) || 0,
        });
        toast.success("Projeto criado!");
      }
      handleClose();
    } catch (error) {
      toast.error("Erro ao salvar projeto");
    }
  };

  const handleEdit = (p: any) => {
    setEditingId(p.id);
    setFormData({
      title: p.title || "",
      description: p.description || "",
      objective: p.objective || "",
      niche: p.niche || "",
      main_platform: p.main_platform || "",
      status: p.status || "active",
      daily_content_goal: String(p.daily_content_goal || 0),
      drive_url: p.drive_url || "",
      start_date: p.start_date || "",
    });
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este projeto?")) {
      try {
        await deleteProject.mutateAsync(id);
        toast.success("Projeto excluído");
      } catch (error) {
        toast.error("Erro ao excluir projeto");
      }
    }
  };

  const handleClose = () => {
    setOpen(false);
    setEditingId(null);
    setFormData({
      title: "",
      description: "",
      objective: "",
      niche: "",
      main_platform: "",
      status: "active",
      daily_content_goal: "0",
      drive_url: "",
      start_date: "",
    });
  };

  return (
    <div>
      <PageHeader
        title="Projetos"
        description="Organize seus canais e iniciativas de conteúdo"
        action={
          <Button onClick={() => setOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Novo projeto
          </Button>
        }
      />
      <div className="p-6">
        {isLoading ? (
          <div className="flex justify-center p-12">Carregando projetos...</div>
        ) : projects.length === 0 ? (
          <EmptyState
            icon={<FolderKanban className="h-6 w-6" />}
            title="Nenhum projeto ainda"
            description="Crie seu primeiro projeto para começar a organizar conteúdos."
            action={
              <Button onClick={() => setOpen(true)}>
                <Plus className="mr-2 h-4 w-4" /> Novo projeto
              </Button>
            }
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <Card key={p.id} className="group overflow-hidden transition-all hover:shadow-md">
                <CardContent className="space-y-3 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg leading-tight">{p.title}</h3>
                      <p className="text-xs font-medium text-primary mt-1">{p.niche}</p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 -mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(p)}>
                          <Pencil className="mr-2 h-4 w-4" /> Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(p.id)}>
                          <Trash2 className="mr-2 h-4 w-4" /> Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  <p className="text-sm text-muted-foreground line-clamp-2 h-10">
                    {p.description || "Sem descrição"}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 pt-2">
                    <Badge variant="secondary" className="text-[10px] uppercase font-bold">
                      {p.main_platform}
                    </Badge>
                    <Badge variant={p.status === "active" ? "default" : "outline"} className="text-[10px] uppercase font-bold">
                      {p.status === "active" ? "Ativo" : p.status === "paused" ? "Pausado" : "Arquivado"}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Globe className="h-3 w-3" />
                      <span>{p.daily_content_goal}/dia</span>
                    </div>
                    <span>Desde {p.start_date ? new Date(p.start_date).toLocaleDateString() : "—"}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <FormDialog
        open={open}
        onOpenChange={(val) => !val && handleClose()}
        title={editingId ? "Editar projeto" : "Novo projeto"}
        description="Defina os dados principais do projeto"
        onSubmit={handleSubmit}
      >
        <Field label="Nome">
          <Input 
            value={formData.title} 
            onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Ex: Canal de tecnologia" 
          />
        </Field>
        <Field label="Descrição">
          <Textarea 
            value={formData.description} 
            onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Sobre o que é este projeto" 
          />
        </Field>
        <Field label="Objetivo">
          <Input 
            value={formData.objective} 
            onChange={e => setFormData(prev => ({ ...prev, objective: e.target.value }))}
            placeholder="Ex: 10k inscritos em 6 meses" 
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nicho">
            <Input 
              value={formData.niche} 
              onChange={e => setFormData(prev => ({ ...prev, niche: e.target.value }))}
              placeholder="Tecnologia, finanças..." 
            />
          </Field>
          <Field label="Plataforma principal">
            <Select 
              value={formData.main_platform} 
              onValueChange={v => setFormData(prev => ({ ...prev, main_platform: v }))}
            >
              <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="youtube">YouTube</SelectItem>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="tiktok">TikTok</SelectItem>
                <SelectItem value="linkedin">LinkedIn</SelectItem>
                <SelectItem value="outro">Outro</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Status">
            <Select 
              value={formData.status} 
              onValueChange={v => setFormData(prev => ({ ...prev, status: v }))}
            >
              <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Ativo</SelectItem>
                <SelectItem value="paused">Pausado</SelectItem>
                <SelectItem value="archived">Arquivado</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Meta diária de conteúdos">
            <Input 
              type="number" 
              min={0} 
              value={formData.daily_content_goal} 
              onChange={e => setFormData(prev => ({ ...prev, daily_content_goal: e.target.value }))}
              placeholder="0" 
            />
          </Field>
        </div>
        <Field label="Link do Drive">
          <Input 
            value={formData.drive_url} 
            onChange={e => setFormData(prev => ({ ...prev, drive_url: e.target.value }))}
            placeholder="https://drive.google.com/..." 
          />
        </Field>
        <Field label="Data de início">
          <Input 
            type="date" 
            value={formData.start_date} 
            onChange={e => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
          />
        </Field>
      </FormDialog>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
