export type HealthCheckResult = {
    status: string;
    timestamp: string;
}

export type Document = {
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

export interface HeadCell {
  disablePadding: boolean;
  id: keyof Document;
  label: string;
  numeric: boolean;
  alignRight: boolean
}