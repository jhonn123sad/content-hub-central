import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Plus, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/empty-state";
import { FormDialog } from "@/components/form-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreatives, useProjects, useContents, useCreateCreative } from "@/hooks/use-database";

export const Route = createFileRoute("/criativos")({
  head: () => ({ meta: [{ title: "Criativos — Central de Conteúdo" }] }),
  component: CreativesPage,
});

const types = ["thumbnail", "capa", "story", "reels", "post", "outro"];
const statuses = ["draft", "review", "approved", "published"];

function CreativesPage() {
  const [open, setOpen] = useState(false);
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [projectFilter, setProjectFilter] = useState("all");
  const [contentFilter, setContentFilter] = useState("all");

  const { data: creatives = [], isLoading: isLoadingCreatives } = useCreatives();
  const { data: projects = [] } = useProjects();
  const { data: contents = [] } = useContents();
  const createCreative = useCreateCreative();

  const [formData, setFormData] = useState({
    title: "",
    type: "thumbnail",
    status: "draft",
    project_id: "",
    content_id: "",
    file_url: "",
    image_url: "",
    description: "",
    notes: "",
  });

  const filtered = useMemo(() => creatives.filter((c) => {
    if (typeFilter !== "all" && c.type !== typeFilter) return false;
    if (statusFilter !== "all" && c.status !== statusFilter) return false;
    if (projectFilter !== "all" && c.project_id !== projectFilter) return false;
    if (contentFilter !== "all" && c.content_id !== contentFilter) return false;
    return true;
  }), [creatives, typeFilter, statusFilter, projectFilter, contentFilter]);

  const handleSubmit = async () => {
    try {
      await createCreative.mutateAsync({
        ...formData,
        project_id: formData.project_id || null,
        content_id: formData.content_id || null,
      });
      toast.success("Criativo salvo!");
      setOpen(false);
      setFormData({
        title: "",
        type: "thumbnail",
        status: "draft",
        project_id: "",
        content_id: "",
        file_url: "",
        image_url: "",
        description: "",
        notes: "",
      });
    } catch (error) {
      toast.error("Erro ao salvar criativo");
    }
  };

  return (
    <div>
      <PageHeader
        title="Criativos"
        description="Artes e peças visuais"
        action={<Button onClick={() => setOpen(true)}><Plus className="mr-2 h-4 w-4" /> Novo criativo</Button>}
      />
      <div className="space-y-6 p-6">
        <div className="flex flex-wrap gap-2">
          <FilterSelect value={typeFilter} onChange={setTypeFilter} options={[{ value: "all", label: "Todos os tipos" }, ...types.map((t) => ({ value: t, label: t }))]} />
          <FilterSelect value={statusFilter} onChange={setStatusFilter} options={[{ value: "all", label: "Todos status" }, ...statuses.map((s) => ({ value: s, label: s }))]} />
          <FilterSelect value={projectFilter} onChange={setProjectFilter} options={[{ value: "all", label: "Todos projetos" }, ...projects.map((p) => ({ value: p.id, label: p.title }))]} />
          <FilterSelect value={contentFilter} onChange={setContentFilter} options={[{ value: "all", label: "Todos conteúdos" }, ...contents.map((c) => ({ value: c.id, label: c.title }))]} />
        </div>

        {isLoadingCreatives ? (
          <div className="flex justify-center p-12">Carregando criativos...</div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<ImageIcon className="h-6 w-6" />}
            title="Nenhum criativo"
            description="Adicione thumbnails, capas e outras peças."
            action={<Button onClick={() => setOpen(true)}><Plus className="mr-2 h-4 w-4" /> Novo criativo</Button>}
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((c) => (
              <Card key={c.id}>
                <CardContent className="space-y-2 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold">{c.title}</h3>
                    <Badge variant="outline">{c.type}</Badge>
                  </div>
                  <Badge variant="secondary">{c.status}</Badge>
                  <p className="text-sm text-muted-foreground">{c.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <FormDialog open={open} onOpenChange={setOpen} title="Novo criativo"
        onSubmit={handleSubmit}>
        <Field label="Título"><Input value={formData.title} onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))} /></Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Tipo">
            <Select value={formData.type} onValueChange={v => setFormData(prev => ({ ...prev, type: v }))}>
              <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>{types.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
          <Field label="Status">
            <Select value={formData.status} onValueChange={v => setFormData(prev => ({ ...prev, status: v }))}>
              <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>{statuses.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Projeto relacionado">
            <Select value={formData.project_id} onValueChange={v => setFormData(prev => ({ ...prev, project_id: v }))}>
              <SelectTrigger><SelectValue placeholder="—" /></SelectTrigger>
              <SelectContent>{projects.map((p) => <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
          <Field label="Conteúdo relacionado">
            <Select value={formData.content_id} onValueChange={v => setFormData(prev => ({ ...prev, content_id: v }))}>
              <SelectTrigger><SelectValue placeholder="—" /></SelectTrigger>
              <SelectContent>{contents.map((c) => <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
        </div>
        <Field label="Link do arquivo"><Input value={formData.file_url} onChange={e => setFormData(prev => ({ ...prev, file_url: e.target.value }))} placeholder="https://drive..." /></Field>
        <Field label="Imagem principal (URL)"><Input value={formData.image_url} onChange={e => setFormData(prev => ({ ...prev, image_url: e.target.value }))} placeholder="https://..." /></Field>
        <Field label="Descrição"><Textarea value={formData.description} onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))} /></Field>
        <Field label="Observações"><Textarea value={formData.notes} onChange={e => setFormData(prev => ({ ...prev, notes: e.target.value }))} /></Field>
      </FormDialog>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><Label>{label}</Label>{children}</div>;
}

function FilterSelect({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
      <SelectContent>{options.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
    </Select>
  );
}
