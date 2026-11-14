import { api } from "@/lib/api";

export interface QuestionResponse {
  id: number;
  session_id: number;
  order_index: number;
  question_text: string;
  difficulty: "easy" | "medium" | "hard" | string;
  topic_competency: string;
  expected_answer_outline: string;
  source_chunk_ids: number[];
  recommended_seconds: number;
  is_answered: boolean;
  created_at: string;
}

export interface PracticeSessionListItem {
  id: number;
  project_id: number;
  mode: string;
  status: "in_progress" | "completed" | "cancelled" | string;
  knowledge_profile_version: number;
  total_questions: number;
  answered_questions: number;
  started_at: string;
  ended_at?: string | null;
}

export interface PracticeSessionDetail {
  id: number;
  project_id: number;
  mode: string;
  status: "in_progress" | "completed" | "cancelled" | string;
  knowledge_profile_version: number;
  started_at: string;
  ended_at?: string | null;
  questions: QuestionResponse[];
}

export const practiceService = {
  /**
   * Tạo phiên luyện tập mới và tự động sinh 12 câu hỏi từ tài liệu
   */
  async createPracticeSession(
    projectId: number,
    mode: string = "question_answer",
    targetQuestions: number = 12
  ): Promise<PracticeSessionDetail> {
    return await api.post<PracticeSessionDetail>(
      `/projects/${projectId}/practice/sessions`,
      {
        mode,
        target_questions: targetQuestions,
      }
    );
  },

  /**
   * Lấy danh sách lịch sử các phiên luyện tập của đồ án
   */
  async listPracticeSessions(projectId: number): Promise<PracticeSessionListItem[]> {
    return await api.get<PracticeSessionListItem[]>(
      `/projects/${projectId}/practice/sessions`
    );
  },

  /**
   * Lấy chi tiết phiên luyện tập cụ thể kèm danh sách câu hỏi
   */
  async getPracticeSessionDetail(sessionId: number): Promise<PracticeSessionDetail> {
    return await api.get<PracticeSessionDetail>(
      `/practice/sessions/${sessionId}`
    );
  },

  /**
   * Cập nhật trạng thái phiên (hoàn thành hoặc hủy)
   */
  async updateSessionStatus(
    sessionId: number,
    status: "in_progress" | "completed" | "cancelled"
  ): Promise<PracticeSessionDetail> {
    return await api.patch<PracticeSessionDetail>(
      `/practice/sessions/${sessionId}/status`,
      { status }
    );
  },
};

