"use client";

import React from "react";
import Link from "next/link";
import { LogOut, ArrowRight, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <header className="w-full bg-[#F6F1E8]/90 backdrop-blur-md border-b border-[#E5DFD5]/80 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 text-[#1F1E1D] group"
        >
          <div className="w-8 h-8 rounded-lg bg-[#D97757] flex items-center justify-center text-white font-bold text-sm shadow-sm transition-transform group-hover:scale-105">
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2" />
              <path d="M12 20v2" />
              <path d="m4.93 4.93 1.41 1.41" />
              <path d="m17.66 17.66 1.41 1.41" />
              <path d="M2 12h2" />
              <path d="M20 12h2" />
              <path d="m6.34 17.66-1.41 1.41" />
              <path d="m19.07 4.93-1.41 1.41" />
            </svg>
          </div>
          <span className="font-serif text-xl tracking-tight font-semibold">
            ThesisAI
          </span>
        </Link>

        {/* Right Action Bar */}
        {isAuthenticated && user ? (
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-[#1F1E1D] hover:text-[#D97757] transition-colors py-1.5 px-3 rounded-lg hover:bg-[#ECE6DC]/60"
            >
              <LayoutDashboard className="w-4 h-4 text-[#D97757]" />
              <span className="hidden sm:inline">Không gian làm việc</span>
            </Link>

            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-medium text-[#1F1E1D] hidden md:inline">
                {user.name}
              </span>
              <span
                className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${
                  user.role === "lecturer"
                    ? "bg-[#D97757]/10 text-[#C83228] border-[#D97757]/20"
                    : "bg-[#ECE6DC] text-[#5C564E] border-[#DDD5C9]"
                }`}
              >
                {user.role === "lecturer" ? "Giảng viên" : "Học viên"}
              </span>
            </div>

            <div className="h-4 w-[1px] bg-[#E0D9CE]" />

            <button
              onClick={logout}
              title="Đăng xuất"
              className="flex items-center gap-1.5 text-xs font-medium text-[#6F6A62] hover:text-[#C83228] transition-colors py-1.5 px-2 rounded-lg hover:bg-[#ECE6DC]/60 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Đăng xuất</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/login"
              className="text-xs sm:text-sm font-medium text-[#5C564E] hover:text-[#1F1E1D] transition-colors px-2 py-1"
            >
              Đăng nhập
            </Link>

            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 py-2 px-4 rounded-full bg-[#1F1E1D] hover:bg-[#343330] text-white text-xs sm:text-sm font-medium transition-all shadow-sm active:scale-95"
            >
              <span>Mở Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
