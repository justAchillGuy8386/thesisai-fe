import { api } from "@/lib/api";

export type DocumentProcessingStatus =
  | "uploaded"
  | "extracting"
  | "indexing"
  | "ready"
  | "failed";

export interface DocumentItem {
  id: number;
  project_id: number;
  original_filename: string;
  mime_type: string;
  file_size: number;
  file_size_formatted: string;
  version: number;
  is_archived: boolean;
  processing_status: DocumentProcessingStatus;
  error_message?: string | null;
  created_at: string;
  updated_at: string;
}

export interface DocumentListResponse {
  documents: DocumentItem[];
  total: number;
  active_version?: number | null;
}

export const DOC_STATUS_MAP: Record<
  DocumentProcessingStatus,
  { label: string; color: string; bg: string; border: string; dot: string }
> = {
  uploaded: {
    label: "Đã tải lên",
    color: "text-amber-800",
    bg: "bg-amber-50",
    border: "border-amber-200",
    dot: "bg-amber-500",
  },
  extracting: {
    label: "Đang đọc tài liệu",
    color: "text-sky-800",
    bg: "bg-sky-50",
    border: "border-sky-200",
    dot: "bg-sky-500",
  },
  indexing: {
    label: "Đang chuẩn bị dữ liệu",
    color: "text-indigo-800",
    bg: "bg-indigo-50",
    border: "border-indigo-200",
    dot: "bg-indigo-500",
  },
  ready: {
    label: "Sẵn sàng",
    color: "text-emerald-800",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    dot: "bg-emerald-500",
  },
  failed: {
    label: "Lỗi xử lý",
    color: "text-rose-800",
    bg: "bg-rose-50",
    border: "border-rose-200",
    dot: "bg-rose-500",
  },
};

export const documentService = {
  async getDocuments(projectId: number): Promise<DocumentListResponse> {
    return api.get<DocumentListResponse>(`/projects/${projectId}/documents`);
  },

  async uploadDocument(projectId: number, file: File): Promise<DocumentItem> {
    const formData = new FormData();
    formData.append("file", file);
    return api.upload<DocumentItem>(`/projects/${projectId}/documents/upload`, formData);
  },

  async deleteDocument(
    projectId: number,
    documentId: number
  ): Promise<{ message: string }> {
    return api.delete<{ message: string }>(
      `/projects/${projectId}/documents/${documentId}`
    );
  },
};

