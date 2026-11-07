import { api } from "@/lib/api";

export interface AnticipatedQuestion {
  role: "CHỦ TỊCH HỘI ĐỒNG" | "GIẢNG VIÊN PHẢN BIỆN" | "ỦY VIÊN HỘI ĐỒNG" | string;
  question: string;
  reason: string;
  suggested_answer_hint: string;
}

export interface KnowledgeProfileData {
  summary: string;
  objectives: string[];
  methodology_and_tech: string[];
  contributions: string[];
  defense_weaknesses: string[];
  anticipated_questions: AnticipatedQuestion[];
}

export interface KnowledgeProfileResponse {
  id: number;
  project_id: number;
  version: number;
  status: "generating" | "ready" | "failed";
  profile_data?: KnowledgeProfileData | null;
  source_document_ids: number[];
  created_at: string;
  updated_at: string;
}

export const knowledgeProfileService = {
  async getKnowledgeProfile(projectId: number): Promise<KnowledgeProfileResponse | null> {
    try {
      return await api.get<KnowledgeProfileResponse>(`/projects/${projectId}/knowledge-profile`);
    } catch (err: any) {
      // 404 means no profile generated yet
      if (err.message && err.message.includes("chưa có Hồ sơ Tri thức")) {
        return null;
      }
      return null;
    }
  },

  async generateKnowledgeProfile(
    projectId: number,
    forceRegenerate: boolean = false
  ): Promise<KnowledgeProfileResponse> {
    return await api.post<KnowledgeProfileResponse>(
      `/projects/${projectId}/knowledge-profile/generate`,
      { force_regenerate: forceRegenerate }
    );
  },
};

