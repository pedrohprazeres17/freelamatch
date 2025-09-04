import { useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { deleteFreelancer } from "@/lib/api";
import { AlertTriangle, Trash2 } from "lucide-react";
import type { Freelancer } from "@shared/schema";

interface DeleteModalProps {
  freelancer: Freelancer;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function DeleteModal({ freelancer, open, onOpenChange }: DeleteModalProps) {
  const { toast } = useToast();
  
  const deleteMutation = useMutation({
    mutationFn: () => deleteFreelancer(freelancer.id),
    onSuccess: () => {
      toast({
        title: "Sucesso!",
        description: "Freelancer excluído com sucesso!",
        variant: "default"
      });
      onOpenChange(false);
      queryClient.invalidateQueries({ queryKey: ["/api/freelancers"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao excluir freelancer",
        variant: "destructive"
      });
    }
  });

  const handleDelete = () => {
    deleteMutation.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md" data-testid="modal-delete">
        <div className="p-6">
          <div className="flex items-center mb-4">
            <div className="flex-shrink-0 w-10 h-10 bg-destructive/10 rounded-full flex items-center justify-center">
              <AlertTriangle className="text-destructive h-5 w-5" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-foreground">Confirmar Exclusão</h3>
              <p className="text-sm text-muted-foreground">Esta ação não pode ser desfeita.</p>
            </div>
          </div>

          <p className="text-foreground mb-6">
            Tem certeza que deseja excluir o freelancer{" "}
            <strong data-testid="text-freelancer-name">{freelancer.nome}</strong>?
          </p>

          <div className="flex justify-end space-x-3">
            <Button 
              type="button" 
              variant="outline"
              onClick={() => onOpenChange(false)}
              data-testid="button-cancel-delete"
            >
              Cancelar
            </Button>
            <Button 
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              data-testid="button-confirm-delete"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {deleteMutation.isPending ? "Excluindo..." : "Excluir"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
