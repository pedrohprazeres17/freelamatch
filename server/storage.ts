import { type Freelancer, type InsertFreelancer } from "@shared/schema";

export interface IStorage {
  getFreelancers(): Promise<Freelancer[]>;
  getFreelancer(id: string): Promise<Freelancer | undefined>;
  createFreelancer(freelancer: InsertFreelancer): Promise<Freelancer>;
  updateFreelancer(id: string, data: Partial<InsertFreelancer>): Promise<Freelancer>;
  deleteFreelancer(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private freelancers: Map<string, Freelancer>;
  private nextId: number;

  constructor() {
    this.freelancers = new Map();
    this.nextId = 1;
  }

  async getFreelancers(): Promise<Freelancer[]> {
    return Array.from(this.freelancers.values()).sort((a, b) => 
      new Date(b.id).getTime() - new Date(a.id).getTime()
    );
  }

  async getFreelancer(id: string): Promise<Freelancer | undefined> {
    return this.freelancers.get(id);
  }

  async createFreelancer(insertFreelancer: InsertFreelancer): Promise<Freelancer> {
    const id = this.nextId.toString();
    this.nextId++;
    
    const freelancer: Freelancer = { 
      ...insertFreelancer, 
      id,
      email: insertFreelancer.email || "",
      localizacao: insertFreelancer.localizacao || "",
      preco_hora: insertFreelancer.preco_hora || 0
    };
    
    this.freelancers.set(id, freelancer);
    return freelancer;
  }

  async updateFreelancer(id: string, data: Partial<InsertFreelancer>): Promise<Freelancer> {
    const existing = this.freelancers.get(id);
    if (!existing) {
      throw new Error("Freelancer não encontrado");
    }

    const updated: Freelancer = { ...existing, ...data };
    this.freelancers.set(id, updated);
    return updated;
  }

  async deleteFreelancer(id: string): Promise<boolean> {
    return this.freelancers.delete(id);
  }
}

export const storage = new MemStorage();
