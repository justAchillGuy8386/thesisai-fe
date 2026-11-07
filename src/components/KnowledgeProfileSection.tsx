"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Sparkles,
  RefreshCw,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Brain,
  Lightbulb,
  CheckCircle2,
  HelpCircle,
} from "lucide-react";
import {
  knowledgeProfileService,
  KnowledgeProfileResponse,
  AnticipatedQuestion,
} from "@/services/knowledgeProfileService";

interface KnowledgeProfileSectionProps {
  projectId: number;
  hasDocuments: boolean;
}

export function KnowledgeProfileSection({
  projectId,
  hasDocuments,
}: KnowledgeProfileSectionProps) {
  const [profile, setProfile] = useState<KnowledgeProfileResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [generating, setGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedQuestionIdx, setExpandedQuestionIdx] = useState<number | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>("ALL");

  const fetchProfile = useCallback(async () => {
    try {
      setError(null);
      const data = await knowledgeProfileService.getKnowledgeProfile(projectId);
      setProfile(data);
      if (data?.status === "generating") {
        setGenerating(true);
      } else {
        setGenerating(false);
      }
    } catch (err: any) {
      console.error("Failed to load knowledge profile:", err);
      setError("Không thể tải hồ sơ tri thức.");
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Polling while generating
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (generating) {
      interval = setInterval(async () => {
        const data = await knowledgeProfileService.getKnowledgeProfile(projectId);
        if (data && data.status !== "generating") {
          setProfile(data);
          setGenerating(false);
        }
      }, 3000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [generating, projectId]);

  const handleGenerate = async (force = false) => {
    if (!hasDocuments) return;
    try {
      setGenerating(true);
      setError(null);
      const res = await knowledgeProfileService.generateKnowledgeProfile(projectId, force);
      setProfile(res);
    } catch (err: any) {
      setError(err.message || "Lỗi khi kích hoạt tổng hợp hồ sơ tri thức.");
      setGenerating(false);
    }
  };

  const getRoleBadgeStyle = (role: string) => {
    if (role.includes("CHỦ TỊCH")) {
      return "bg-indigo-50 text-indigo-700 border-indigo-200";
    }
    if (role.includes("PHẢN BIỆN")) {
      return "bg-purple-50 text-purple-700 border-purple-200";
    }
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  };

  const data = profile?.profile_data;
  const questions = data?.anticipated_questions || [];
  const filteredQuestions =
    selectedRole === "ALL"
      ? questions
      : questions.filter((q) => q.role === selectedRole);

  const availableRoles = Array.from(new Set(questions.map((q) => q.role)));

  return (
    <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-xs p-6 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-neutral-900 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-serif text-neutral-900 tracking-tight">
              Hồ Sơ Tri Thức Đồ Án & Dự Đoán Phản Biện
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Phân tích từ toàn văn tài liệu bằng mô hình ngôn ngữ cục bộ
            </p>
          </div>
        </div>

        {hasDocuments && (
          <button
            onClick={() => handleGenerate(true)}
            disabled={generating}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-xs ${
              generating
                ? "bg-neutral-100 text-neutral-400 cursor-not-allowed border border-neutral-200"
                : "bg-neutral-900 hover:bg-neutral-800 text-white hover:shadow-sm"
            }`}
          >
            <RefreshCw className={`w-4 h-4 ${generating ? "animate-spin" : ""}`} />
            {generating
              ? "Đang phân tích..."
              : profile?.status === "ready"
              ? "Cập nhật hồ sơ"
              : "Phân tích hồ sơ"}
          </button>
        )}
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* State: No documents uploaded yet */}
      {!hasDocuments && (
        <div className="py-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-neutral-100 text-neutral-400 flex items-center justify-center mx-auto">
            <Brain className="w-6 h-6" />
          </div>
          <p className="text-sm font-medium text-neutral-700">
            Chưa có tài liệu để tổng hợp hồ sơ tri thức
          </p>
          <p className="text-xs text-neutral-500 max-w-md mx-auto">
            Vui lòng tải lên tài liệu báo cáo hoặc đề cương đồ án để hệ thống trích xuất tri thức và dự đoán các câu hỏi phản biện.
          </p>
        </div>
      )}

      {/* State: Has documents but no profile generated yet */}
      {hasDocuments && !generating && (!profile || profile.status === "failed") && (
        <div className="py-10 text-center space-y-4 bg-neutral-50/60 rounded-2xl border border-dashed border-neutral-200 p-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mx-auto">
            <Sparkles className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-neutral-800">
              Chưa kích hoạt phân tích tri thức đồ án
            </h3>
            <p className="text-xs text-neutral-500 max-w-lg mx-auto">
              Hệ thống sẽ tổng hợp tóm tắt cốt lõi, phát hiện các điểm yếu tiềm ẩn và sinh bộ câu hỏi chất vấn từ 3 vai trò Hội đồng bảo vệ.
            </p>
          </div>
          <button
            onClick={() => handleGenerate(false)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-sm font-medium transition-all shadow-xs"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            Bắt đầu phân tích ngay
          </button>
        </div>
      )}

      {/* State: Generating */}
      {generating && (
        <div className="py-14 text-center space-y-4">
          <div className="relative w-14 h-14 mx-auto">
            <div className="absolute inset-0 rounded-full border-4 border-neutral-200 animate-pulse"></div>
            <div className="absolute inset-0 rounded-full border-4 border-neutral-900 border-t-transparent animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Brain className="w-6 h-6 text-neutral-900" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-neutral-900">
              Hệ thống đang nghiên cứu toàn văn đồ án của bạn...
            </p>
            <p className="text-xs text-neutral-500 max-w-md mx-auto">
              Đang trích xuất kiến trúc, phân tích lỗ hổng phương pháp và dự đoán các góc hỏi của Hội đồng bảo vệ.
            </p>
          </div>
        </div>
      )}

      {/* State: Ready */}
      {profile?.status === "ready" && data && !generating && (
        <div className="space-y-6">
          {/* Executive Summary & Tech */}
          <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200/80 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-500">
              <CheckCircle2 className="w-4 h-4 text-neutral-900" />
              Tóm tắt cốt lõi đề tài
            </div>
            <p className="text-sm text-neutral-700 leading-relaxed font-sans">
              {data.summary}
            </p>

            {/* Methodology & Tech Badges */}
            {data.methodology_and_tech.length > 0 && (
              <div className="pt-2 border-t border-neutral-200/60 flex flex-wrap gap-2">
                {data.methodology_and_tech.map((item, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-white text-neutral-800 border border-neutral-200/80 shadow-2xs"
                  >
                    {item}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Defense Weaknesses (Points of Interest for Committee) */}
          {data.defense_weaknesses.length > 0 && (
            <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-900">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                Điểm yếu & Khía cạnh Hội đồng thường xoáy sâu
              </div>
              <ul className="space-y-2">
                {data.defense_weaknesses.map((weakness, idx) => (
                  <li
                    key={idx}
                    className="text-xs sm:text-sm text-amber-900/90 flex items-start gap-2.5 leading-relaxed"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-2"></span>
                    <span>{weakness}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Anticipated Questions Section */}
          <div className="space-y-4 pt-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-neutral-700" />
                <h3 className="text-base font-bold font-serif text-neutral-900">
                  Bộ câu hỏi dự đoán từ Hội đồng
                </h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-100 font-semibold text-neutral-600">
                  {questions.length} câu
                </span>
              </div>

              {/* Role filter buttons */}
              {availableRoles.length > 1 && (
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                  <button
                    onClick={() => setSelectedRole("ALL")}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                      selectedRole === "ALL"
                        ? "bg-neutral-900 text-white"
                        : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                    }`}
                  >
                    Tất cả
                  </button>
                  {availableRoles.map((role) => (
                    <button
                      key={role}
                      onClick={() => setSelectedRole(role)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                        selectedRole === role
                          ? "bg-neutral-900 text-white"
                          : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Questions List */}
            <div className="space-y-3">
              {filteredQuestions.map((q, idx) => {
                const isExpanded = expandedQuestionIdx === idx;
                return (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-neutral-200 hover:border-neutral-300 transition-all bg-white shadow-2xs space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1.5 flex-1">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-md text-[11px] font-semibold border ${getRoleBadgeStyle(
                            q.role
                          )}`}
                        >
                          {q.role}
                        </span>
                        <h4 className="text-sm font-semibold text-neutral-900 leading-snug">
                          {q.question}
                        </h4>
                        <p className="text-xs text-neutral-500 italic">
                          Mục đích: {q.reason}
                        </p>
                      </div>

                      <button
                        onClick={() =>
                          setExpandedQuestionIdx(isExpanded ? null : idx)
                        }
                        className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 transition-colors shrink-0"
                        title={isExpanded ? "Thu gọn gợi ý" : "Xem gợi ý trả lời"}
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    {/* Collapsible Answer Hint */}
                    {isExpanded && (
                      <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200/80 text-xs text-neutral-700 space-y-1.5 animate-fadeIn">
                        <div className="flex items-center gap-1.5 font-semibold text-neutral-900">
                          <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                          Gợi ý định hướng trả lời bảo vệ:
                        </div>
                        <p className="leading-relaxed pl-5">
                          {q.suggested_answer_hint}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

