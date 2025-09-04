import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { updateFreelancer } from "@/lib/api";
import { insertFreelancerSchema, type InsertFreelancer, type Freelancer } from "@shared/schema";
import { Edit, Save } from "lucide-react";

interface EditModalProps {
  freelancer: Freelancer;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EditModal({ freelancer, open, onOpenChange }: EditModalProps) {
  const { toast } = useToast();
  
  const form = useForm<InsertFreelancer>({
    resolver: zodResolver(insertFreelancerSchema),
    defaultValues: {
      nome: freelancer.nome,
      servico: freelancer.servico,
      email: freelancer.email || "",
      preco_hora: freelancer.preco_hora || undefined,
      localizacao: freelancer.localizacao || ""
    }
  });

  const updateMutation = useMutation({
    mutationFn: (data: InsertFreelancer) => updateFreelancer(freelancer.id, data),
    onSuccess: () => {
      toast({
        title: "Sucesso!",
        description: "Freelancer atualizado com sucesso!",
        variant: "default"
      });
      onOpenChange(false);
      queryClient.invalidateQueries({ queryKey: ["/api/freelancers"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao atualizar freelancer",
        variant: "destructive"
      });
    }
  });

  const onSubmit = (data: InsertFreelancer) => {
    updateMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" data-testid="modal-edit">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Edit className="text-[var(--sunset-orange)] mr-2" />
            Editar Freelancer
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nome */}
            <div>
              <Label htmlFor="edit-nome">Nome Completo *</Label>
              <Input
                id="edit-nome"
                type="text"
                {...form.register("nome")}
                data-testid="input-edit-nome"
              />
              {form.formState.errors.nome && (
                <p className="text-destructive text-sm mt-1">
                  {form.formState.errors.nome.message}
                </p>
              )}
            </div>

            {/* Serviço */}
            <div>
              <Label htmlFor="edit-servico">Serviço *</Label>
              <Select 
                value={form.watch("servico")} 
                onValueChange={(value) => form.setValue("servico", value)}
              >
                <SelectTrigger data-testid="select-edit-servico">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Design">Design</SelectItem>
                  <SelectItem value="Programação">Programação</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Redação">Redação</SelectItem>
                  <SelectItem value="Tradução">Tradução</SelectItem>
                  <SelectItem value="Consultoria">Consultoria</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.servico && (
                <p className="text-destructive text-sm mt-1">
                  {form.formState.errors.servico.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="edit-email">E-mail</Label>
              <Input
                id="edit-email"
                type="email"
                {...form.register("email")}
                data-testid="input-edit-email"
              />
              {form.formState.errors.email && (
                <p className="text-destructive text-sm mt-1">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            {/* Preço por Hora */}
            <div>
              <Label htmlFor="edit-preco_hora">Preço por Hora (R$)</Label>
              <Input
                id="edit-preco_hora"
                type="number"
                min="0"
                step="0.01"
                {...form.register("preco_hora", { valueAsNumber: true })}
                data-testid="input-edit-preco-hora"
              />
            </div>

            {/* Localização */}
            <div>
              <Label htmlFor="edit-localizacao">Localização</Label>
              <Input
                id="edit-localizacao"
                type="text"
                {...form.register("localizacao")}
                data-testid="input-edit-localizacao"
              />
            </div>

          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-border">
            <Button 
              type="button" 
              variant="outline"
              onClick={() => onOpenChange(false)}
              data-testid="button-cancel-edit"
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              className="sunset-gradient text-white font-medium"
              disabled={updateMutation.isPending}
              data-testid="button-save-edit"
            >
              <Save className="mr-2 h-4 w-4" />
              {updateMutation.isPending ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
