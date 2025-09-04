import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import FreelancerForm from "@/components/freelancer-form";
import FreelancerList from "@/components/freelancer-list";
import { getFreelancers } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RefreshCw, Search, Users } from "lucide-react";
import type { Freelancer } from "@shared/schema";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");

  const { 
    data: response, 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ["/api/freelancers"],
    queryFn: getFreelancers,
  });

  const freelancers = response?.list || [];

  const filteredFreelancers = freelancers.filter((freelancer: Freelancer) =>
    freelancer.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
    freelancer.servico.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["/api/freelancers"] });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="bg-card shadow-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold sunset-gradient bg-clip-text text-transparent">
              FreelaMatch
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
              Conecte-se com os melhores freelancers
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Add Freelancer Section */}
        <section className="mb-12">
          <FreelancerForm />
        </section>

        {/* Search and Filter Section */}
        <section className="mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Buscar por nome ou serviço..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                    data-testid="input-search"
                  />
                </div>
                <Button 
                  variant="outline" 
                  onClick={handleRefresh}
                  data-testid="button-refresh"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Atualizar
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Freelancers Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold flex items-center">
              <Users className="text-[var(--sunset-orange)] mr-2" />
              Freelancers Cadastrados
            </h2>
            <span className="text-muted-foreground" data-testid="text-freelancers-count">
              {filteredFreelancers.length} freelancer{filteredFreelancers.length !== 1 ? 's' : ''}
            </span>
          </div>

          <FreelancerList 
            freelancers={filteredFreelancers}
            isLoading={isLoading}
            error={error}
          />
        </section>
      </main>
    </div>
  );
}
