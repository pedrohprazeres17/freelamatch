import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { createFreelancer } from "@/lib/api";
import { insertFreelancerSchema, type InsertFreelancer } from "@shared/schema";
import { UserPlus } from "lucide-react";

export default function FreelancerForm() {
  const { toast } = useToast();
  
  const form = useForm<InsertFreelancer>({
    resolver: zodResolver(insertFreelancerSchema),
    defaultValues: {
      nome: "",
      servico: "",
      email: "",
      preco_hora: undefined,
      localizacao: ""
    }
  });

  const createMutation = useMutation({
    mutationFn: createFreelancer,
    onSuccess: () => {
      toast({
        title: "Sucesso!",
        description: "Freelancer cadastrado com sucesso!",
        variant: "default"
      });
      form.reset();
      document.getElementById("nome")?.focus();
      queryClient.invalidateQueries({ queryKey: ["/api/freelancers"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao cadastrar freelancer",
        variant: "destructive"
      });
    }
  });

  const onSubmit = (data: InsertFreelancer) => {
    createMutation.mutate(data);
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-2xl font-semibold mb-6 text-center flex items-center justify-center">
          <UserPlus className="text-[var(--sunset-orange)] mr-2" />
          Cadastrar Novo Freelancer
        </h2>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nome */}
            <div>
              <Label htmlFor="nome">Nome Completo *</Label>
              <Input
                id="nome"
                type="text"
                placeholder="Digite o nome completo"
                {...form.register("nome")}
                data-testid="input-nome"
              />
              {form.formState.errors.nome && (
                <p className="text-destructive text-sm mt-1">
                  {form.formState.errors.nome.message}
                </p>
              )}
            </div>

            {/* Serviço */}
            <div>
              <Label htmlFor="servico">Serviço *</Label>
              <Select onValueChange={(value) => form.setValue("servico", value)}>
                <SelectTrigger data-testid="select-servico">
                  <SelectValue placeholder="Selecione um serviço" />
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
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@exemplo.com"
                {...form.register("email")}
                data-testid="input-email"
              />
              {form.formState.errors.email && (
                <p className="text-destructive text-sm mt-1">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            {/* Preço por Hora */}
            <div>
              <Label htmlFor="preco_hora">Preço por Hora (R$)</Label>
              <Input
                id="preco_hora"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                {...form.register("preco_hora", { valueAsNumber: true })}
                data-testid="input-preco-hora"
              />
            </div>

            {/* Localização */}
            <div>
              <Label htmlFor="localizacao">Localização</Label>
              <Input
                id="localizacao"
                type="text"
                placeholder="Ex: Curitiba - PR"
                {...form.register("localizacao")}
                data-testid="input-localizacao"
              />
            </div>

          </div>

          <div className="flex justify-center">
            <Button 
              type="submit" 
              className="sunset-gradient text-white px-8 py-3 font-medium glow-hover"
              disabled={createMutation.isPending}
              data-testid="button-submit"
            >
              <UserPlus className="mr-2 h-4 w-4" />
              {createMutation.isPending ? "Cadastrando..." : "Cadastrar Freelancer"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
