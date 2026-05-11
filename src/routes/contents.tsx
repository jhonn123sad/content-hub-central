import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Plus, FileText } from "lucide-react";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import {
  StatusBadge,
  contentStatusOptions,
  type ContentStatus,
} from "@/components/status-badge";
import { useContents, useProjects, useCreateContent } from "@/hooks/use-database";

export const Route = createFileRoute("/contents")({
  head: () => ({ meta: [{ title: "Conteúdos — Central de Conteúdo" }] }),
  component: ContentsPage,
});

function ContentsPage() {
  const [open, setOpen] = useState(false);
  const [projectFilter, setProjectFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [formatFilter, setFormatFilter] = useState<string>("all");
  const [platformFilter, setPlatformFilter] = useState<string>("all");

  const { data: contents = [], isLoading: isLoadingContents } = useContents();
  const { data: projects = [] } = useProjects();
  const createContent = useCreateContent();

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
      return true;
    });
  }, [contents, projectFilter, statusFilter, formatFilter, platformFilter]);

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
      await createContent.mutateAsync({
        ...formData,
        project_id: formData.project_id || null,
      });
      toast.success("Conteúdo salvo!");
      setOpen(false);
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
    } catch (error) {
      toast.error("Erro ao salvar conteúdo");
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
            <Card key={s}>
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <StatusBadge status={s} />
                  <p className="mt-2 text-2xl font-semibold">{counts[s] ?? 0}</p>
                </div>
              </CardContent>
            </Card>
          ))}
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

        {isLoadingContents ? (
          <div className="flex justify-center p-12">Carregando conteúdos...</div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<FileText className="h-6 w-6" />}
            title="Nenhum conteúdo"
            description="Crie seu primeiro conteúdo ou ajuste os filtros."
            action={<Button onClick={() => setOpen(true)}><Plus className="mr-2 h-4 w-4" /> Novo conteúdo</Button>}
          />
        ) : (
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Projeto</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Formato</TableHead>
                  <TableHead>Plataforma</TableHead>
                  <TableHead>Data planejada</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">{c.title}</TableCell>
                    <TableCell>{projects.find((p) => p.id === c.project_id)?.title ?? "—"}</TableCell>
                    <TableCell><StatusBadge status={c.status as ContentStatus} /></TableCell>
                    <TableCell>{c.format}</TableCell>
                    <TableCell>{c.platform}</TableCell>
                    <TableCell>{c.planned_date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}
      </div>

      <FormDialog
        open={open}
        onOpenChange={setOpen}
        title="Novo conteúdo"
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
