import FreelancerCard from "./freelancer-card";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, AlertTriangle } from "lucide-react";
import type { Freelancer } from "@shared/schema";

interface FreelancerListProps {
  freelancers: Freelancer[];
  isLoading: boolean;
  error: Error | null;
}

export default function FreelancerList({ freelancers, isLoading, error }: FreelancerListProps) {
  // Loading State
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" data-testid="loading-state">
        {Array(8).fill(0).map((_, index) => (
          <Card key={index} className="p-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 rounded-full skeleton"></div>
              <div className="flex-1">
                <div className="h-4 skeleton rounded mb-2"></div>
                <div className="h-3 skeleton rounded w-3/4"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-3 skeleton rounded"></div>
              <div className="h-3 skeleton rounded w-2/3"></div>
              <div className="h-3 skeleton rounded w-1/2"></div>
            </div>
            <div className="mt-4 flex space-x-2">
              <div className="h-8 skeleton rounded flex-1"></div>
              <div className="h-8 skeleton rounded flex-1"></div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <Card className="bg-destructive/10 border-destructive/20" data-testid="error-state">
        <CardContent className="p-6 text-center">
          <AlertTriangle className="h-12 w-12 text-destructive mb-3 mx-auto" />
          <h3 className="text-lg font-medium text-destructive mb-2">Erro ao carregar freelancers</h3>
          <p className="text-destructive/80 mb-4">
            {error.message || "Ocorreu um erro inesperado. Tente novamente."}
          </p>
          <Button 
            variant="destructive"
            onClick={() => window.location.reload()}
            data-testid="button-retry"
          >
            Tentar Novamente
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Empty State
  if (freelancers.length === 0) {
    return (
      <div className="text-center py-16" data-testid="empty-state">
        <div className="max-w-md mx-auto">
          <Users className="h-24 w-24 text-muted-foreground mb-4 mx-auto" />
          <h3 className="text-xl font-medium text-foreground mb-2">Nenhum freelancer cadastrado ainda</h3>
          <p className="text-muted-foreground mb-6">
            Comece cadastrando o primeiro freelancer usando o formulário acima.
          </p>
          <Button 
            className="sunset-gradient text-white font-medium"
            onClick={() => document.getElementById('nome')?.focus()}
            data-testid="button-start-cadastro"
          >
            Cadastrar Agora
          </Button>
        </div>
      </div>
    );
  }

  // Freelancers Grid
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" data-testid="freelancers-grid">
      {freelancers.map((freelancer) => (
        <FreelancerCard key={freelancer.id} freelancer={freelancer} />
      ))}
    </div>
  );
}
