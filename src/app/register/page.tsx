"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, AlertCircle, Loader2, GraduationCap, School } from "lucide-react";
import { api, AuthResponse } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<"student" | "lecturer">("student");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!fullName.trim() || !email.trim() || !password) {
      setErrorMessage("Vui lòng điền đầy đủ tất cả các trường thông tin.");
      return;
    }

    if (password.length < 8) {
      setErrorMessage("Mật khẩu bảo mật phải có ít nhất 8 ký tự.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await api.post<AuthResponse>("/auth/register", {
        full_name: fullName.trim(),
        email: email.trim().toLowerCase(),
        password,
        role,
      });

      login(res.access_token, res.user);
      router.push("/");
    } catch (err: any) {
      setErrorMessage(
        err.message || "Không thể tạo tài khoản. Vui lòng kiểm tra lại thông tin."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F1E8] text-[#1F1E1D] flex flex-col lg:flex-row selection:bg-[#D97757]/20 selection:text-[#1F1E1D]">
      {/* Left Column: Full-bleed Academic Research Visual (50% width, min-h-screen) */}
      <div className="relative w-full lg:w-1/2 min-h-[380px] sm:min-h-[460px] lg:min-h-screen bg-[#ECE6DC] overflow-hidden">
        <Image
          src="/thesis-workspace.jpg"
          alt="Sinh viên nghiên cứu tài liệu chuẩn bị bảo vệ đồ án tốt nghiệp"
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
        />
        {/* Subtle Dark Gradient Overlay at the bottom with 1-line quote */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent p-8 sm:p-10 lg:p-12 flex items-center">
          <p className="text-white/95 text-base sm:text-lg lg:text-xl font-serif italic tracking-wide whitespace-nowrap overflow-hidden text-ellipsis drop-shadow-md">
            &ldquo;Sự tự tin trước hội đồng đến từ những buổi luyện tập chân thực cùng ThesisAI.&rdquo;
          </p>
        </div>
      </div>

      {/* Right Column: Clean Absolutely Centered Register Form with 500px width */}
      <div className="relative w-full lg:w-1/2 min-h-screen flex flex-col items-center justify-center p-6 sm:p-10 lg:p-12 xl:p-16">
        {/* Top-Left Brand Logo (Aligned to top-left of the right half) */}
        <header className="absolute top-6 left-6 sm:top-8 sm:left-10 lg:top-10 lg:left-14">
          <Link
            href="/"
            className="flex items-center gap-2.5 group focus:outline-none"
          >
            {/* Claude-inspired Terracotta Sunburst Mark */}
            <div className="w-8 h-8 text-[#D97757] flex items-center justify-center transition-transform group-hover:rotate-12 duration-300">
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-full h-full"
              >
                <path d="M12 2a1 1 0 0 1 1 1v2.5a1 1 0 0 1-2 0V3a1 1 0 0 1 1-1zm0 14.5a1 1 0 0 1 1 1V21a1 1 0 0 1-2 0v-2.5a1 1 0 0 1 1-1zM4.93 4.93a1 1 0 0 1 1.41 0l1.77 1.77a1 1 0 0 1-1.41 1.41L4.93 6.34a1 1 0 0 1 0-1.41zm12.96 12.96a1 1 0 0 1 1.41 0l1.77 1.77a1 1 0 1 1-1.41 1.41l-1.77-1.77a1 1 0 0 1 0-1.41zM2 12a1 1 0 0 1 1-1h2.5a1 1 0 0 1 0 2H3a1 1 0 0 1-1-1zm16.5 0a1 1 0 0 1 1-1H21a1 1 0 0 1 0 2h-1.5a1 1 0 0 1-1-1zM4.93 19.07a1 1 0 0 1 1.41-1.41l1.77 1.77a1 1 0 1 1-1.41 1.41L4.93 19.07zm12.96-12.96a1 1 0 0 1 1.41-1.41l1.77 1.77a1 1 0 0 1-1.41 1.41l-1.77-1.77z" />
              </svg>
            </div>
            <span className="font-serif text-2xl sm:text-[26px] font-normal tracking-tight text-[#1F1E1D]">
              ThesisAI
            </span>
          </Link>
        </header>

        {/* Centered Form Area */}
        <div className="w-full max-w-[470px] flex flex-col items-center my-auto py-12">
          {/* Title & Subtitle */}
          <div className="text-center w-full mb-7">
            <h1 className="font-serif text-4xl sm:text-[46px] lg:text-[48px] font-normal tracking-tight text-[#1F1E1D] leading-[1.15]">
              Bắt đầu{" "}
              <span className="italic text-[#C83228] font-serif">
                hành trình bảo vệ
              </span>
            </h1>
            <p className="mt-2.5 text-[16px] sm:text-[17px] font-sans text-[#524E46] font-normal whitespace-nowrap">
              Tạo tài khoản nghiên cứu và luyện tập phản biện cùng AI
            </p>
          </div>

          {/* Symmetrical White Card (470px wide, balanced vertical padding, 50px inputs) */}
          <div className="w-full bg-white rounded-2xl border border-[#E7E1D6] py-8 px-7 sm:px-8 shadow-[0_4px_24px_rgba(0,0,0,0.03)]">
            {errorMessage && (
              <div className="mb-5 p-3.5 rounded-xl bg-[#FEF2F2] border border-[#FCA5A5]/60 text-xs sm:text-sm text-[#991B1B] flex items-start gap-3">
                <AlertCircle className="w-4 h-4 shrink-0 text-[#DC2626] mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-sm font-medium text-[#4D4B46] mb-1.5"
                >
                  Họ và tên
                </label>
                <input
                  id="fullName"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Nguyễn Văn A"
                  className="w-full px-4 py-3 rounded-xl border border-[#D5D0C5] bg-[#FFFFFF] text-[#1F1E1D] text-base placeholder:text-[#A09B90] focus:outline-none focus:border-[#D97757] focus:ring-2 focus:ring-[#D97757]/15 transition-all"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-[#4D4B46] mb-1.5"
                >
                  Địa chỉ email trường / viện
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@university.edu.vn"
                  className="w-full px-4 py-3 rounded-xl border border-[#D5D0C5] bg-[#FFFFFF] text-[#1F1E1D] text-base placeholder:text-[#A09B90] focus:outline-none focus:border-[#D97757] focus:ring-2 focus:ring-[#D97757]/15 transition-all"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-[#4D4B46] mb-1.5"
                >
                  Mật khẩu (tối thiểu 8 ký tự)
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-4 py-3 pr-11 rounded-xl border border-[#D5D0C5] bg-[#FFFFFF] text-[#1F1E1D] text-base placeholder:text-[#A09B90] focus:outline-none focus:border-[#D97757] focus:ring-2 focus:ring-[#D97757]/15 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#827D75] hover:text-[#1F1E1D] p-1.5 transition-colors"
                    aria-label={
                      showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Role Selector */}
              <div>
                <label className="block text-sm font-medium text-[#4D4B46] mb-2">
                  Vai trò của bạn
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole("student")}
                    className={`py-2.5 px-3 rounded-xl border text-sm font-medium flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      role === "student"
                        ? "border-[#D97757] bg-[#D97757]/10 text-[#A8482A]"
                        : "border-[#D5D0C5] text-[#6F6A62] hover:border-[#B8B2A6]"
                    }`}
                  >
                    <GraduationCap className="w-4 h-4" />
                    <span>Học viên / Sinh viên</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole("lecturer")}
                    className={`py-2.5 px-3 rounded-xl border text-sm font-medium flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      role === "lecturer"
                        ? "border-[#D97757] bg-[#D97757]/10 text-[#A8482A]"
                        : "border-[#D5D0C5] text-[#6F6A62] hover:border-[#B8B2A6]"
                    }`}
                  >
                    <School className="w-4 h-4" />
                    <span>Giảng viên hướng dẫn</span>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3.5 px-6 rounded-xl bg-[#1F1E1D] hover:bg-[#343330] active:scale-[0.99] text-white font-medium text-base transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-60 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Đang tạo tài khoản...</span>
                  </>
                ) : (
                  <span>Tạo tài khoản nghiên cứu</span>
                )}
              </button>
            </form>

            <p className="mt-4 text-[11px] sm:text-xs text-[#7A756D] text-center whitespace-nowrap overflow-hidden text-ellipsis">
              Dữ liệu luận văn được bảo mật và phân tích mô hình cục bộ trên thiết bị của bạn.
            </p>
          </div>

          {/* Login Prompt */}
          <div className="mt-6 flex items-center justify-center gap-1.5 text-sm text-[#6F6A62]">
            <span>Đã có tài khoản nghiên cứu?</span>
            <Link
              href="/login"
              className="text-[#D97757] hover:underline font-medium"
            >
              Đăng nhập ngay
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
