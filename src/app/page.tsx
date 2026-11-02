"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import ScrollReveal from "@/components/ScrollReveal";
import {
  ArrowRight,
  Mic,
  FileText,
  ShieldCheck,
  Cpu,
  Sparkles,
  Volume2,
  Award,
  Layers,
  ChevronRight,
  CheckCircle2,
  MessageSquareQuote,
  GraduationCap,
  Users,
  Compass,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F6F1E8] text-[#1F1E1D] flex flex-col selection:bg-[#D97757]/20 selection:text-[#1F1E1D]">
      {/* Global Header */}
      <Header />

      <main className="flex-1 flex flex-col">
        {/* ========================================================================= */}
        {/* HERO SECTION: Vivid Full-bleed Academic Visual with smooth bottom fade    */}
        {/* ========================================================================= */}
        <section className="relative w-full min-h-[96vh] sm:min-h-screen flex flex-col justify-between overflow-hidden">
          {/* Background Image: Vivid Graduation Thesis Defense Visual */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/main.png"
              alt="Phòng bảo vệ đồ án tốt nghiệp tích hợp trợ lý AI phản biện"
              fill
              priority
              className="object-cover object-center"
            />
            {/* Minimal top darkening for contrast under header */}
            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/20 to-transparent" />
            {/* Very soft scrim over text area for contrast without washing out the desk */}
            <div className="absolute inset-0 bg-[#F6F1E8]/35 backdrop-[0.5px]" />
            {/* Subtle, short fade ONLY at the very bottom edge (chỉ mờ nhẹ ở mép cuối) */}
            <div className="absolute inset-x-0 bottom-0 h-24 sm:h-32 bg-gradient-to-t from-[#F6F1E8] to-transparent pointer-events-none" />
          </div>

          {/* Hero Content */}
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pt-16 sm:pt-24 pb-12 flex-1 flex flex-col items-center justify-center text-center">
            {/* Top Kicker Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/85 border border-[#DDD5C9] backdrop-blur-md text-xs sm:text-sm font-medium text-[#4A453E] shadow-xs mb-6">
              <span className="w-2 h-2 rounded-full bg-[#D97757] animate-pulse" />
              <span>Hệ thống AI hỗ trợ bảo vệ Đồ án tốt nghiệp</span>
            </div>

            {/* Sub-headline phrase */}
            <p className="font-serif italic text-xl sm:text-2xl md:text-[26px] text-[#3A3632] mb-2 tracking-tight drop-shadow-xs">
              Từ đề tài nghiên cứu luận văn đến
            </p>

            {/* Main Heading (Adjusted to be well-proportioned) */}
            <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-[72px] font-normal tracking-tight text-[#141312] leading-[1.12] mb-6 drop-shadow-xs">
              Buổi bảo vệ <span className="font-medium italic text-[#C83228]">đáng giá</span>
            </h1>

            {/* Subtitle Paragraph */}
            <p className="font-sans text-base sm:text-lg md:text-xl text-[#2B2926] max-w-2xl mx-auto leading-relaxed mb-8 font-normal">
              Hệ thống AI phản biện và luyện tập bảo vệ đồ án bằng giọng nói (Voice-first),
              bám sát 100% tài liệu nghiên cứu của sinh viên (Local RAG) và chạy tối ưu trên máy cá nhân.
            </p>

            {/* Action CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full sm:w-auto mb-10">
              <Link
                href="/dashboard"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[#1F1E1D] hover:bg-[#343330] text-white font-medium text-sm sm:text-base transition-all shadow-md active:scale-95 group cursor-pointer"
              >
                <span>Mở Dashboard</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <a
                href="#simulation"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-white/90 hover:bg-white text-[#1F1E1D] border border-[#DDD5C9] font-medium text-sm sm:text-base transition-all shadow-xs backdrop-blur-xs hover:border-[#C8C0B3] cursor-pointer"
              >
                <span>Xem mô phỏng phòng thi</span>
                <ChevronRight className="w-4 h-4 text-[#7A756D]" />
              </a>
            </div>

            {/* Bottom Tag Pills Bar */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/90 border border-[#E5DFD5] text-xs sm:text-[13px] text-[#4A453E] font-medium shadow-2xs backdrop-blur-xs">
                <Mic className="w-3.5 h-3.5 text-[#D97757]" />
                Phản biện giọng nói (Voice-first)
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/90 border border-[#E5DFD5] text-xs sm:text-[13px] text-[#4A453E] font-medium shadow-2xs backdrop-blur-xs">
                <FileText className="w-3.5 h-3.5 text-[#D97757]" />
                RAG tài liệu luận văn (Local-First)
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/90 border border-[#E5DFD5] text-xs sm:text-[13px] text-[#4A453E] font-medium shadow-2xs backdrop-blur-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-[#D97757]" />
                Bảo mật công trình 100%
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/90 border border-[#E5DFD5] text-xs sm:text-[13px] text-[#4A453E] font-medium shadow-2xs backdrop-blur-xs">
                <Cpu className="w-3.5 h-3.5 text-[#D97757]" />
                Tối ưu Laptop 16GB RAM
              </span>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 2: MÔ PHỎNG PHÒNG PHẢN BIỆN (Interactive Simulation Mockup)      */}
        {/* ========================================================================= */}
        <section id="simulation" className="py-24 px-4 sm:px-6 max-w-6xl mx-auto w-full">
          <ScrollReveal>
            {/* Section Kicker & Title */}
            <div className="text-center mb-14">
              <span className="text-xs sm:text-sm font-bold tracking-widest text-[#D97757] uppercase block mb-2">
                Mô phỏng 3D & Giọng nói
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl text-[#1F1E1D] font-normal tracking-tight">
                Phòng phản biện ảo, nhìn trong không gian thực tế
              </h2>
            </div>
          </ScrollReveal>

          {/* Simulation Frame Container */}
          <ScrollReveal delay={150}>
            <div className="w-full bg-white rounded-3xl border border-[#E0D9CE] shadow-sm overflow-hidden flex flex-col lg:flex-row">
              {/* Left: Interactive Virtual Room & Waveform */}
              <div className="flex-1 bg-[#1A1918] text-white p-7 sm:p-10 flex flex-col justify-between relative overflow-hidden min-h-[460px]">
                {/* Background ambient glow */}
                <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-[#D97757]/15 blur-3xl pointer-events-none" />
                <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-[#C83228]/10 blur-3xl pointer-events-none" />

                {/* Top Status Bar */}
                <div className="flex items-center justify-between text-xs sm:text-sm text-[#A8A29E] border-b border-white/10 pb-5 relative z-10">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                    <span className="font-medium text-white text-sm sm:text-base">
                      Phiên luyện tập Mode A: Q&A phản xạ
                    </span>
                  </div>
                  <div className="flex items-center gap-3.5 font-mono text-xs sm:text-sm">
                    <span>THỜI GIAN CÒN: 01:42</span>
                    <span className="text-[#D97757] font-semibold">● ĐANG THU ÂM</span>
                  </div>
                </div>

                {/* Middle: Active Council Question */}
                <div className="my-10 relative z-10">
                  <div className="inline-block px-3 py-1 rounded-full bg-[#D97757]/20 border border-[#D97757]/40 text-[#D97757] text-xs font-semibold mb-4 uppercase tracking-wide">
                    Hội đồng đặt câu hỏi #03
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl md:text-[32px] text-[#F5F2EB] leading-snug">
                    &ldquo;Em hãy phân tích sự đánh đổi giữa độ trễ (Latency) và độ chính xác khi triển khai mô hình học sâu trên phần cứng máy tính nhúng?&rdquo;
                  </h3>
                </div>

                {/* Bottom: Live Speech Waveform & Candidate Answer Preview */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-md relative z-10">
                  <div className="flex items-center justify-between mb-3 text-xs sm:text-sm text-[#D6D3D1]">
                    <div className="flex items-center gap-2">
                      <Volume2 className="w-4 h-4 text-[#D97757]" />
                      <span className="font-mono">Tín hiệu microphone (48kHz)</span>
                    </div>
                    <span className="font-mono text-emerald-400 font-semibold">
                      Tốc độ: 126 wpm (Lý tưởng)
                    </span>
                  </div>

                  {/* Simulated Audio Bars */}
                  <div className="flex items-center justify-between gap-1 h-12 py-1">
                    {[20, 45, 75, 30, 90, 60, 40, 85, 95, 70, 50, 80, 65, 90, 45, 85, 60, 75, 35, 70, 90, 55, 40, 80, 65, 45].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-gradient-to-t from-[#D97757] to-[#F29F80] rounded-full transition-all duration-300"
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>

                  <p className="mt-3.5 text-xs sm:text-sm text-[#A8A29E] italic line-clamp-1">
                    &ldquo;Dạ thưa Hội đồng, nhóm chúng em đã áp dụng phương pháp lượng tử hóa int8 để giảm kích thước trọng số...&rdquo;
                  </p>
                </div>
              </div>

              {/* Right: Real-time Evaluation & Metadata Panel */}
              <div className="w-full lg:w-[380px] bg-[#FAF7F2] p-7 sm:p-9 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-[#E0D9CE]">
                <div>
                  <span className="text-xs font-bold text-[#8C857B] tracking-wider uppercase block mb-3.5">
                    Chọn câu hỏi mô phỏng
                  </span>
                  <div className="grid grid-cols-3 gap-2.5 mb-7">
                    {["#01 Lý thuyết", "#02 Kiến trúc", "#03 Đánh đổi"].map((item, idx) => (
                      <div
                        key={idx}
                        className={`py-2.5 px-3 rounded-xl text-center text-xs sm:text-sm font-medium cursor-pointer transition-all border ${idx === 2
                            ? "bg-white border-[#D97757] text-[#D97757] shadow-xs font-semibold"
                            : "bg-[#EFE9DF] border-transparent text-[#6F6A62] hover:bg-white"
                          }`}
                      >
                        {item}
                      </div>
                    ))}
                  </div>

                  <span className="text-xs font-bold text-[#8C857B] tracking-wider uppercase block mb-3.5">
                    Dữ liệu phân tích thực tế
                  </span>
                  <div className="space-y-3 font-sans text-xs sm:text-sm">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-[#E5DFD5]">
                      <span className="text-[#6F6A62]">Độ bám sát tài liệu</span>
                      <span className="font-semibold text-[#1F1E1D]">94% (Chương 4)</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-[#E5DFD5]">
                      <span className="text-[#6F6A62]">Thời gian ngập ngừng</span>
                      <span className="font-semibold text-emerald-600">2.1 giây (Tự tin)</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-[#E5DFD5]">
                      <span className="text-[#6F6A62]">Mô hình STT & LLM</span>
                      <span className="font-semibold text-[#1F1E1D]">faster-whisper + Qwen</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-[#E5DFD5]">
                      <span className="text-[#6F6A62]">Độ tin cậy Rubric</span>
                      <span className="font-semibold text-[#D97757]">9.2 / 10</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-5 border-t border-[#E5DFD5]">
                  <Link
                    href="/dashboard"
                    className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-[#1F1E1D] hover:bg-[#343330] text-white text-xs sm:text-sm font-medium transition-all"
                  >
                    <span>Mở Dashboard để phân tích dữ liệu</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 3: ĐIỂM NHẤN CỐT LÕI (4-Column Highlights - Inspired by ref web) */}
        {/* ========================================================================= */}
        <section className="py-20 px-4 sm:px-6 max-w-6xl mx-auto w-full">
          <ScrollReveal>
            <div className="text-center mb-14">
              <span className="text-xs sm:text-sm font-bold tracking-widest text-[#D97757] uppercase block mb-2">
                Điểm nhấn
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl text-[#1F1E1D] font-normal tracking-tight">
                Gọn, rõ và chạy được ngay trên máy thường
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1 */}
            <ScrollReveal delay={100}>
              <div className="bg-white rounded-3xl border border-[#E5DFD5] p-7 shadow-xs flex flex-col justify-between hover:border-[#D97757]/50 transition-colors h-full">
                <div>
                  <h3 className="font-sans font-bold text-3xl sm:text-4xl text-[#1F1E1D] tracking-tight mb-2">
                    Voice
                  </h3>
                  <span className="text-sm font-semibold text-[#D97757] block mb-3.5">
                    Trọng tâm giọng nói
                  </span>
                  <p className="text-sm sm:text-[15px] text-[#5C564E] leading-relaxed">
                    Luyện tập phản xạ trả lời trực tiếp bằng microphone, rèn luyện tốc độ nói (wpm) và giảm ngập ngừng trước hội đồng.
                  </p>
                </div>
              </div>
            </ScrollReveal>

            {/* Card 2 */}
            <ScrollReveal delay={200}>
              <div className="bg-white rounded-3xl border border-[#E5DFD5] p-7 shadow-xs flex flex-col justify-between hover:border-[#D97757]/50 transition-colors h-full">
                <div>
                  <h3 className="font-sans font-bold text-3xl sm:text-4xl text-[#1F1E1D] tracking-tight mb-2">
                    RAG
                  </h3>
                  <span className="text-sm font-semibold text-[#D97757] block mb-3.5">
                    Tri thức từ tài liệu đồ án
                  </span>
                  <p className="text-sm sm:text-[15px] text-[#5C564E] leading-relaxed">
                    Lập chỉ mục vector ngữ nghĩa HNSW trên chính bản báo cáo luận văn của bạn, đối chiếu câu trả lời với từng trang đề cương.
                  </p>
                </div>
              </div>
            </ScrollReveal>

            {/* Card 3 */}
            <ScrollReveal delay={300}>
              <div className="bg-white rounded-3xl border border-[#E5DFD5] p-7 shadow-xs flex flex-col justify-between hover:border-[#D97757]/50 transition-colors h-full">
                <div>
                  <h3 className="font-sans font-bold text-3xl sm:text-4xl text-[#1F1E1D] tracking-tight mb-2">
                    16 GB
                  </h3>
                  <span className="text-sm font-semibold text-[#D97757] block mb-3.5">
                    Tối ưu hóa chạy local
                  </span>
                  <p className="text-sm sm:text-[15px] text-[#5C564E] leading-relaxed">
                    Chạy hoàn toàn cục bộ trên laptop với Ollama và faster-whisper. Kiểm soát chặt chẽ concurrency, không bao giờ tràn RAM (OOM).
                  </p>
                </div>
              </div>
            </ScrollReveal>

            {/* Card 4 */}
            <ScrollReveal delay={400}>
              <div className="bg-white rounded-3xl border border-[#E5DFD5] p-7 shadow-xs flex flex-col justify-between hover:border-[#D97757]/50 transition-colors h-full">
                <div>
                  <h3 className="font-sans font-bold text-3xl sm:text-4xl text-[#1F1E1D] tracking-tight mb-2">
                    Privacy
                  </h3>
                  <span className="text-sm font-semibold text-[#D97757] block mb-3.5">
                    Bảo mật công trình
                  </span>
                  <p className="text-sm sm:text-[15px] text-[#5C564E] leading-relaxed">
                    Bảo vệ công trình nghiên cứu của bạn an toàn 100%. File âm thanh tự động dọn dẹp theo vòng đời, không gửi dữ liệu ra ngoài.
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 4: QUY TRÌNH 3 BƯỚC (Timeline Stepper 01 -> 02 -> 03)             */}
        {/* ========================================================================= */}
        <section className="py-20 px-4 sm:px-6 max-w-6xl mx-auto w-full">
          <ScrollReveal>
            <div className="text-center mb-16">
              <span className="text-xs sm:text-sm font-bold tracking-widest text-[#D97757] uppercase block mb-2">
                Quy trình luyện tập
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl text-[#1F1E1D] font-normal tracking-tight">
                Ba bước từ tài liệu đồ án đến buổi bảo vệ tự tin
              </h2>
            </div>
          </ScrollReveal>

          {/* Stepper Timeline Container */}
          <div className="relative">
            {/* Horizontal Connecting Line on desktop */}
            <div className="hidden lg:block absolute top-[22px] left-[16%] right-[16%] h-[2px] bg-[#E0D9CE] z-0" />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
              {/* Step 1 */}
              <ScrollReveal delay={150}>
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-[#1F1E1D] text-white flex items-center justify-center font-mono font-bold text-sm shadow-md border-4 border-[#F6F1E8] mb-6">
                    01
                  </div>
                  <div className="w-full bg-white rounded-3xl border border-[#E5DFD5] p-7 shadow-xs text-left h-full flex flex-col justify-between">
                    <div>
                      <h3 className="font-serif text-xl sm:text-2xl font-semibold text-[#1F1E1D] mb-3">
                        Nạp tài liệu & Lập chỉ mục
                      </h3>
                      <p className="text-sm sm:text-[15px] text-[#5C564E] leading-relaxed">
                        Tải lên đề cương hoặc toàn văn luận văn (PDF, DOCX). Hệ thống tự động bóc tách chương mục, bảng biểu, công thức và đánh chỉ mục vector HNSW cục bộ siêu tốc.
                      </p>
                    </div>
                    <div className="mt-5 pt-3 border-t border-[#F2ECE1] text-xs font-semibold text-[#D97757]">
                      Hỗ trợ: PDF &bull; DOCX &bull; PPTX
                    </div>
                  </div>
                </div>
              </ScrollReveal>

              {/* Step 2 */}
              <ScrollReveal delay={300}>
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-[#D97757] text-white flex items-center justify-center font-mono font-bold text-sm shadow-md border-4 border-[#F6F1E8] mb-6">
                    02
                  </div>
                  <div className="w-full bg-white rounded-3xl border border-[#E5DFD5] p-7 shadow-xs text-left h-full flex flex-col justify-between">
                    <div>
                      <h3 className="font-serif text-xl sm:text-2xl font-semibold text-[#1F1E1D] mb-3">
                        Luyện phản biện với Hội đồng AI
                      </h3>
                      <p className="text-sm sm:text-[15px] text-[#5C564E] leading-relaxed">
                        AI đóng vai Hội đồng phản biện quét tìm lỗ hổng nghiên cứu và sinh 12-15 câu hỏi trọng tâm. Bạn trả lời trực tiếp bằng microphone theo thời gian thực.
                      </p>
                    </div>
                    <div className="mt-5 pt-3 border-t border-[#F2ECE1] text-xs font-semibold text-[#D97757]">
                      Mode A (Q&A) &bull; Mode B (Slide)
                    </div>
                  </div>
                </div>
              </ScrollReveal>

              {/* Step 3 */}
              <ScrollReveal delay={450}>
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-[#1F1E1D] text-white flex items-center justify-center font-mono font-bold text-sm shadow-md border-4 border-[#F6F1E8] mb-6">
                    03
                  </div>
                  <div className="w-full bg-white rounded-3xl border border-[#E5DFD5] p-7 shadow-xs text-left h-full flex flex-col justify-between">
                    <div>
                      <h3 className="font-serif text-xl sm:text-2xl font-semibold text-[#1F1E1D] mb-3">
                        Phân tích báo cáo & Tự tin bảo vệ
                      </h3>
                      <p className="text-sm sm:text-[15px] text-[#5C564E] leading-relaxed">
                        Nhận ngay báo cáo đa chiều: Điểm bám sát tài liệu đồ án, tốc độ nói (wpm), thời gian ngập ngừng, gợi ý cải thiện và bấm nghe lại từng đoạn âm thanh.
                      </p>
                    </div>
                    <div className="mt-5 pt-3 border-t border-[#F2ECE1] text-xs font-semibold text-[#D97757]">
                      Rubric nội dung &bull; Phong thái
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 5: GÓC NHÌN THỰC TIỄN (Split 2-Column Multi-Perspective Card)     */}
        {/* ========================================================================= */}
        <section className="py-20 px-4 sm:px-6 max-w-6xl mx-auto w-full">
          <ScrollReveal>
            <div className="w-full bg-white rounded-3xl border border-[#E0D9CE] p-8 sm:p-12 lg:p-14 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
              {/* Left Column (5 Cols): Core Philosophy */}
              <div className="lg:col-span-5 flex flex-col justify-between h-full">
                <div>
                  <div className="w-11 h-11 rounded-2xl bg-[#F6F1E8] border border-[#E0D9CE] flex items-center justify-center text-[#D97757] mb-6">
                    <MessageSquareQuote className="w-5 h-5" />
                  </div>

                  <span className="text-xs sm:text-sm font-bold tracking-widest text-[#D97757] uppercase block mb-3">
                    Góc nhìn người sử dụng
                  </span>

                  <h3 className="font-serif text-3xl sm:text-4xl text-[#1F1E1D] font-normal tracking-tight leading-tight mb-5">
                    Sự tự tin đến từ sự chuẩn bị có thể đo lường.
                  </h3>

                  <p className="text-sm sm:text-base text-[#5C564E] leading-relaxed mb-6 font-normal">
                    Một công cụ ôn luyện giá trị không chỉ ước lượng điểm số chung chung, mà phải chỉ rõ bạn làm tốt ở đâu, thiếu sót luận điểm nào trong đồ án và cách khắc phục trước ngày bảo vệ thật.
                  </p>
                </div>

                <div className="pt-6 border-t border-[#EFE9DF] text-xs text-[#8C857B] italic">
                  Dữ liệu âm thanh và tài liệu nghiên cứu hoàn toàn thuộc quyền sở hữu của bạn, xử lý an toàn 100% trên máy cá nhân.
                </div>
              </div>

              {/* Right Column (7 Cols): 3 Stakeholder Perspectives */}
              <div className="lg:col-span-7 flex flex-col gap-6 lg:border-l lg:border-[#EFE9DF] lg:pl-10">
                {/* Persona 1: Student */}
                <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#ECE5D9] transition-all hover:bg-white hover:border-[#D97757]/40 shadow-2xs">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#8C857B] uppercase tracking-wider mb-2">
                    <GraduationCap className="w-3.5 h-3.5 text-[#D97757]" />
                    <span>Học viên nghiên cứu</span>
                  </div>
                  <h4 className="text-base sm:text-lg font-semibold text-[#1F1E1D] flex items-center gap-2 mb-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>Biết rõ câu hỏi khó trước khi hội đồng hỏi</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-[#5C564E] leading-relaxed">
                    Không còn bị bất ngờ trước các câu hỏi xoáy sâu vào giới hạn đề tài, phương pháp thực nghiệm hay sự đánh đổi công nghệ giữa các giải pháp.
                  </p>
                </div>

                {/* Persona 2: Lecturer / Advisor */}
                <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#ECE5D9] transition-all hover:bg-white hover:border-[#D97757]/40 shadow-2xs">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#8C857B] uppercase tracking-wider mb-2">
                    <Users className="w-3.5 h-3.5 text-[#D97757]" />
                    <span>Giảng viên hướng dẫn</span>
                  </div>
                  <h4 className="text-base sm:text-lg font-semibold text-[#1F1E1D] flex items-center gap-2 mb-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>Nắm bắt chính xác mức độ sẵn sàng của sinh viên</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-[#5C564E] leading-relaxed">
                    Theo dõi tiến độ ôn luyện, xem báo cáo những phần sinh viên còn trả lời lúng túng hoặc chưa bám sát tài liệu để kịp thời định hướng.
                  </p>
                </div>

                {/* Persona 3: Academic Integrity & Transparency */}
                <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#ECE5D9] transition-all hover:bg-white hover:border-[#D97757]/40 shadow-2xs">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#8C857B] uppercase tracking-wider mb-2">
                    <Compass className="w-3.5 h-3.5 text-[#D97757]" />
                    <span>Tính minh bạch học thuật</span>
                  </div>
                  <h4 className="text-base sm:text-lg font-semibold text-[#1F1E1D] flex items-center gap-2 mb-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>Có căn cứ đối chiếu từ chính đề cương</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-[#5C564E] leading-relaxed">
                    Mọi phản hồi và gợi ý của AI đều đính kèm trích dẫn số trang và đề mục cụ thể từ tài liệu của sinh viên, đảm bảo tính khách quan và khoa học.
                  </p>
                </div>

                <div className="pt-2">
                  <a
                    href="#simulation"
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#D97757] hover:underline"
                  >
                    <span>Xem cách ThesisAI đối chiếu và đánh giá dữ liệu</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 6: CÔNG NGHỆ & BỘ CÔNG CỤ (2x2 Grid)                              */}
        {/* ========================================================================= */}
        <section className="py-20 px-4 sm:px-6 max-w-6xl mx-auto w-full">
          <ScrollReveal>
            <div className="text-center mb-14">
              <span className="text-xs sm:text-sm font-bold tracking-widest text-[#D97757] uppercase block mb-2">
                Công nghệ & Hạ tầng
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl text-[#1F1E1D] font-normal tracking-tight">
                Bộ công cụ toàn diện đồng hành đến ngày bảo vệ
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
            {/* Box 1 */}
            <ScrollReveal delay={100}>
              <div className="bg-white rounded-3xl border border-[#E5DFD5] p-8 shadow-xs h-full">
                <div className="flex items-center gap-3.5 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#F6F1E8] border border-[#E0D9CE] flex items-center justify-center text-[#D97757]">
                    <Layers className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-serif text-xl sm:text-2xl font-semibold text-[#1F1E1D]">
                      Bóc tách & Lập chỉ mục Vector
                    </h4>
                    <span className="text-xs font-bold text-[#7A756D] uppercase tracking-wider">
                      XỬ LÝ ĐA DẠNG: PDF, DOCX, PPTX
                    </span>
                  </div>
                </div>
                <p className="text-base sm:text-lg text-[#5C564E] leading-relaxed">
                  Tự động nhận diện cấu trúc chương mục, số trang, slide thuyết trình. Đánh chỉ mục vector HNSW cosine ops trong PostgreSQL (pgvector) cho tốc độ tìm kiếm siêu tốc.
                </p>
              </div>
            </ScrollReveal>

            {/* Box 2 */}
            <ScrollReveal delay={200}>
              <div className="bg-white rounded-3xl border border-[#E5DFD5] p-8 shadow-xs h-full">
                <div className="flex items-center gap-3.5 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#F6F1E8] border border-[#E0D9CE] flex items-center justify-center text-[#D97757]">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-serif text-xl sm:text-2xl font-semibold text-[#1F1E1D]">
                      Sinh bộ 12-15 câu hỏi phản biện
                    </h4>
                    <span className="text-xs font-bold text-[#7A756D] uppercase tracking-wider">
                      PHÂN HÓA ĐỘ KHÓ & LỖ HỔNG LÝ THUYẾT
                    </span>
                  </div>
                </div>
                <p className="text-base sm:text-lg text-[#5C564E] leading-relaxed">
                  Hệ thống đóng vai Hội đồng phản biện khó tính, quét sâu vào các phần giả định nghiên cứu, phương pháp đánh giá và kiến trúc để sinh bộ câu hỏi trọng tâm.
                </p>
              </div>
            </ScrollReveal>

            {/* Box 3 */}
            <ScrollReveal delay={300}>
              <div className="bg-white rounded-3xl border border-[#E5DFD5] p-8 shadow-xs h-full">
                <div className="flex items-center gap-3.5 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#F6F1E8] border border-[#E0D9CE] flex items-center justify-center text-[#D97757]">
                    <Mic className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-serif text-xl sm:text-2xl font-semibold text-[#1F1E1D]">
                      Thu âm & Pipeline xử lý bất đồng bộ
                    </h4>
                    <span className="text-xs font-bold text-[#7A756D] uppercase tracking-wider">
                      FASTAPI BACKGROUND TASKS & FASTER-WHISPER
                    </span>
                  </div>
                </div>
                <p className="text-base sm:text-lg text-[#5C564E] leading-relaxed">
                  Thu âm MediaRecorder mượt mà, chuyển giọng nói thành văn bản kèm mốc thời gian (timestamps). Xử lý tác vụ nặng ở hàng đợi ngầm mà không làm đơ giao diện.
                </p>
              </div>
            </ScrollReveal>

            {/* Box 4 */}
            <ScrollReveal delay={400}>
              <div className="bg-white rounded-3xl border border-[#E5DFD5] p-8 shadow-xs h-full">
                <div className="flex items-center gap-3.5 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#F6F1E8] border border-[#E0D9CE] flex items-center justify-center text-[#D97757]">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-serif text-xl sm:text-2xl font-semibold text-[#1F1E1D]">
                      Báo cáo phân tích & Giải thích minh bạch
                    </h4>
                    <span className="text-xs font-bold text-[#7A756D] uppercase tracking-wider">
                      RUBRIC ĐIỂM SỐ + BẰNG CHỨNG TRÍCH DẪN
                    </span>
                  </div>
                </div>
                <p className="text-base sm:text-lg text-[#5C564E] leading-relaxed">
                  Đánh giá tách bạch 2 trụ cột: Điểm nội dung (Content) và Phong thái diễn đạt (Delivery). Cho phép sinh viên bấm vào từng câu để nghe lại đoạn âm thanh tương ứng.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* BOTTOM CTA BANNER: Ready to Master Your Defense                           */}
        {/* ========================================================================= */}
        <section className="py-20 px-4 sm:px-6 max-w-4xl mx-auto w-full text-center">
          <ScrollReveal>
            <div className="bg-[#1C1B1A] text-white rounded-3xl p-10 sm:p-14 relative overflow-hidden shadow-xl">
              <div className="absolute top-0 right-0 w-96 h-96 bg-[#D97757]/20 rounded-full blur-3xl pointer-events-none" />

              <span className="inline-block px-3.5 py-1.5 rounded-full bg-white/10 text-xs sm:text-sm text-[#D97757] font-semibold mb-5">
                Khởi đầu ngay hôm nay
              </span>

              <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-white font-normal tracking-tight mb-5 leading-tight">
                Sẵn sàng làm chủ <span className="italic font-medium text-[#D97757]">ngày bảo vệ</span> đồ án của bạn?
              </h2>

              <p className="text-base sm:text-lg md:text-xl text-[#D6D3D1] max-w-xl mx-auto mb-10 leading-relaxed font-normal">
                Tạo tài khoản nghiên cứu, tải lên đề cương và trải nghiệm ngay buổi phản biện thử đầu tiên cùng ThesisAI.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/register"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-9 py-4 rounded-full bg-[#D97757] hover:bg-[#C86B4D] text-white font-medium text-base sm:text-lg transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  <span>Đăng ký tài khoản miễn phí</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/login"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white font-medium text-base sm:text-lg transition-all border border-white/20 cursor-pointer"
                >
                  <span>Đăng nhập hệ thống</span>
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full bg-[#EFE9DF] border-t border-[#E0D9CE] py-10 text-center text-sm text-[#7A756D]">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <span className="font-serif font-semibold text-base text-[#1F1E1D]">ThesisAI</span>
            <span>—</span>
            <span>Hệ thống luyện tập bảo vệ đồ án tốt nghiệp với AI</span>
          </div>
          <div className="text-xs sm:text-sm text-[#8A847B]">
            Local-First &bull; Privacy by Design &bull; Tối ưu phần cứng 16GB RAM
          </div>
        </div>
      </footer>
    </div>
  );
}
