import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertFreelancerSchema, freelancerSchema } from "@shared/schema";
import { z } from "zod";

// Airtable API integration
const AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN || process.env.AIRTABLE_API_KEY || "";
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID || "";
const AIRTABLE_TABLE = process.env.AIRTABLE_TABLE || "Freelancers";

interface AirtableRecord {
  id: string;
  fields: {
    nome?: string;
    servico?: string;
    email?: string;
    preco_hora?: number;
    localizacao?: string;
  };
  createdTime?: string;
}

interface AirtableResponse {
  records: AirtableRecord[];
  offset?: string;
}

// Normalize Airtable record to our schema
function normalizeRecord(record: AirtableRecord) {
  return {
    id: record.id,
    nome: record.fields.nome || "",
    servico: record.fields.servico || "",
    email: record.fields.email || "",
    preco_hora: record.fields.preco_hora || 0,
    localizacao: record.fields.localizacao || ""
  };
}

async function makeAirtableRequest(method: string, endpoint: string, data?: any) {
  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE}${endpoint}`;
  
  const options: RequestInit = {
    method,
    headers: {
      'Authorization': `Bearer ${AIRTABLE_TOKEN}`,
      'Content-Type': 'application/json'
    }
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(url, options);
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Airtable API error: ${response.status} ${errorText}`);
  }

  return response.json();
}

export async function registerRoutes(app: Express): Promise<Server> {
  
  // GET /api/freelancers - List all freelancers
  app.get("/api/freelancers", async (req, res) => {
    try {
      if (AIRTABLE_TOKEN && AIRTABLE_BASE_ID) {
        // Use Airtable
        const response: AirtableResponse = await makeAirtableRequest(
          'GET', 
          '?pageSize=50'
        );
        
        const freelancers = response.records.map(normalizeRecord);
        
        res.json({
          ok: true,
          list: freelancers,
          offset: response.offset
        });
      } else {
        // Use in-memory storage
        const freelancers = await storage.getFreelancers();
        res.json({
          ok: true,
          list: freelancers
        });
      }
    } catch (error) {
      console.error("Error fetching freelancers:", error);
      res.status(500).json({
        ok: false,
        error: error instanceof Error ? error.message : "Erro interno do servidor"
      });
    }
  });

  // POST /api/freelancers - Create new freelancer
  app.post("/api/freelancers", async (req, res) => {
    try {
      // Validate request body
      const validatedData = insertFreelancerSchema.parse(req.body);

      if (AIRTABLE_TOKEN && AIRTABLE_BASE_ID) {
        // Use Airtable
        const response = await makeAirtableRequest('POST', '', {
          fields: {
            nome: validatedData.nome,
            servico: validatedData.servico,
            email: validatedData.email || "",
            preco_hora: validatedData.preco_hora || 0,
            localizacao: validatedData.localizacao || ""
          }
        });

        const freelancer = normalizeRecord(response);
        res.status(201).json({
          ok: true,
          item: freelancer
        });
      } else {
        // Use in-memory storage
        const freelancer = await storage.createFreelancer(validatedData);
        res.status(201).json({
          ok: true,
          item: freelancer
        });
      }
    } catch (error) {
      console.error("Error creating freelancer:", error);
      
      if (error instanceof z.ZodError) {
        res.status(400).json({
          ok: false,
          error: "Dados inválidos: " + error.errors.map(e => e.message).join(", ")
        });
      } else {
        res.status(500).json({
          ok: false,
          error: error instanceof Error ? error.message : "Erro interno do servidor"
        });
      }
    }
  });

  // PATCH /api/freelancers/:id - Update freelancer
  app.patch("/api/freelancers/:id", async (req, res) => {
    try {
      const { id } = req.params;
      
      // Validate partial update data
      const validatedData = insertFreelancerSchema.partial().parse(req.body);

      if (AIRTABLE_TOKEN && AIRTABLE_BASE_ID) {
        // Use Airtable
        const updateFields: any = {};
        if (validatedData.nome !== undefined) updateFields.nome = validatedData.nome;
        if (validatedData.servico !== undefined) updateFields.servico = validatedData.servico;
        if (validatedData.email !== undefined) updateFields.email = validatedData.email;
        if (validatedData.preco_hora !== undefined) updateFields.preco_hora = validatedData.preco_hora;
        if (validatedData.localizacao !== undefined) updateFields.localizacao = validatedData.localizacao;

        const response = await makeAirtableRequest('PATCH', `/${id}`, {
          fields: updateFields
        });

        const freelancer = normalizeRecord(response);
        res.json({
          ok: true,
          item: freelancer
        });
      } else {
        // Use in-memory storage
        const freelancer = await storage.updateFreelancer(id, validatedData);
        res.json({
          ok: true,
          item: freelancer
        });
      }
    } catch (error) {
      console.error("Error updating freelancer:", error);
      
      if (error instanceof z.ZodError) {
        res.status(400).json({
          ok: false,
          error: "Dados inválidos: " + error.errors.map(e => e.message).join(", ")
        });
      } else {
        res.status(500).json({
          ok: false,
          error: error instanceof Error ? error.message : "Erro interno do servidor"
        });
      }
    }
  });

  // DELETE /api/freelancers/:id - Delete freelancer
  app.delete("/api/freelancers/:id", async (req, res) => {
    try {
      const { id } = req.params;

      if (AIRTABLE_TOKEN && AIRTABLE_BASE_ID) {
        // Use Airtable
        await makeAirtableRequest('DELETE', `/${id}`);
        
        res.json({
          ok: true,
          deleted: id
        });
      } else {
        // Use in-memory storage
        const deleted = await storage.deleteFreelancer(id);
        
        if (!deleted) {
          return res.status(404).json({
            ok: false,
            error: "Freelancer não encontrado"
          });
        }

        res.json({
          ok: true,
          deleted: id
        });
      }
    } catch (error) {
      console.error("Error deleting freelancer:", error);
      res.status(500).json({
        ok: false,
        error: error instanceof Error ? error.message : "Erro interno do servidor"
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
