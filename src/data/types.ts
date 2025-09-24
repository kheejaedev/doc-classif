export type HealthCheckResult = {
    status: string;
    timestamp: string;
}

export type InsuranceDocument = {
    id: string;
    originalName: string;
    classification: string;
    confidence: number;
    size: number;
    mimeType: string;
    createdAt: string;
    updatedAt: string;
}

export type DocumentUploadResult = {
    id: string;
    filename: string;
    classification: string;
    confidence: number;
    createdAt: string;
}