"use client";

import React, { useState } from "react";
import {
  Mic,
  Square,
  Pause,
  Play,
  RotateCcw,
  Send,
  Volume2,
  AlertCircle,
  Clock,
  Loader2,
} from "lucide-react";
import { VoiceRecorderState } from "@/hooks/useVoiceRecorder";

interface VoiceRecorderSectionProps {
  recorder: VoiceRecorderState;
  recommendedSeconds: number;
  isSubmitting: boolean;
  onSubmit: (blob: Blob, durationSeconds: number) => Promise<void>;
  onCancel?: () => void;
  disabled?: boolean;
}

export function VoiceRecorderSection({
  recorder,
  recommendedSeconds,
  isSubmitting,
  onSubmit,
  onCancel,
  disabled = false,
}: VoiceRecorderSectionProps) {
  const {
    isRecording,
    isPaused,
    duration,
    audioBlob,
    audioUrl,
    audioLevel,
    error,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    resetRecording,
    formatDuration,
  } = recorder;

  const isOvertime = duration > recommendedSeconds;

  const handleSubmit = async () => {
    if (!audioBlob) return;
    await onSubmit(audioBlob, duration);
  };

  return (
    <div className="bg-[#1C1B1A] text-white rounded-3xl p-6 sm:p-8 shadow-md border border-[#2E2B27]">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <span className="text-xs font-bold text-[#D97757] tracking-wider uppercase block mb-1">
            Không gian phản biện Voice-First
          </span>
          <h3 className="font-serif text-lg sm:text-xl text-white font-normal">
            Luyện tập trả lời bằng Giọng nói
          </h3>
        </div>

        <div className="flex items-center gap-1.5 bg-white/10 px-3.5 py-1.5 rounded-full border border-white/10 text-xs text-[#D6D3D1]">
          <Clock className="w-3.5 h-3.5 text-[#D97757]" />
          <span>Mục tiêu: ~{recommendedSeconds}s</span>
        </div>
      </div>

      {/* Error notification if mic blocked */}
      {error && (
        <div className="mb-5 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 text-rose-300 text-xs sm:text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-400" />
          <p className="leading-relaxed">{error}</p>
        </div>
      )}

      {/* STATE 1: IDLE (Not recording yet, no recorded audio) */}
      {!isRecording && !audioBlob && (
        <div className="text-center py-8 px-4 bg-white/5 border border-white/10 rounded-2xl">
          <button
            type="button"
            onClick={startRecording}
            disabled={disabled}
            className="w-20 h-20 rounded-full bg-[#D97757] hover:bg-[#C86B4D] active:scale-95 text-white flex items-center justify-center mx-auto mb-4 transition-all shadow-lg hover:shadow-[#D97757]/30 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group"
            title="Bắt đầu ghi âm"
          >
            <Mic className="w-9 h-9 group-hover:scale-110 transition-transform" />
          </button>
          <h4 className="font-medium text-base text-white mb-1">
            Bấm để bắt đầu trả lời
          </h4>
          <p className="text-xs text-[#A8A29E] max-w-sm mx-auto leading-relaxed">
            Trả lời tự nhiên như đang đứng trước Hội đồng. Sau khi hoàn thành, AI sẽ phân tích giọng nói, đối chiếu tài liệu và chấm điểm Rubric.
          </p>
        </div>
      )}

      {/* STATE 2: RECORDING IN PROGRESS */}
      {isRecording && (
        <div className="py-6 px-4 bg-white/5 border border-white/10 rounded-2xl text-center">
          {/* Waveform audio level pulse */}
          <div className="flex items-center justify-center gap-1.5 h-12 mb-4">
            {[0.2, 0.4, 0.7, 1.0, 0.7, 0.4, 0.2].map((multiplier, idx) => {
              const height = isPaused
                ? 8
                : Math.max(8, Math.min(48, Math.round(audioLevel * 48 * multiplier + 10)));
              return (
                <div
                  key={idx}
                  style={{ height: `${height}px` }}
                  className={`w-1.5 rounded-full transition-all duration-75 ${
                    isPaused ? "bg-amber-400/50" : "bg-[#D97757]"
                  }`}
                />
              );
            })}
          </div>

          {/* Timer Display */}
          <div className="flex items-center justify-center gap-2 mb-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isPaused ? "bg-amber-400" : "bg-rose-500 animate-ping"
              }`}
            />
            <span
              className={`font-mono text-2xl sm:text-3xl font-bold tracking-wider ${
                isOvertime ? "text-amber-400" : "text-white"
              }`}
            >
              {formatDuration(duration)}
            </span>
            <span className="text-xs text-[#A8A29E]">/ {formatDuration(recommendedSeconds)}</span>
          </div>

          <p className="text-xs text-[#A8A29E] mb-6">
            {isPaused ? "Đang tạm dừng thu âm" : "Đang ghi âm câu trả lời của bạn..."}
          </p>

          {/* In-Recording Controls */}
          <div className="flex items-center justify-center gap-3">
            {/* Pause / Resume */}
            <button
              type="button"
              onClick={isPaused ? resumeRecording : pauseRecording}
              className="px-4 py-2.5 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 text-xs sm:text-sm font-medium text-white transition-colors flex items-center gap-2 cursor-pointer"
            >
              {isPaused ? <Play className="w-4 h-4 text-emerald-400" /> : <Pause className="w-4 h-4 text-amber-400" />}
              <span>{isPaused ? "Tiếp tục" : "Tạm dừng"}</span>
            </button>

            {/* Stop Recording */}
            <button
              type="button"
              onClick={stopRecording}
              className="px-6 py-2.5 rounded-xl bg-[#D97757] hover:bg-[#C86B4D] text-xs sm:text-sm font-medium text-white transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              <Square className="w-4 h-4 fill-white" />
              <span>Kết thúc & Xem lại</span>
            </button>

            {/* Cancel / Reset */}
            <button
              type="button"
              onClick={resetRecording}
              className="p-2.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
              title="Hủy bỏ và ghi lại từ đầu"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STATE 3: RECORDING STOPPED (Review & Submit) */}
      {!isRecording && audioBlob && (
        <div className="py-6 px-4 bg-white/5 border border-white/10 rounded-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pb-5 border-b border-white/10">
            <div>
              <span className="text-xs text-emerald-400 font-medium flex items-center gap-1.5 mb-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Đã thu âm xong ({formatDuration(duration)})
              </span>
              <p className="text-xs text-[#A8A29E]">
                Bạn có thể nghe lại trước khi nộp cho Hội đồng AI đánh giá.
              </p>
            </div>

            {/* Native HTML5 Audio Player */}
            {audioUrl && (
              <audio
                controls
                src={audioUrl}
                className="h-10 w-full sm:w-64 max-w-full accent-[#D97757]"
              />
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <button
              type="button"
              onClick={resetRecording}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-xs sm:text-sm font-medium text-white transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Thu âm lại</span>
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-[#D97757] hover:bg-[#C86B4D] active:scale-95 text-xs sm:text-sm font-medium text-white transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Đang gửi câu trả lời...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Nộp cho Hội đồng AI chấm điểm</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

