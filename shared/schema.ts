import { z } from "zod";

// Freelancer schema matching Airtable fields
export const freelancerSchema = z.object({
  id: z.string(),
  nome: z.string().min(1, "Nome é obrigatório"),
  servico: z.string().min(1, "Serviço é obrigatório"),
  email: z.string().email("E-mail inválido").optional().or(z.literal("")),
  preco_hora: z.number().min(0, "Preço deve ser positivo").optional(),
  localizacao: z.string().optional()
});

export const insertFreelancerSchema = freelancerSchema.omit({ id: true });

export type Freelancer = z.infer<typeof freelancerSchema>;
export type InsertFreelancer = z.infer<typeof insertFreelancerSchema>;

// API Response types
export interface ApiResponse<T> {
  ok: boolean;
  data?: T;
  error?: string;
}

export interface FreelancersListResponse {
  ok: boolean;
  list: Freelancer[];
  offset?: string;
}
