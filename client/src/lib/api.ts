import { apiRequest } from "./queryClient";
import type { 
  Freelancer, 
  InsertFreelancer, 
  FreelancersListResponse, 
  ApiResponse 
} from "@shared/schema";

export async function getFreelancers(): Promise<FreelancersListResponse> {
  const response = await apiRequest("GET", "/api/freelancers");
  return response.json();
}

export async function createFreelancer(data: InsertFreelancer): Promise<ApiResponse<Freelancer>> {
  const response = await apiRequest("POST", "/api/freelancers", data);
  return response.json();
}

export async function updateFreelancer(id: string, data: Partial<InsertFreelancer>): Promise<ApiResponse<Freelancer>> {
  const response = await apiRequest("PATCH", `/api/freelancers/${id}`, data);
  return response.json();
}

export async function deleteFreelancer(id: string): Promise<ApiResponse<{ deleted: string }>> {
  const response = await apiRequest("DELETE", `/api/freelancers/${id}`);
  return response.json();
}
