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
import { mockContents, mockProjects } from "@/lib/mock-data";

export const Route = createFileRoute("/conteudos")({
  head: () => ({ meta: [{ title: "Conteúdos — Central de Conteúdo" }] }),
  component: ContentsPage,
});

function ContentsPage() {
  const [open, setOpen] = useState(false);
  const [project, setProject] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");
  const [format, setFormat] = useState<string>("all");
  const [platform, setPlatform] = useState<string>("all");

  const filtered = useMemo(() => {
    return mockContents.filter((c) => {
      if (project !== "all" && c.projectId !== project) return false;
      if (status !== "all" && c.status !== status) return false;
      if (format !== "all" && c.format !== format) return false;
      if (platform !== "all" && c.platform !== platform) return false;
      return true;
    });
  }, [project, status, format, platform]);

  const counts = useMemo(() => {
    const byStatus: Partial<Record<ContentStatus, number>> = {};
    for (const c of mockContents) byStatus[c.status] = (byStatus[c.status] || 0) + 1;
    return byStatus;
  }, []);

  const formats = Array.from(new Set(mockContents.map((c) => c.format)));
  const platforms = Array.from(new Set(mockContents.map((c) => c.platform)));

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
          <FilterSelect value={project} onChange={setProject} placeholder="Projeto"
            options={[{ value: "all", label: "Todos os projetos" }, ...mockProjects.map((p) => ({ value: p.id, label: p.name }))]} />
          <FilterSelect value={status} onChange={setStatus} placeholder="Status"
            options={[{ value: "all", label: "Todos status" }, ...contentStatusOptions]} />
          <FilterSelect value={format} onChange={setFormat} placeholder="Formato"
            options={[{ value: "all", label: "Todos formatos" }, ...formats.map((f) => ({ value: f, label: f }))]} />
          <FilterSelect value={platform} onChange={setPlatform} placeholder="Plataforma"
            options={[{ value: "all", label: "Todas plataformas" }, ...platforms.map((p) => ({ value: p, label: p }))]} />
        </div>

        {filtered.length === 0 ? (
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
                    <TableCell>{mockProjects.find((p) => p.id === c.projectId)?.name ?? "—"}</TableCell>
                    <TableCell><StatusBadge status={c.status} /></TableCell>
                    <TableCell>{c.format}</TableCell>
                    <TableCell>{c.platform}</TableCell>
                    <TableCell>{c.plannedDate}</TableCell>
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
        onSubmit={() => { toast.success("Conteúdo salvo (mock)"); setOpen(false); }}
      >
        <Field label="Título"><Input placeholder="Título do conteúdo" /></Field>
        <Field label="Descrição"><Textarea placeholder="Resumo" /></Field>
        <Field label="Roteiro / Copy"><Textarea rows={5} placeholder="Roteiro ou copy completo" /></Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Projeto relacionado">
            <Select>
              <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>
                {mockProjects.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Status">
            <Select>
              <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                {contentStatusOptions.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Formato"><Input placeholder="Reels, vídeo..." /></Field>
          <Field label="Plataforma"><Input placeholder="YouTube..." /></Field>
          <Field label="Prioridade">
            <Select>
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
          <Field label="Data planejada"><Input type="date" /></Field>
          <Field label="Data publicada"><Input type="date" /></Field>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Link do Drive"><Input placeholder="https://drive..." /></Field>
          <Field label="Link publicado"><Input placeholder="https://..." /></Field>
        </div>
        <Field label="Imagem principal (URL)"><Input placeholder="https://..." /></Field>
        <Field label="Observações"><Textarea placeholder="Notas internas" /></Field>
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
