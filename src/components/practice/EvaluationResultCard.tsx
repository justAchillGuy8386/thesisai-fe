"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Award,
  Volume2,
  Trash2,
  RefreshCw,
  Sparkles,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  ShieldCheck,
  Activity,
  Loader2,
  Mic,
  FileText,
} from "lucide-react";
import { toast } from "sonner";
import {
  AnswerDetailResponse,
  AnswerEvaluationResponse,
  practiceService,
} from "@/services/practiceService";

interface EvaluationResultCardProps {
  sessionId: number;
  questionId: number;
  answer: AnswerDetailResponse;
  evaluation: AnswerEvaluationResponse | null;
  onReevaluate: () => Promise<void>;
  onRerecord: () => void;
  onAudioPurged: () => void;
  hasNextQuestion?: boolean;
  onNextQuestion?: () => void;
  hideEvaluationResults?: boolean;
  onFinishSession?: () => void;
}

export function EvaluationResultCard({
  sessionId,
  questionId,
  answer,
  evaluation,
  onReevaluate,
  onRerecord,
  onAudioPurged,
  hasNextQuestion = false,
  onNextQuestion,
  hideEvaluationResults = false,
  onFinishSession,
}: EvaluationResultCardProps) {
  const [isModelAnswerOpen, setIsModelAnswerOpen] = useState(false);
  const [isRubricOpen, setIsRubricOpen] = useState(false);
  const [isPurgingAudio, setIsPurgingAudio] = useState(false);
  const [isReevaluating, setIsReevaluating] = useState(false);

  const status = answer.processing_status;
  const isProcessing = status === "queued" || status === "transcribing" || status === "evaluating";

  const handlePurgeAudio = async () => {
    if (answer.audio_status === "purged") return;

    if (!confirm("Bạn có chắc chắn muốn xóa vĩnh viễn tệp âm thanh giọng nói này? Bản ghi chép lời và kết quả đánh giá vẫn sẽ được bảo lưu 100%.")) {
      return;
    }

    setIsPurgingAudio(true);
    try {
      await practiceService.purgeAnswerAudio(sessionId, questionId);
      toast.success("Đã tiêu hủy tệp âm thanh thành công theo chuẩn Privacy-by-Design.");
      onAudioPurged();
    } catch (err: any) {
      toast.error(err.message || "Không thể tiêu hủy tệp âm thanh.");
    } finally {
      setIsPurgingAudio(false);
    }
  };

  const handleReevaluateClick = async () => {
    setIsReevaluating(true);
    try {
      await onReevaluate();
      toast.success("Đã hoàn thành chấm điểm lại!");
    } catch (err: any) {
      toast.error(err.message || "Không thể thực hiện chấm điểm lại.");
    } finally {
      setIsReevaluating(false);
    }
  };

  // 1. PROCESSING STATE (Async Background Stepper)
  if (isProcessing) {
    const steps = [
      {
        key: "queued",
        label: status === "queued" ? "Đang xếp hàng chờ xử lý ngầm" : "Đã tiếp nhận bản ghi âm",
        active: status === "queued",
        completed: status === "transcribing" || status === "evaluating",
      },
      {
        key: "transcribing",
        label: "Chuyển giọng nói thành văn bản (Whisper)",
        active: status === "transcribing",
        completed: status === "evaluating",
      },
      {
        key: "evaluating",
        label: "Hệ thống AI chấm Rubric & đối chiếu tài liệu",
        active: status === "evaluating",
        completed: false,
      },
    ];

    return (
      <div className="bg-white rounded-3xl border border-[#EAE4D9] p-6 sm:p-8 shadow-xs text-center">
        <div className="w-14 h-14 rounded-2xl bg-[#D97757]/10 border border-[#D97757]/20 text-[#D97757] flex items-center justify-center mx-auto mb-4">
          <Loader2 className="w-7 h-7 animate-spin" />
        </div>

        <h3 className="font-serif text-xl text-[#1F1E1D] font-normal mb-2">
          {status === "queued"
            ? "Đã lưu bài nói vào hàng đợi xử lý"
            : "Đang xử lý câu trả lời của bạn"}
        </h3>
        <p className="text-xs sm:text-sm text-[#706B63] max-w-md mx-auto mb-6 leading-relaxed">
          Quá trình gỡ băng và chấm điểm chạy ngầm tự động — bạn không cần chờ ở đây mà có thể trả lời tiếp các câu khác.
        </p>

        {/* Stepper Progress */}
        <div className="max-w-md mx-auto space-y-2.5 text-left">
          {steps.map((st, i) => (
            <div
              key={st.key}
              className={`p-3.5 rounded-2xl border transition-all flex items-center gap-3 ${
                st.active
                  ? "bg-[#FAF8F5] border-[#D97757]/40 shadow-xs"
                  : st.completed
                  ? "bg-emerald-50/50 border-emerald-200"
                  : "bg-white border-[#EAE4D9] opacity-50"
              }`}
            >
              {st.completed ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              ) : st.active ? (
                <Loader2 className="w-5 h-5 text-[#D97757] animate-spin shrink-0" />
              ) : (
                <div className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center text-[10px] text-gray-500 font-bold shrink-0">
                  {i + 1}
                </div>
              )}
              <span className="text-xs sm:text-sm font-medium text-[#1F1E1D]">
                {st.label}
              </span>
            </div>
          ))}
        </div>

        {hasNextQuestion && onNextQuestion && (
          <div className="mt-6 pt-5 border-t border-[#F0EBE1]">
            <button
              type="button"
              onClick={onNextQuestion}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#D97757] hover:bg-[#C86B4D] text-white text-xs sm:text-sm font-medium transition-colors shadow-xs cursor-pointer"
            >
              <span>Tiếp tục Câu tiếp theo</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    );
  }

  // 2. FAILED STATE
  if (status === "failed") {
    return (
      <div className="bg-white rounded-3xl border border-rose-200 p-6 sm:p-8 shadow-xs text-center">
        <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h3 className="font-serif text-lg text-[#1F1E1D] font-normal mb-1">
          Không thể hoàn tất đánh giá
        </h3>
        <p className="text-xs text-[#706B63] max-w-sm mx-auto mb-5 leading-relaxed">
          {answer.error_fields?.error || "Đã xảy ra lỗi trong quá trình xử lý âm thanh hoặc chấm điểm."}
        </p>
        <button
          type="button"
          onClick={onRerecord}
          className="px-5 py-2.5 rounded-xl bg-[#D97757] hover:bg-[#C86B4D] text-white text-xs font-medium inline-flex items-center gap-2 cursor-pointer"
        >
          <Mic className="w-4 h-4" />
          <span>Thu âm trả lời lại</span>
        </button>
      </div>
    );
  }

  // 3. COMPLETED WHILE SESSION IS STILL IN PROGRESS (Hide scores/feedback for focus)
  if (status === "completed" && hideEvaluationResults) {
    const completedSteps = [
      { key: "queued", label: "Đã tiếp nhận bản ghi âm" },
      { key: "transcribing", label: "Đã chuyển giọng nói thành văn bản (Whisper)" },
      { key: "evaluating", label: "Hệ thống AI đã hoàn tất chấm điểm" },
    ];

    return (
      <div className="bg-white rounded-3xl border border-emerald-200 p-6 sm:p-8 shadow-xs text-center">
        <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-7 h-7" />
        </div>

        <h3 className="font-serif text-xl text-[#1F1E1D] font-normal mb-2">
          Đã hoàn tất xử lý câu trả lời
        </h3>
        <p className="text-xs sm:text-sm text-[#706B63] max-w-md mx-auto mb-6 leading-relaxed">
          Điểm số và nhận xét chi tiết được ẩn trong lúc luyện tập, toàn bộ kết quả sẽ hiển thị sau khi bạn kết thúc phiên bảo vệ.
        </p>

        <div className="max-w-md mx-auto space-y-2.5 text-left">
          {completedSteps.map((st) => (
            <div
              key={st.key}
              className="p-3.5 rounded-2xl border bg-emerald-50/50 border-emerald-200 flex items-center gap-3"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span className="text-xs sm:text-sm font-medium text-[#1F1E1D]">
                {st.label}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-5 border-t border-[#F0EBE1] flex items-center justify-center gap-3 flex-wrap">
          <button
            type="button"
            onClick={onRerecord}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#DDD5C9] bg-white hover:bg-[#FAF7F2] text-[#1F1E1D] text-xs sm:text-sm font-medium transition-colors cursor-pointer"
          >
            <Mic className="w-4 h-4 text-[#D97757]" />
            <span>Thu âm lại</span>
          </button>

          {hasNextQuestion && onNextQuestion ? (
            <button
              type="button"
              onClick={onNextQuestion}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#D97757] hover:bg-[#C86B4D] text-white text-xs sm:text-sm font-medium transition-colors shadow-xs cursor-pointer"
            >
              <span>Câu tiếp theo</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : onFinishSession ? (
            <button
              type="button"
              onClick={onFinishSession}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-medium transition-colors shadow-xs cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Kết thúc phiên</span>
            </button>
          ) : null}
        </div>
      </div>
    );
  }

  // 4. COMPLETED EVALUATION RESULT (Visible after session finishes)
  if (!evaluation) {
    return (
      <div className="bg-white rounded-3xl border border-[#EAE4D9] p-6 text-center text-[#706B63]">
        <p className="text-xs">Đang tải kết quả đánh giá...</p>
      </div>
    );
  }

  const overall = evaluation.overall_score;
  const scoreColor =
    overall >= 8.0
      ? "text-emerald-700 bg-emerald-50 border-emerald-200"
      : overall >= 6.5
      ? "text-amber-700 bg-amber-50 border-amber-200"
      : "text-rose-700 bg-rose-50 border-rose-200";

  const speechMetrics = answer.error_fields?.speech_metrics;
  const wpm = speechMetrics?.speaking_rate_wpm ? Math.round(speechMetrics.speaking_rate_wpm) : null;
  const feedback = evaluation.feedback || {};
  const criterionScores = evaluation.criterion_scores || {};

  return (
    <div className="bg-white rounded-3xl border border-[#EAE4D9] p-6 sm:p-8 shadow-xs space-y-6">
      {/* Top Banner: Score & Delivery Overview */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-[#F0EBE1]">
        <div className="flex items-center gap-4">
          {/* Big Overall Score Badge */}
          <div
            className={`w-20 h-20 rounded-2xl border-2 flex flex-col items-center justify-center shrink-0 ${scoreColor}`}
          >
            <span className="text-2xl sm:text-3xl font-bold font-serif leading-none">
              {overall.toFixed(1)}
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider mt-1 opacity-80">
              Thang 10
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <Award className="w-4 h-4 text-[#D97757]" />
              <h3 className="font-serif text-lg sm:text-xl text-[#1F1E1D] font-medium leading-none">
                Đánh giá của Hệ thống AI
              </h3>
            </div>
            <p className="text-xs text-[#706B63]">
              Nội dung học thuật: <strong className="text-[#1F1E1D]">{evaluation.content_score.toFixed(1)}</strong> (80%) • Phong thái: <strong className="text-[#1F1E1D]">{evaluation.delivery_score?.toFixed(1) || "7.5"}</strong> (20%)
            </p>
          </div>
        </div>

        {/* Speed / WPM Badge */}
        {wpm && (
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#FAF8F5] border border-[#EAE4D9] self-start sm:self-auto text-xs text-[#5C564E]">
            <Activity className="w-4 h-4 text-[#D97757]" />
            <div>
              <span className="block font-medium text-[#1F1E1D]">{wpm} WPM</span>
              <span className="text-[10px] text-[#706B63]">
                {wpm >= 120 && wpm <= 160 ? "Tốc độ chuẩn bảo vệ" : wpm > 160 ? "Nói khá nhanh" : "Nói hơi chậm"}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Student Transcript & Audio Playback with Privacy Action */}
      <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#EAE4D9] space-y-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#1F1E1D]">
            <FileText className="w-4 h-4 text-[#D97757]" />
            <span>Nội dung bạn đã phát biểu (Transcript)</span>
          </div>

          {/* Privacy Audio Lifecycle Controls */}
          {answer.audio_status === "active" && answer.audio_url ? (
            <button
              type="button"
              onClick={handlePurgeAudio}
              disabled={isPurgingAudio}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer disabled:opacity-50"
              title="Xóa vĩnh viễn tệp âm thanh giọng nói trên máy chủ"
            >
              {isPurgingAudio ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
              <span>Tiêu hủy file âm thanh (Privacy)</span>
            </button>
          ) : (
            <span className="inline-flex items-center gap-1 text-[11px] text-[#706B63] bg-white px-2.5 py-0.5 rounded-full border border-[#DDD5C9]">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              File âm thanh đã tiêu hủy an toàn
            </span>
          )}
        </div>

        {/* Audio Player if still active */}
        {answer.audio_status === "active" && answer.audio_url && (
          <div className="pt-1 pb-2">
            <audio controls src={answer.audio_url} className="w-full h-8 accent-[#D97757]" />
          </div>
        )}

        {/* Transcribed Text */}
        <p className="text-xs sm:text-sm text-[#443E37] leading-relaxed italic bg-white p-3.5 rounded-xl border border-[#EAE4D9]">
          "{answer.transcript || "Không có nội dung văn bản."}"
        </p>
      </div>

      {/* Rubric Criteria Breakdown Toggle */}
      <div className="rounded-2xl border border-[#E0D9CE] overflow-hidden bg-[#FAF8F5]">
        <button
          type="button"
          onClick={() => setIsRubricOpen(!isRubricOpen)}
          className="w-full px-5 py-3 flex items-center justify-between text-left text-xs font-semibold text-[#1F1E1D] hover:bg-[#F2ECE1] transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#D97757]" />
            <span>Xem chi tiết điểm thành phần (Rubric tiêu chí)</span>
          </div>
          {isRubricOpen ? <ChevronUp className="w-4 h-4 text-[#706B63]" /> : <ChevronDown className="w-4 h-4 text-[#706B63]" />}
        </button>

        {isRubricOpen && (
          <div className="p-5 border-t border-[#E0D9CE] bg-white grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#EAE4D9]">
              <span className="text-[#706B63] block mb-1">Chính xác kỹ thuật (40%)</span>
              <span className="font-bold text-sm text-[#1F1E1D]">
                {criterionScores.technical_accuracy?.toFixed(1) || "--"}/10
              </span>
            </div>
            <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#EAE4D9]">
              <span className="text-[#706B63] block mb-1">Đầy đủ trọng tâm (35%)</span>
              <span className="font-bold text-sm text-[#1F1E1D]">
                {criterionScores.completeness?.toFixed(1) || "--"}/10
              </span>
            </div>
            <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#EAE4D9]">
              <span className="text-[#706B63] block mb-1">Lập luận phản biện (25%)</span>
              <span className="font-bold text-sm text-[#1F1E1D]">
                {criterionScores.reasoning_defense?.toFixed(1) || "--"}/10
              </span>
            </div>
            <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#EAE4D9]">
              <span className="text-[#706B63] block mb-1">Tốc độ nói (WPM)</span>
              <span className="font-bold text-sm text-[#1F1E1D]">
                {criterionScores.speech_pace?.toFixed(1) || "--"}/10
              </span>
            </div>
            <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#EAE4D9]">
              <span className="text-[#706B63] block mb-1">Trôi chảy & Ngắt nghỉ</span>
              <span className="font-bold text-sm text-[#1F1E1D]">
                {criterionScores.fluency?.toFixed(1) || "--"}/10
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Constructive Academic Feedback (Strengths, Weaknesses, Suggestions) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Strengths */}
        <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-200">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wide">
              Điểm mạnh
            </h4>
          </div>
          {feedback.strengths && feedback.strengths.length > 0 ? (
            <ul className="space-y-2 text-xs sm:text-sm text-emerald-950">
              {feedback.strengths.map((str, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-emerald-500 font-bold">•</span>
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-emerald-800 italic">Chưa ghi nhận điểm mạnh nổi bật.</p>
          )}
        </div>

        {/* Weaknesses & Suggestions */}
        <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-4 h-4 text-amber-600" />
            <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wide">
              Điểm cần cải thiện & Gợi ý
            </h4>
          </div>
          <div className="space-y-2 text-xs sm:text-sm text-amber-950">
            {feedback.weaknesses?.map((w, i) => (
              <div key={i} className="flex items-start gap-2 leading-relaxed">
                <span className="text-amber-500 font-bold">•</span>
                <span>{w}</span>
              </div>
            ))}
            {feedback.suggestions?.map((s, i) => (
              <div key={`sug-${i}`} className="flex items-start gap-2 leading-relaxed font-medium text-amber-900">
                <span className="text-amber-600 font-bold">↳</span>
                <span>{s}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Model Answer Accordion */}
      {feedback.model_answer && (
        <div className="rounded-2xl border border-[#DDD5C9] overflow-hidden bg-[#FAF8F5]">
          <button
            type="button"
            onClick={() => setIsModelAnswerOpen(!isModelAnswerOpen)}
            className="w-full px-5 py-3.5 flex items-center justify-between text-left text-xs sm:text-sm font-semibold text-[#1F1E1D] hover:bg-[#F2ECE1] transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#D97757]" />
              <span>Câu trả lời mẫu định hướng (Tham khảo trước Hội đồng)</span>
            </div>
            {isModelAnswerOpen ? <ChevronUp className="w-4 h-4 text-[#706B63]" /> : <ChevronDown className="w-4 h-4 text-[#706B63]" />}
          </button>

          {isModelAnswerOpen && (
            <div className="p-5 border-t border-[#DDD5C9] bg-white text-xs sm:text-sm text-[#3E3832] leading-relaxed whitespace-pre-line">
              {feedback.model_answer}
            </div>
          )}
        </div>
      )}

      {/* Bottom Footer Actions & Disclaimer */}
      <div className="pt-4 border-t border-[#F0EBE1] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <p className="text-[11px] text-[#706B63] max-w-md leading-relaxed">
          {evaluation.model_metadata?.disclaimer ||
            "Đánh giá được tạo tự động bởi AI nhằm mục đích rèn luyện phản xạ bảo vệ đồ án tốt nghiệp, không thay thế nhận xét trực tiếp của Hội đồng Chuyên môn."}
        </p>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleReevaluateClick}
            disabled={isReevaluating}
            className="px-3.5 py-2 rounded-xl border border-[#DDD5C9] bg-white hover:bg-[#FAF7F2] text-xs font-medium text-[#1F1E1D] transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            title="Chấm điểm lại nội dung câu trả lời này"
          >
            {isReevaluating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
            <span>Chấm lại</span>
          </button>

          <button
            type="button"
            onClick={onRerecord}
            className="px-4 py-2 rounded-xl bg-[#D97757] hover:bg-[#C86B4D] text-xs font-medium text-white transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            title="Thu âm câu trả lời mới cho câu hỏi này"
          >
            <Mic className="w-3.5 h-3.5" />
            <span>Thu âm lại</span>
          </button>
        </div>
      </div>
    </div>
  );
}
