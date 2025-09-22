import axios from 'axios';
import type { Document } from './types';

const BASE_URL = 'https://interview-classification-api.onrender.com';
const GET_DOCUMENTS_PATH = '/v1/documents';
const GET_HEALTH_PATH = '/health';
const POST_DOCUMENT_PATH = '/v1/documents/classify';
const DELETE_DOCUMENT_PATH = '/v1/documents';
const API_KEY = 'pKQwcC9uWDCW6yM3';

export async function getDocuments() : Promise<Document[]> {
    try {
        const response = await axios.get(`${BASE_URL}${GET_DOCUMENTS_PATH}`, {
            headers: {
                'x-api-key': API_KEY,
            },
            // params: {
            //     page: 1,
            //     limit: 20
            // }
        });
        return response.data.results;
    } catch (error: any) {
        // fix
        throw new Error(error.response?.data?.message || 'Failed to fetch documents');
    }
}

export async function checkHealth() {
    try {
        const response = await axios.get(`${BASE_URL}${GET_HEALTH_PATH}`, {
            headers: {
                'x-api-key': API_KEY,
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
        const response = await axios.post(`${BASE_URL}${POST_DOCUMENT_PATH}`, formData, {
            headers: {
                'x-api-key': API_KEY,
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
        const response = await axios.delete(`${BASE_URL}${DELETE_DOCUMENT_PATH}/${id}`, {
            headers: {
                'x-api-key': API_KEY,
            },
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to delete document');
    }
}