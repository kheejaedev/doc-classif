import axios from "axios";
import type { InsuranceDocument } from "./types";

const apiKey = import.meta.env.VITE_API_KEY;
const BASE_URL = import.meta.env.VITE_BASE_URL;
const DOCUMENTS = "v1/documents";
const HEALTH = "health";
const CLASSIFY = "classify";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "x-api-key": apiKey,
  },
});

export async function getDocuments(): Promise<InsuranceDocument[]> {
  // page: number = 1, limit: number = 10
  try {
    const response = await apiClient.get(
      `${BASE_URL}/${DOCUMENTS}` // `${BASE_URL}/${DOCUMENTS}?page=${page}&limit=${limit}`
    );
    return response.data.results;
  } catch (error: any) {
    console.error("Failed to fetch documents: ", error);
    throw error;
  }
}

export async function checkHealth() {
  try {
    const response = await apiClient.get(`${BASE_URL}/${HEALTH}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Health check failed");
  }
}

export async function uploadDocument(newDocument: File) {
  const formData = new FormData();
  formData.append("file", newDocument);

  try {
    const response = await apiClient.post(
      `${BASE_URL}/${DOCUMENTS}/${CLASSIFY}`,
      formData
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to upload document(s)"
    );
  }
}

export async function deleteDocument(id: string) {
  try {
    const response = await apiClient.delete(`${BASE_URL}/${DOCUMENTS}/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to delete document"
    );
  }
}
