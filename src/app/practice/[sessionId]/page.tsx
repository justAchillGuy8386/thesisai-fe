"use client";

import React, { useState, useEffect, useCallback, Suspense, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  Mic,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  Loader2,
  RotateCcw,
} from "lucide-react";
import { toast } from "sonner";
import {
  practiceService,
  PracticeSessionDetail,
  PracticeSessionProgress,
  QuestionProgressItem,
  QuestionResponse,
  AnswerDetailResponse,
  AnswerEvaluationResponse,
} from "@/services/practiceService";
import { useVoiceRecorder } from "@/hooks/useVoiceRecorder";
import { VoiceRecorderSection } from "@/components/practice/VoiceRecorderSection";
import { EvaluationResultCard } from "@/components/practice/EvaluationResultCard";

const STATUS_LABELS: Record<string, string> = {
  unanswered: "Chưa trả lời",
  queued: "Đang chờ hàng đợi xử lý",
  transcribing: "Đang chuyển giọng nói thành văn bản",
  evaluating: "Hệ thống đang chấm điểm",
  completed: "Đã hoàn tất chấm điểm",
  failed: "Xử lý thất bại",
};

function PracticeRoomContent() {
  const params = useParams();
  const router = useRouter();
  const sessionId = Number(params?.sessionId);

  const [session, setSession] = useState<PracticeSessionDetail | null>(null);
  const [progress, setProgress] = useState<PracticeSessionProgress | null>(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isOutlineOpen, setIsOutlineOpen] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Voice recording & evaluation state
  const recorder = useVoiceRecorder();
  const [answersMap, setAnswersMap] = useState<Record<number, AnswerDetailResponse>>({});
  const [evaluationsMap, setEvaluationsMap] = useState<Record<number, AnswerEvaluationResponse>>({});
  const [isSubmittingAnswer, setIsSubmittingAnswer] = useState(false);
  const [isRerecordingMap, setIsRerecordingMap] = useState<Record<number, boolean>>({});

  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const currentQIdRef = useRef<number | null>(null);
  const prevStatusMapRef = useRef<Record<number, string>>({});

  // Fetch session details & whole-session progress on mount
  useEffect(() => {
    if (!sessionId || isNaN(sessionId)) return;

    const fetchDetail = async () => {
      setIsLoading(true);
      try {
        const [detailData, progressData] = await Promise.all([
          practiceService.getPracticeSessionDetail(sessionId),
          practiceService.getSessionProgress(sessionId).catch(() => null),
        ]);
        setSession(detailData);
        if (progressData) {
          setProgress(progressData);
          const initialStatusMap: Record<number, string> = {};
          progressData.questions.forEach((item) => {
            initialStatusMap[item.question_id] = item.processing_status;
          });
          prevStatusMapRef.current = initialStatusMap;
        }
      } catch (err: any) {
        toast.error(err.message || "Không thể tải thông tin phiên luyện tập.");
        router.push("/dashboard");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetail();
  }, [sessionId, router]);

  const currentQ: QuestionResponse | undefined = session?.questions?.[currentIdx];
  const isCompleted = session?.status === "completed" || session?.status === "partial_failed";

  useEffect(() => {
    currentQIdRef.current = currentQ?.id ?? null;
  }, [currentQ?.id]);

  // Fetch answer and evaluation for a specific question
  const fetchQuestionAnswerAndEvaluation = useCallback(
    async (qid: number) => {
      if (!sessionId) return;
      try {
        const ans = await practiceService.getAnswerDetail(sessionId, qid);
        setAnswersMap((prev) => ({ ...prev, [qid]: ans }));

        if (ans.processing_status === "completed") {
          try {
            const ev = await practiceService.getAnswerEvaluation(sessionId, qid);
            setEvaluationsMap((prev) => ({ ...prev, [qid]: ev }));
          } catch (evErr) {
            console.warn(`Evaluation for question #${qid} not ready yet:`, evErr);
          }
        }
      } catch (err: any) {
        // 404 means no answer submitted yet
      }
    },
    [sessionId]
  );

  // When switching question, fetch its answer & reset recording
  useEffect(() => {
    if (!currentQ) return;
    recorder.resetRecording();
    setIsOutlineOpen(false);
    fetchQuestionAnswerAndEvaluation(currentQ.id);
  }, [currentIdx, currentQ?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Determine whether any job in the session is still running in the background
  const hasAnyPendingAnswer =
    Boolean(progress?.has_pending_jobs) ||
    Object.values(answersMap).some(
      (a) =>
        a.processing_status === "queued" ||
        a.processing_status === "transcribing" ||
        a.processing_status === "evaluating"
    );

  // Whole-session background progress polling (only active while pending jobs exist)
  useEffect(() => {
    if (!sessionId || !hasAnyPendingAnswer) {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
      return;
    }

    const pollSessionProgress = async () => {
      try {
        const updatedProg = await practiceService.getSessionProgress(sessionId);
        setProgress(updatedProg);

        for (const item of updatedProg.questions) {
          const prevSt = prevStatusMapRef.current[item.question_id];
          const nextSt = item.processing_status;
          const wasPending =
            prevSt === "queued" || prevSt === "transcribing" || prevSt === "evaluating";

          if (wasPending && nextSt === "completed") {
            const scoreText =
              item.overall_score !== null && item.overall_score !== undefined
                ? ` (${item.overall_score.toFixed(1)}/10)`
                : "";
            toast.success(`Câu ${item.order_index} đã hoàn tất chấm điểm${scoreText}!`);
            if (currentQIdRef.current === item.question_id) {
              fetchQuestionAnswerAndEvaluation(item.question_id);
            }
          } else if (wasPending && nextSt === "failed") {
            toast.error(`Câu ${item.order_index} xử lý thất bại. Bạn có thể mở lại câu này để thu âm lại.`);
            if (currentQIdRef.current === item.question_id) {
              fetchQuestionAnswerAndEvaluation(item.question_id);
            }
          } else if (currentQIdRef.current === item.question_id && prevSt !== nextSt && nextSt !== "unanswered") {
            setAnswersMap((prev) => {
              const existing = prev[item.question_id];
              if (!existing) return prev;
              return {
                ...prev,
                [item.question_id]: {
                  ...existing,
                  processing_status: nextSt,
                },
              };
            });
          }

          prevStatusMapRef.current[item.question_id] = nextSt;
        }
      } catch (pollErr) {
        console.error("Session progress polling error:", pollErr);
      }
    };

    if (!pollingIntervalRef.current) {
      pollingIntervalRef.current = setInterval(pollSessionProgress, 3000);
    }

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    };
  }, [sessionId, hasAnyPendingAnswer, fetchQuestionAnswerAndEvaluation]);

  // Submit audio answer
  const handleSubmitAnswer = async (audioBlob: Blob, durationSeconds: number) => {
    if (!currentQ || !sessionId) return;

    setIsSubmittingAnswer(true);
    try {
      const res = await practiceService.submitAnswerAudio(
        sessionId,
        currentQ.id,
        audioBlob,
        durationSeconds
      );

      // Update local answer state to queued immediately
      setAnswersMap((prev) => ({
        ...prev,
        [currentQ.id]: {
          id: res.id,
          question_id: res.question_id,
          audio_mime_type: audioBlob.type || "audio/webm",
          duration_seconds: res.duration_seconds,
          processing_status: "queued",
          audio_status: res.audio_status,
          created_at: res.created_at,
          updated_at: res.created_at,
        },
      }));

      // Clear stale evaluation if re-recording
      setEvaluationsMap((prev) => {
        const next = { ...prev };
        delete next[currentQ.id];
        return next;
      });

      prevStatusMapRef.current[currentQ.id] = "queued";

      // Optimistically refresh whole-session progress
      practiceService
        .getSessionProgress(sessionId)
        .then((p) => setProgress(p))
        .catch(() => {});

      // Exit re-recording mode
      setIsRerecordingMap((prev) => ({ ...prev, [currentQ.id]: false }));
      recorder.resetRecording();
      toast.success(
        `Đã nộp Câu ${currentIdx + 1}! Hệ thống đang xử lý ngầm — bạn có thể chuyển sang câu tiếp theo.`
      );
    } catch (err: any) {
      toast.error(err.message || "Không thể gửi bản ghi âm câu trả lời.");
    } finally {
      setIsSubmittingAnswer(false);
    }
  };

  // Re-evaluate action
  const handleReevaluate = async () => {
    if (!currentQ || !sessionId) return;
    const ev = await practiceService.reevaluateAnswer(sessionId, currentQ.id);
    setEvaluationsMap((prev) => ({ ...prev, [currentQ.id]: ev }));
    practiceService
      .getSessionProgress(sessionId)
      .then((p) => setProgress(p))
      .catch(() => {});
  };

  // Mark session complete
  const handleCompleteSession = async () => {
    if (isCompleted || !session) {
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center gap-4 text-[#706B63]">
        <Loader2 className="w-8 h-8 animate-spin text-[#D97757]" />
        <p className="text-sm font-medium">Đang chuẩn bị phòng luyện tập bảo vệ...</p>
      </div>
    );
  }

  if (!session || !session.questions || session.questions.length === 0 || !currentQ) {
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

  const currentAnswer = answersMap[currentQ.id];
  const currentEvaluation = evaluationsMap[currentQ.id] || null;
  const isRerecording = isRerecordingMap[currentQ.id] || false;

  const progressByQuestionId: Record<number, QuestionProgressItem> = {};
  if (progress?.questions) {
    for (const item of progress.questions) {
      progressByQuestionId[item.question_id] = item;
    }
  }

  const getQuestionStatus = (q: QuestionResponse): string => {
    const localAns = answersMap[q.id];
    const progItem = progressByQuestionId[q.id];
    if (progItem) return progItem.processing_status;
    if (localAns) return localAns.processing_status;
    return q.answer_processing_status || (q.is_answered ? "completed" : "unanswered");
  };

  const answeredCount =
    progress?.answered_count ??
    session.questions.filter((q) => getQuestionStatus(q) !== "unanswered").length;
  const pendingCount = (progress?.queued_count ?? 0) + (progress?.processing_count ?? 0);
  const failedCount = progress?.failed_count ?? 0;

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
                Phiên Luyện tập #{session.session_number ?? session.id}
              </h1>
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                  session.status === "partial_failed"
                    ? "bg-rose-100 text-rose-800"
                    : isCompleted
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-amber-100 text-amber-800"
                }`}
              >
                {session.status === "partial_failed"
                  ? "Hoàn tất một phần"
                  : isCompleted
                  ? "Đã hoàn thành"
                  : "Đang luyện tập"}
              </span>
            </div>
            <p className="text-xs text-[#706B63] mt-1">
              Phòng luyện tập bảo vệ • {answeredCount}/{session.questions.length} câu đã trả lời
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
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-[#D97757] uppercase tracking-wider">
              Danh sách câu hỏi
            </span>
            <span className="text-xs text-[#706B63] font-medium">
              {answeredCount} / {session.questions.length} đã nộp
            </span>
          </div>

          {/* Live background job indicator (only visible when pending or failed) */}
          {(pendingCount > 0 || failedCount > 0) && (
            <div className="mb-4 flex flex-wrap items-center gap-2 text-[11px]">
              {pendingCount > 0 && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 font-medium">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Đang xử lý ngầm: {pendingCount} câu
                </span>
              )}
              {failedCount > 0 && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 font-medium">
                  <AlertCircle className="w-3 h-3" />
                  Lỗi: {failedCount} câu
                </span>
              )}
            </div>
          )}

          {/* Question Pills Grid */}
          <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-4 gap-2 mb-5">
            {session.questions.map((q, idx) => {
              const isActive = idx === currentIdx;
              const qStatus = getQuestionStatus(q);
              const progItem = progressByQuestionId[q.id];
              const isDone = qStatus === "completed";
              const isQueued = qStatus === "queued";
              const isWorking = qStatus === "transcribing" || qStatus === "evaluating";
              const isFailed = qStatus === "failed";
              const isDiffEasy = q.difficulty.toLowerCase().includes("easy") || q.difficulty.includes("dễ");
              const isDiffHard = q.difficulty.toLowerCase().includes("hard") || q.difficulty.includes("khó");

              const statusTooltip =
                isDone && progItem?.overall_score !== null && progItem?.overall_score !== undefined
                  ? `${STATUS_LABELS.completed} (${progItem.overall_score.toFixed(1)}/10)`
                  : STATUS_LABELS[qStatus] || qStatus;

              return (
                <button
                  key={q.id}
                  onClick={() => {
                    setCurrentIdx(idx);
                  }}
                  title={`Câu ${idx + 1}: ${statusTooltip}`}
                  className={`h-12 rounded-xl text-xs font-semibold flex flex-col items-center justify-center transition-all cursor-pointer relative ${
                    isActive
                      ? "bg-[#D97757] text-white shadow-xs scale-105 z-10"
                      : isDone
                      ? "bg-emerald-50 border border-emerald-300 text-emerald-800"
                      : isWorking || isQueued
                      ? "bg-amber-50 border border-amber-300 text-amber-900"
                      : isFailed
                      ? "bg-rose-50 border border-rose-300 text-rose-800"
                      : "bg-[#FAF8F5] border border-[#EAE4D9] text-[#5C564E] hover:bg-[#F2ECE1]"
                  }`}
                >
                  <span className="leading-tight flex items-center gap-1">
                    {idx + 1}
                    {isDone && (
                      <CheckCircle2
                        className={`w-3 h-3 ${isActive ? "text-white" : "text-emerald-600"}`}
                      />
                    )}
                    {isWorking && (
                      <Loader2
                        className={`w-3 h-3 animate-spin ${isActive ? "text-white" : "text-amber-600"}`}
                      />
                    )}
                    {isQueued && (
                      <Clock
                        className={`w-3 h-3 ${isActive ? "text-white" : "text-amber-600"}`}
                      />
                    )}
                    {isFailed && (
                      <AlertCircle
                        className={`w-3 h-3 ${isActive ? "text-white" : "text-rose-600"}`}
                      />
                    )}
                  </span>
                  <span
                    className={`w-1.5 h-1.5 rounded-full mt-1 ${
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

          {/* Difficulty & Status Legend */}
          <div className="pt-4 border-t border-[#F0EBE1] space-y-2.5 text-[11px] text-[#706B63]">
            <div className="flex items-center justify-between">
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
                <span>Khó</span>
              </div>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-[#F7F3EC] text-[10px]">
              <span className="inline-flex items-center gap-1">
                <Clock className="w-3 h-3 text-amber-600" />
                Chờ xử lý
              </span>
              <span className="inline-flex items-center gap-1">
                <Loader2 className="w-3 h-3 text-amber-600" />
                Đang chấm
              </span>
              <span className="inline-flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                Đã xong
              </span>
            </div>
          </div>
        </div>

        {/* Right Column (8 cols): Active Question Focus, Voice Recorder & Evaluation Display */}
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
                    (Bấm để xem gợi ý)
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

          {/* DYNAMIC WORKSPACE: Recording Section vs Evaluation Card */}
          {(!currentAnswer || isRerecording) ? (
            <div>
              {isRerecording && (
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs text-[#706B63]">
                    Đang ở chế độ thu âm lại câu trả lời...
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setIsRerecordingMap((prev) => ({ ...prev, [currentQ.id]: false }))
                    }
                    className="text-xs text-[#D97757] hover:underline cursor-pointer"
                  >
                    Hủy thu âm lại (Xem kết quả cũ)
                  </button>
                </div>
              )}
              <VoiceRecorderSection
                recorder={recorder}
                recommendedSeconds={currentQ.recommended_seconds}
                isSubmitting={isSubmittingAnswer}
                onSubmit={handleSubmitAnswer}
                disabled={isCompleted}
              />
            </div>
          ) : (
            <EvaluationResultCard
              sessionId={sessionId}
              questionId={currentQ.id}
              answer={currentAnswer}
              evaluation={currentEvaluation}
              onReevaluate={handleReevaluate}
              onRerecord={() => {
                setIsRerecordingMap((prev) => ({ ...prev, [currentQ.id]: true }));
              }}
              onAudioPurged={() => fetchQuestionAnswerAndEvaluation(currentQ.id)}
              hasNextQuestion={currentIdx < session.questions.length - 1}
              onNextQuestion={() => {
                if (currentIdx < session.questions.length - 1) {
                  setCurrentIdx(currentIdx + 1);
                }
              }}
            />
          )}

          {/* Bottom Question Stepper Navigation */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => {
                if (currentIdx > 0) {
                  setCurrentIdx(currentIdx - 1);
                }
              }}
              disabled={currentIdx === 0}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#DDD5C9] bg-white hover:bg-[#FAF7F2] text-xs sm:text-sm font-medium text-[#1F1E1D] transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed shadow-xs"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Câu trước</span>
            </button>

            <span className="text-xs text-[#706B63] font-medium">
              Câu {currentIdx + 1} / {session.questions.length}
            </span>

            <button
              onClick={() => {
                if (currentIdx < session.questions.length - 1) {
                  setCurrentIdx(currentIdx + 1);
                }
              }}
              disabled={currentIdx === session.questions.length - 1}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#D97757] hover:bg-[#C86B4D] text-xs sm:text-sm font-medium text-white transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed shadow-xs"
            >
              <span>Câu tiếp theo</span>
              <ChevronRight className="w-4 h-4" />
            </button>
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
