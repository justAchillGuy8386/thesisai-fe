"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Mic,
  Sparkles,
  Play,
  CheckCircle2,
  Clock,
  ArrowRight,
  Loader2,
  RotateCcw,
  Calendar,
  Layers,
  HelpCircle,
} from "lucide-react";
import { toast } from "sonner";
import {
  practiceService,
  PracticeSessionListItem,
} from "@/services/practiceService";

interface PracticeSessionsSectionProps {
  projectId: number;
  hasDocuments: boolean;
}

export default function PracticeSessionsSection({
  projectId,
  hasDocuments,
}: PracticeSessionsSectionProps) {
  const router = useRouter();
  const [sessions, setSessions] = useState<PracticeSessionListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  const fetchSessions = async () => {
    setIsLoading(true);
    try {
      const data = await practiceService.listPracticeSessions(projectId);
      setSessions(data);
    } catch (err: any) {
      // Don't show toast if simply empty
      setSessions([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchSessions();
    }
  }, [projectId]);

  const handleCreateSession = async () => {
    if (!hasDocuments) {
      toast.warning(
        "Vui lòng tải lên tài liệu đồ án trước khi bắt đầu luyện tập để Hội đồng AI có căn cứ sinh câu hỏi!"
      );
      return;
    }

    setIsCreating(true);
    const toastId = toast.loading("Hệ thống đang phân tích tài liệu và biên soạn 12 câu hỏi phản biện...");
    try {
      const newSession = await practiceService.createPracticeSession(
        projectId,
        "question_answer",
        12
      );
      toast.dismiss(toastId);
      toast.success(
        `Đã tạo thành công Phiên #${newSession.session_number ?? newSession.id} với ${newSession.questions.length} câu hỏi bảo vệ!`
      );
      // Navigate to the practice room
      router.push(`/practice/${newSession.id}`);
    } catch (err: any) {
      toast.dismiss(toastId);
      toast.error(
        err.message || "Không thể khởi tạo phiên luyện tập. Vui lòng thử lại sau ít phút."
      );
    } finally {
      setIsCreating(false);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-[#EAE4D9] p-6 sm:p-8 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#F0EBE1]">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#D97757] uppercase tracking-wider mb-1">
            <Mic className="w-4 h-4" />
            <span>Phòng Luyện Tập Bảo Vệ</span>
          </div>
          <h3 className="font-serif text-2xl text-[#1F1E1D] font-normal">
            Lịch sử & Phiên Luyện tập Phản biện
          </h3>
          <p className="text-xs sm:text-sm text-[#706B63] mt-1">
            Bộ câu hỏi phân tầng (Dễ, Trung bình, Khó) kèm dàn ý và căn cứ trích dẫn từ tài liệu đồ án.
          </p>
        </div>

        <button
          onClick={handleCreateSession}
          disabled={isCreating}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-[#D97757] hover:bg-[#C86B4D] active:scale-[0.99] text-white text-xs sm:text-sm font-medium transition-all shadow-xs cursor-pointer disabled:opacity-60 whitespace-nowrap self-start sm:self-auto"
        >
          {isCreating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Đang biên soạn câu hỏi...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Bắt đầu phiên luyện tập mới</span>
            </>
          )}
        </button>
      </div>

      {/* Content */}
      <div className="pt-6">
        {isLoading ? (
          <div className="py-12 flex flex-col items-center justify-center gap-3 text-[#706B63]">
            <Loader2 className="w-6 h-6 animate-spin text-[#D97757]" />
            <p className="text-xs sm:text-sm">Đang tải lịch sử phiên luyện tập...</p>
          </div>
        ) : sessions.length === 0 ? (
          <div className="py-12 text-center max-w-md mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-[#FAF7F2] border border-[#DDD5C9] flex items-center justify-center mx-auto mb-3 text-[#D97757]">
              <HelpCircle className="w-6 h-6" />
            </div>
            <h4 className="font-serif text-lg text-[#1F1E1D] mb-1 font-normal">
              Chưa có phiên luyện tập nào
            </h4>
            <p className="text-xs sm:text-sm text-[#706B63] mb-5 leading-relaxed">
              Bấm nút &ldquo;Bắt đầu phiên luyện tập mới&rdquo; để AI phân tích tài liệu và sinh bộ 12 câu hỏi phản biện bảo vệ đồ án của bạn.
            </p>
            <button
              onClick={handleCreateSession}
              disabled={isCreating}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#DDD5C9] text-xs font-medium text-[#1F1E1D] hover:bg-[#FAF7F2] transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#D97757]" />
              <span>Khởi tạo ngay</span>
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {sessions.map((s) => {
              const isCompleted = s.status === "completed";
              const progressPct =
                s.total_questions > 0
                  ? Math.round((s.answered_questions / s.total_questions) * 100)
                  : 0;

              return (
                <div
                  key={s.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl border border-[#EAE4D9] bg-[#FAF8F5] hover:bg-white hover:border-[#D97757]/40 transition-all duration-200"
                >
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                        isCompleted
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <Play className="w-4 h-4 ml-0.5" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-sm sm:text-base text-[#1F1E1D]">
                          Phiên #{s.session_number ?? s.id}
                        </span>
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#EFE9DF] text-[#5C564E] font-medium">
                          {s.mode === "question_answer"
                            ? "Vấn đáp phản xạ (Mode A)"
                            : "Thuyết trình slide (Mode B)"}
                        </span>
                        <span
                          className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                            isCompleted
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {isCompleted ? "Đã hoàn thành" : "Đang thực hiện"}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 mt-2 text-xs text-[#706B63] flex-wrap">
                        <span className="inline-flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatDate(s.started_at)}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5" />
                          {s.total_questions} câu hỏi
                        </span>
                        <span>
                          Tiến độ: {s.answered_questions}/{s.total_questions} câu ({progressPct}%)
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end sm:shrink-0">
                    <button
                      onClick={() => router.push(`/practice/${s.id}`)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-[#DDD5C9] hover:bg-[#FAF7F2] hover:border-[#D97757] text-[#1F1E1D] text-xs sm:text-sm font-medium transition-all cursor-pointer group shadow-2xs"
                    >
                      <span>{isCompleted ? "Xem lại kết quả" : "Vào phòng luyện tập"}</span>
                      <ArrowRight className="w-4 h-4 text-[#D97757] group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

