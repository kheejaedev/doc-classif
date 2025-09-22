import axios from 'axios';
import type { Document } from './types';

const BASE_URL = 'https://interview-classification-api.onrender.com';
const DOCUMENTS = 'v1/documents';
const HEALTH = 'health';
const CLASSIFY = 'classify';
const apiKey = 'pKQwcC9uWDCW6yM3';

export const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'x-api-key': apiKey,
    },
});

export async function getDocuments() : Promise<Document[]> { // page: number = 1, limit: number = 10
    try {
        const response = await apiClient.get(
            `${BASE_URL}/${DOCUMENTS}` // `${BASE_URL}/${DOCUMENTS}?page=${page}&limit=${limit}`
        );
        return response.data.results;
    } catch (error: any) {
        console.error('Failed to fetch documents: ', error);
        throw error;
    }
}

export async function checkHealth() {
    try {
        const response = await apiClient.get(`${BASE_URL}/${HEALTH}`, {
            headers: {
                'x-api-key': apiKey,
            },
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Health check failed');
    }
}

export async function uploadDocument(newDocument: File) {
    const formData = new FormData();
    formData.append('file', newDocument);
    try {
        const response = await apiClient.post(`${BASE_URL}/${DOCUMENTS}/${CLASSIFY}`, formData, {
            headers: {
                'x-api-key': apiKey,
                'Content-Type': 'multipart/form-data'
            },
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to upload document(s)');
    }
}

export async function deleteDocument(id: string) {
    try {
        const response = await apiClient.delete(`${BASE_URL}/${DOCUMENTS}/${id}`, {
            headers: {
                'x-api-key': apiKey,
            },
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to delete document');
    }
}