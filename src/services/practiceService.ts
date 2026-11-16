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

export interface AnswerSubmitResponse {
  id: number;
  question_id: number;
  audio_path?: string;
  duration_seconds?: number;
  processing_status: string;
  audio_status: string;
  created_at: string;
  message: string;
}

export interface TranscriptSegment {
  start: number;
  end: number;
  text: string;
}

export interface SpeechMetrics {
  speaking_rate_wpm?: number;
  pace_assessment?: string;
  hesitation_pauses_count?: number;
  fluency_score?: number;
  disclaimer?: string;
  [key: string]: any;
}

export interface AnswerDetailResponse {
  id: number;
  question_id: number;
  audio_mime_type: string;
  duration_seconds?: number;
  transcript?: string;
  transcript_segments?: TranscriptSegment[];
  processing_status: "queued" | "transcribing" | "evaluating" | "completed" | "failed" | string;
  audio_status: "active" | "purged" | string;
  audio_url?: string;
  error_fields?: {
    speech_metrics?: SpeechMetrics;
    [key: string]: any;
  };
  created_at: string;
  updated_at: string;
}

export interface RubricCriterionScores {
  technical_accuracy?: number;
  completeness?: number;
  reasoning_defense?: number;
  speech_pace?: number;
  fluency?: number;
  [key: string]: any;
}

export interface EvaluationFeedback {
  strengths?: string[];
  weaknesses?: string[];
  suggestions?: string[];
  model_answer?: string;
  [key: string]: any;
}

export interface EvaluationEvidence {
  cited_chunk_ids?: number[];
  matched_keywords?: string[];
  grounding_notes?: string;
  [key: string]: any;
}

export interface ModelMetadata {
  model?: string;
  evaluation_latency_seconds?: number;
  disclaimer?: string;
  is_fallback?: boolean;
  [key: string]: any;
}

export interface AnswerEvaluationResponse {
  id: number;
  answer_id: number;
  overall_score: number;
  content_score: number;
  delivery_score?: number;
  criterion_scores: RubricCriterionScores;
  feedback: EvaluationFeedback;
  evidence: EvaluationEvidence;
  model_metadata: ModelMetadata;
  created_at: string;
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

  /**
   * Gửi file ghi âm câu trả lời của sinh viên lên máy chủ (phản hồi ngay < 200ms)
   */
  async submitAnswerAudio(
    sessionId: number,
    questionId: number,
    audioBlob: Blob,
    durationSeconds?: number
  ): Promise<AnswerSubmitResponse> {
    const formData = new FormData();
    const ext = audioBlob.type.includes("wav") ? "wav" : "webm";
    formData.append("file", audioBlob, `recording_${questionId}.${ext}`);
    if (durationSeconds !== undefined && !isNaN(durationSeconds)) {
      formData.append("duration_seconds", durationSeconds.toString());
    }

    return await api.upload<AnswerSubmitResponse>(
      `/sessions/${sessionId}/questions/${questionId}/answer`,
      formData
    );
  },

  /**
   * Lấy chi tiết câu trả lời, trạng thái xử lý background pipeline và transcript
   */
  async getAnswerDetail(
    sessionId: number,
    questionId: number
  ): Promise<AnswerDetailResponse> {
    return await api.get<AnswerDetailResponse>(
      `/sessions/${sessionId}/questions/${questionId}/answer`
    );
  },

  /**
   * Lấy kết quả chấm điểm Rubric đa chiều và nhận xét chi tiết
   */
  async getAnswerEvaluation(
    sessionId: number,
    questionId: number
  ): Promise<AnswerEvaluationResponse> {
    return await api.get<AnswerEvaluationResponse>(
      `/sessions/${sessionId}/questions/${questionId}/evaluation`
    );
  },

  /**
   * Yêu cầu chấm điểm lại dựa trên transcript đã có
   */
  async reevaluateAnswer(
    sessionId: number,
    questionId: number
  ): Promise<AnswerEvaluationResponse> {
    return await api.post<AnswerEvaluationResponse>(
      `/sessions/${sessionId}/questions/${questionId}/evaluation/reevaluate`,
      {}
    );
  },

  /**
   * Xóa vĩnh viễn tệp âm thanh giọng nói vì lý do riêng tư (Privacy-by-Design)
   */
  async purgeAnswerAudio(
    sessionId: number,
    questionId: number
  ): Promise<{ status: string; message: string; audio_status: string }> {
    return await api.post<{ status: string; message: string; audio_status: string }>(
      `/sessions/${sessionId}/questions/${questionId}/purge-audio`,
      {}
    );
  },
};

