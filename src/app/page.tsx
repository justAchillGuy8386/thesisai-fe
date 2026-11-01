"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/Header";
import { Loader2, Sparkles, BookOpen, Mic } from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F6F1E8] flex flex-col items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-[#D97757]" />
        <span className="mt-3 text-sm text-[#7A756D] font-sans">
          Đang kiểm tra phiên làm việc...
        </span>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-[#F6F1E8] text-[#1F1E1D] flex flex-col selection:bg-[#D97757]/20 selection:text-[#1F1E1D]">
      <Header />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-12 flex flex-col items-center justify-center text-center">
        {/* Welcome Tag */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ECE6DC] border border-[#DDD5C9] text-xs text-[#5C564E] mb-6">
          <Sparkles className="w-3.5 h-3.5 text-[#D97757]" />
          <span>Phiên đăng nhập nghiên cứu an toàn</span>
        </div>

        {/* Title */}
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-[#1F1E1D] mb-4">
          Chào mừng, <span className="font-medium">{user.name}</span>
        </h1>

        {/* Subtitle */}
        <p className="font-sans text-base sm:text-lg text-[#6F6A62] max-w-xl mx-auto leading-relaxed mb-10">
          Bạn đang sử dụng ThesisAI với vai trò{" "}
          <span className="font-medium text-[#1F1E1D]">
            {user.role === "lecturer" ? "Giảng viên hướng dẫn" : "Học viên nghiên cứu"}
          </span>
          . Không gian luyện tập phản biện và quản lý đồ án đã sẵn sàng.
        </p>

        {/* Quick Transition Card to Phase 4 */}
        <div className="w-full max-w-xl bg-white rounded-2xl border border-[#E5DFD5] p-8 shadow-sm text-left">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#F6F1E8] border border-[#E0D9CE] flex items-center justify-center text-[#D97757]">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-semibold text-[#1F1E1D]">
                Không gian đồ án tốt nghiệp
              </h2>
              <p className="text-xs text-[#7A756D]">
                Giai đoạn tiếp theo: Khởi tạo và thiết lập đề tài đồ án
              </p>
            </div>
          </div>

          <p className="text-sm text-[#5C564E] leading-relaxed mb-6">
            Tại bước tiếp theo (Phase 4), bạn sẽ thiết lập thông tin đề tài, tải lên tài liệu đề cương và cấu hình mô hình RAG cục bộ để chuẩn bị cho phòng phản biện ảo.
          </p>

          <div className="flex items-center gap-2 text-xs text-[#8A847B] bg-[#F6F1E8] px-4 py-3 rounded-xl border border-[#EBE4D8]">
            <Mic className="w-4 h-4 text-[#D97757] shrink-0" />
            <span>
              Mọi dữ liệu tài liệu và giọng nói sẽ được xử lý bảo mật trên máy chủ cá nhân của bạn.
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}
