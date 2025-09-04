import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, MapPin, DollarSign, Edit, Trash2 } from "lucide-react";
import EditModal from "./edit-modal";
import DeleteModal from "./delete-modal";
import type { Freelancer } from "@shared/schema";

interface FreelancerCardProps {
  freelancer: Freelancer;
}

export default function FreelancerCard({ freelancer }: FreelancerCardProps) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const priceFormatted = freelancer.preco_hora ? `R$ ${freelancer.preco_hora.toFixed(2)}/hora` : 'Preço não informado';

  return (
    <>
      <Card className="card-hover sunset-border-hover transition-all overflow-hidden" data-testid={`card-freelancer-${freelancer.id}`}>
        {/* Header colorido */}
        <div className="sunset-gradient h-20 relative">
          <div className="absolute bottom-3 left-4">
            <Badge 
              className="bg-white/20 text-white border-white/30 hover:bg-white/30"
              data-testid={`badge-service-${freelancer.id}`}
            >
              {freelancer.servico}
            </Badge>
          </div>
        </div>
        
        <CardContent className="p-6 -mt-2">
          {/* Nome do freelancer */}
          <div className="mb-4">
            <h3 className="font-bold text-xl text-foreground mb-1" data-testid={`text-name-${freelancer.id}`}>
              {freelancer.nome}
            </h3>
          </div>

          {/* Informações organizadas */}
          <div className="space-y-3 mb-6">
            {freelancer.email && (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-[var(--sunset-orange)]/10 flex items-center justify-center">
                  <Mail className="w-4 h-4 text-[var(--sunset-orange)]" />
                </div>
                <a 
                  href={`mailto:${freelancer.email}`} 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors flex-1"
                  data-testid={`link-email-${freelancer.id}`}
                >
                  {freelancer.email}
                </a>
              </div>
            )}
            
            {freelancer.localizacao && (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-[var(--sunset-amber)]/10 flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-[var(--sunset-amber)]" />
                </div>
                <span className="text-sm text-muted-foreground flex-1" data-testid={`text-location-${freelancer.id}`}>
                  {freelancer.localizacao}
                </span>
              </div>
            )}
            
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-[var(--sunset-gold)]/10 flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-[var(--sunset-gold)]" />
              </div>
              <span className="text-sm font-semibold text-foreground flex-1" data-testid={`text-price-${freelancer.id}`}>
                {priceFormatted}
              </span>
            </div>
          </div>

          {/* Botões de ação */}
          <div className="flex space-x-2">
            <Button 
              variant="outline"
              className="flex-1 border-[var(--sunset-orange)]/20 hover:bg-[var(--sunset-orange)]/5"
              onClick={() => setShowEditModal(true)}
              data-testid={`button-edit-${freelancer.id}`}
            >
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </Button>
            <Button 
              variant="destructive"
              className="flex-1"
              onClick={() => setShowDeleteModal(true)}
              data-testid={`button-delete-${freelancer.id}`}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Excluir
            </Button>
          </div>
        </CardContent>
      </Card>

      <EditModal 
        freelancer={freelancer}
        open={showEditModal}
        onOpenChange={setShowEditModal}
      />

      <DeleteModal 
        freelancer={freelancer}
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
      />
    </>
  );
}
