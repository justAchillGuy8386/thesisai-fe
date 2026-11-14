"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  Mic,
  MicOff,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  HelpCircle,
  Loader2,
  Flag,
} from "lucide-react";
import { toast } from "sonner";
import {
  practiceService,
  PracticeSessionDetail,
  QuestionResponse,
} from "@/services/practiceService";

function PracticeRoomContent() {
  const params = useParams();
  const router = useRouter();
  const sessionId = Number(params?.sessionId);

  const [session, setSession] = useState<PracticeSessionDetail | null>(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isOutlineOpen, setIsOutlineOpen] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  useEffect(() => {
    if (!sessionId || isNaN(sessionId)) return;

    const fetchDetail = async () => {
      setIsLoading(true);
      try {
        const data = await practiceService.getPracticeSessionDetail(sessionId);
        setSession(data);
      } catch (err: any) {
        toast.error(err.message || "Không thể tải thông tin phiên luyện tập.");
        router.push("/dashboard");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetail();
  }, [sessionId, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center gap-4 text-[#706B63]">
        <Loader2 className="w-8 h-8 animate-spin text-[#D97757]" />
        <p className="text-sm font-medium">Đang chuẩn bị phòng luyện tập bảo vệ...</p>
      </div>
    );
  }

  if (!session || !session.questions || session.questions.length === 0) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-14 h-14 rounded-2xl bg-white border border-[#DDD5C9] flex items-center justify-center mx-auto mb-4 text-[#D97757]">
          <AlertCircle className="w-7 h-7" />
        </div>
        <h2 className="font-serif text-2xl text-[#1F1E1D] mb-2 font-normal">
          Không tìm thấy câu hỏi trong phiên này
        </h2>
        <p className="text-sm text-[#706B63] max-w-md mb-6 leading-relaxed">
          Phiên luyện tập chưa có câu hỏi nào được sinh hoặc đã bị hủy.
        </p>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#D97757] text-white text-sm font-medium hover:bg-[#C86B4D] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Về Bảng điều khiển</span>
        </Link>
      </div>
    );
  }

  const currentQ: QuestionResponse = session.questions[currentIdx];
  const isCompleted = session.status === "completed";

  const handleCompleteSession = async () => {
    if (isCompleted) {
      toast.info("Phiên luyện tập này đã hoàn thành.");
      return;
    }

    setIsUpdatingStatus(true);
    try {
      const updated = await practiceService.updateSessionStatus(session.id, "completed");
      setSession(updated);
      toast.success("Đã hoàn thành phiên luyện tập bảo vệ!");
    } catch (err: any) {
      toast.error(err.message || "Không thể cập nhật trạng thái phiên.");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const getDifficultyBadge = (difficulty: string) => {
    const d = difficulty.toLowerCase();
    if (d.includes("easy") || d.includes("dễ")) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          Mức độ: Dễ
        </span>
      );
    }
    if (d.includes("hard") || d.includes("khó")) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
          Mức độ: Khó & Xoáy sâu
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200">
        <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
        Mức độ: Trung bình
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1F1E1D] flex flex-col">
      {/* Top Bar Navigation */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-[#EAE4D9] px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="w-9 h-9 rounded-xl border border-[#DDD5C9] bg-white hover:bg-[#FAF7F2] flex items-center justify-center text-[#5C564E] transition-colors cursor-pointer"
            title="Quay lại Bảng điều khiển"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-lg sm:text-xl text-[#1F1E1D] font-medium leading-none">
                Phiên Luyện tập #{session.id}
              </h1>
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                  isCompleted
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-amber-100 text-amber-800"
                }`}
              >
                {isCompleted ? "Đã hoàn thành" : "Đang luyện tập"}
              </span>
            </div>
            <p className="text-xs text-[#706B63] mt-1">
              Mô phỏng phản biện Hội đồng • {session.questions.length} câu hỏi đánh giá
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {!isCompleted && (
            <button
              onClick={handleCompleteSession}
              disabled={isUpdatingStatus}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#DDD5C9] bg-white hover:bg-[#FAF7F2] text-xs font-medium text-[#1F1E1D] transition-colors cursor-pointer disabled:opacity-60"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Kết thúc phiên</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Practice Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (4 cols): Question Navigation Index */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-[#EAE4D9] p-5 sm:p-6 shadow-xs flex flex-col h-fit lg:sticky lg:top-24">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-[#D97757] uppercase tracking-wider">
              Danh sách câu hỏi
            </span>
            <span className="text-xs text-[#706B63] font-medium">
              Câu {currentIdx + 1} / {session.questions.length}
            </span>
          </div>

          {/* Question Pills Grid */}
          <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-4 gap-2 mb-6">
            {session.questions.map((q, idx) => {
              const isActive = idx === currentIdx;
              const isDiffEasy = q.difficulty.toLowerCase().includes("easy") || q.difficulty.includes("dễ");
              const isDiffHard = q.difficulty.toLowerCase().includes("hard") || q.difficulty.includes("khó");

              return (
                <button
                  key={q.id}
                  onClick={() => {
                    setCurrentIdx(idx);
                    setIsOutlineOpen(false);
                  }}
                  className={`h-11 rounded-xl text-xs font-semibold flex flex-col items-center justify-center transition-all cursor-pointer relative ${
                    isActive
                      ? "bg-[#D97757] text-white shadow-xs scale-105 z-10"
                      : "bg-[#FAF8F5] border border-[#EAE4D9] text-[#5C564E] hover:bg-[#F2ECE1]"
                  }`}
                >
                  <span className="leading-tight">{idx + 1}</span>
                  <span
                    className={`w-1.5 h-1.5 rounded-full mt-0.5 ${
                      isActive
                        ? "bg-white"
                        : isDiffEasy
                        ? "bg-emerald-500"
                        : isDiffHard
                        ? "bg-rose-500"
                        : "bg-sky-500"
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Difficulty Legend */}
          <div className="pt-4 border-t border-[#F0EBE1] flex items-center justify-between text-xs text-[#706B63]">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Dễ</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-sky-500" />
              <span>Trung bình</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span>Khó / Xoáy sâu</span>
            </div>
          </div>
        </div>

        {/* Right Column (8 cols): Active Question Focus & Voice Bridge */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Question Card */}
          <div className="bg-white rounded-3xl border border-[#EAE4D9] p-6 sm:p-8 shadow-xs">
            {/* Metadata Tags */}
            <div className="flex items-center justify-between gap-3 flex-wrap mb-5">
              <div className="flex items-center gap-2 flex-wrap">
                {getDifficultyBadge(currentQ.difficulty)}
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#FAF7F2] border border-[#E0D9CE] text-[#5C564E]">
                  {currentQ.topic_competency}
                </span>
              </div>

              <div className="inline-flex items-center gap-1 text-xs text-[#706B63] bg-[#FAF8F5] px-3 py-1 rounded-full border border-[#EAE4D9]">
                <Clock className="w-3.5 h-3.5 text-[#D97757]" />
                <span>Khuyến nghị: {currentQ.recommended_seconds}s</span>
              </div>
            </div>

            {/* Question Text */}
            <h2 className="font-serif text-xl sm:text-2xl text-[#1F1E1D] font-normal leading-relaxed mb-6">
              {currentQ.question_text}
            </h2>

            {/* Document Grounding Citation Badge */}
            <div className="flex items-center gap-2 p-3 rounded-xl bg-[#FAF8F5] border border-[#EAE4D9] text-xs text-[#5C564E] mb-6">
              <BookOpen className="w-4 h-4 text-[#D97757] shrink-0" />
              <span>
                Căn cứ tài liệu:{" "}
                <strong className="text-[#1F1E1D]">
                  {currentQ.source_chunk_ids?.length || 1} đoạn trích
                </strong>{" "}
                xuất xứ trực tiếp từ đồ án của bạn.
              </span>
            </div>

            {/* Expected Answer Outline Accordion (Toggle) */}
            <div className="rounded-2xl border border-[#E0D9CE] overflow-hidden bg-[#FAF8F5]">
              <button
                type="button"
                onClick={() => setIsOutlineOpen(!isOutlineOpen)}
                className="w-full px-5 py-3.5 flex items-center justify-between text-left text-xs sm:text-sm font-medium text-[#1F1E1D] hover:bg-[#F2ECE1] transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#D97757]" />
                  <span>Dàn ý câu trả lời kỳ vọng từ Hội đồng</span>
                  <span className="text-xs text-[#706B63] font-normal">
                    (Bấm để xem hướng dẫn)
                  </span>
                </div>
                {isOutlineOpen ? (
                  <ChevronUp className="w-4 h-4 text-[#706B63]" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[#706B63]" />
                )}
              </button>

              {isOutlineOpen && (
                <div className="p-5 border-t border-[#E0D9CE] bg-white text-xs sm:text-sm text-[#443E37] leading-relaxed whitespace-pre-line animate-in fade-in duration-150">
                  {currentQ.expected_answer_outline}
                </div>
              )}
            </div>
          </div>

          {/* Voice Practice & Recording Launchpad (Bridge to Phase 8) */}
          <div className="bg-gradient-to-b from-[#1C1B1A] to-[#2B2926] text-white rounded-3xl p-6 sm:p-8 shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <span className="text-xs font-bold text-[#D97757] tracking-wider uppercase block mb-1">
                  Không gian thu âm phản biện
                </span>
                <h3 className="font-serif text-xl sm:text-2xl text-white font-normal">
                  Luyện tập trả lời bằng Giọng nói
                </h3>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto bg-white/10 px-3.5 py-1.5 rounded-full border border-white/10 text-xs text-[#D6D3D1]">
                <Clock className="w-3.5 h-3.5 text-[#D97757]" />
                <span>120s / câu hỏi</span>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-[#D97757]/20 border border-[#D97757]/40 flex items-center justify-center mx-auto mb-4 text-[#D97757]">
                <Mic className="w-8 h-8 animate-pulse" />
              </div>
              <h4 className="font-medium text-base text-white mb-1.5">
                Micro Thu Âm & Chấm Điểm AI (Sắp ra mắt tại Phase 8)
              </h4>
              <p className="text-xs sm:text-sm text-[#A8A29E] max-w-md mx-auto leading-relaxed">
                Tại Phase 8, hệ thống sẽ tự động thu âm giọng nói của bạn qua Web Audio, chuyển thành văn bản (STT), đối chiếu RAG và chấm điểm theo Rubric học thuật.
              </p>
            </div>

            {/* Bottom Question Stepper Controls */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <button
                onClick={() => {
                  if (currentIdx > 0) {
                    setCurrentIdx(currentIdx - 1);
                    setIsOutlineOpen(false);
                  }
                }}
                disabled={currentIdx === 0}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-xs sm:text-sm font-medium text-white transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Câu trước</span>
              </button>

              <span className="text-xs text-[#A8A29E]">
                {currentIdx + 1} / {session.questions.length}
              </span>

              <button
                onClick={() => {
                  if (currentIdx < session.questions.length - 1) {
                    setCurrentIdx(currentIdx + 1);
                    setIsOutlineOpen(false);
                  }
                }}
                disabled={currentIdx === session.questions.length - 1}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#D97757] hover:bg-[#C86B4D] text-xs sm:text-sm font-medium text-white transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <span>Câu tiếp theo</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function PracticeRoomPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center gap-3 text-[#706B63]">
          <Loader2 className="w-8 h-8 animate-spin text-[#D97757]" />
          <p className="text-sm">Đang tải phòng luyện tập...</p>
        </div>
      }
    >
      <PracticeRoomContent />
    </Suspense>
  );
}
