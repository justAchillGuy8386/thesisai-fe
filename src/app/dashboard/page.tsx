"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/Header";
import DocumentManagerModal from "@/components/DocumentManagerModal";
import {
  projectService,
  Project,
  Lecturer,
  ProjectStatus,
  STATUS_CONFIG,
} from "@/services/projectService";
import { toast } from "sonner";
import {
  Loader2,
  BookOpen,
  Mic,
  FileText,
  Sparkles,
  Edit3,
  Calendar,
  UserCheck,
  Upload,
  CheckCircle2,
  AlertCircle,
  GraduationCap,
  X,
  Layers,
  ArrowRight,
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

  const [project, setProject] = useState<Project | null>(null);
  const [lecturers, setLecturers] = useState<Lecturer[]>([]);
  const [isFetchingProject, setIsFetchingProject] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states for creating a new project
  const [newTitle, setNewTitle] = useState("");
  const [newTopic, setNewTopic] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newAcademicYear, setNewAcademicYear] = useState("2024 - 2025");
  const [newSupervisorId, setNewSupervisorId] = useState<string>("");

  // Edit Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editTopic, setEditTopic] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editStatus, setEditStatus] = useState<ProjectStatus>("PLANNING");
  const [editAcademicYear, setEditAcademicYear] = useState("");
  const [editSupervisorId, setEditSupervisorId] = useState<string>("");

  // Document Manager Modal state
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);

  // Redirect unauthenticated users
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [authLoading, isAuthenticated, router]);

  // Load project & lecturers on mount
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    async function loadData() {
      setIsFetchingProject(true);
      try {
        const [projData, lecsData] = await Promise.all([
          user?.role === "student" ? projectService.getMyProject() : Promise.resolve(null),
          projectService.getLecturers().catch(() => []),
        ]);
        setProject(projData);
        setLecturers(lecsData);
      } catch (err: any) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setIsFetchingProject(false);
      }
    }

    loadData();
  }, [isAuthenticated, user]);

  // Handle Create Project
  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      toast.error("Vui lòng nhập tên đề tài đồ án tốt nghiệp.");
      return;
    }

    setIsSubmitting(true);
    try {
      const created = await projectService.createProject({
        title: newTitle.trim(),
        topic: newTopic.trim() || undefined,
        description: newDescription.trim() || undefined,
        academic_year: newAcademicYear.trim() || undefined,
        supervisor_id: newSupervisorId ? parseInt(newSupervisorId, 10) : undefined,
      });

      setProject(created);
      toast.success("Khởi tạo đề tài đồ án tốt nghiệp thành công!");
    } catch (err: any) {
      toast.error(err.message || "Không thể khởi tạo đề tài. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open Edit Modal with current project values
  const handleOpenEditModal = () => {
    if (!project) return;
    setEditTitle(project.title);
    setEditTopic(project.topic || "");
    setEditDescription(project.description || "");
    setEditStatus(project.status);
    setEditAcademicYear(project.academic_year || "");
    setEditSupervisorId(project.supervisor_id ? String(project.supervisor_id) : "");
    setIsEditModalOpen(true);
  };

  // Handle Update Project
  const handleUpdateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project) return;
    if (!editTitle.trim()) {
      toast.error("Tên đề tài không được để trống.");
      return;
    }

    setIsSubmitting(true);
    try {
      const updated = await projectService.updateProject(project.id, {
        title: editTitle.trim(),
        topic: editTopic.trim() || undefined,
        description: editDescription.trim() || undefined,
        status: editStatus,
        academic_year: editAcademicYear.trim() || undefined,
        supervisor_id: editSupervisorId ? parseInt(editSupervisorId, 10) : null,
      });

      setProject(updated);
      setIsEditModalOpen(false);
      toast.success("Cập nhật thông tin đề tài thành công!");
    } catch (err: any) {
      toast.error(err.message || "Không thể cập nhật đề tài.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Status Quick Change
  const handleQuickStatusChange = async (newStatus: ProjectStatus) => {
    if (!project || project.status === newStatus) return;
    try {
      const updated = await projectService.updateProject(project.id, {
        status: newStatus,
      });
      setProject(updated);
      toast.success(`Đã chuyển trạng thái sang "${STATUS_CONFIG[newStatus].label}"`);
    } catch (err: any) {
      toast.error("Không thể thay đổi trạng thái.");
    }
  };

  // Global loading state
  if (authLoading || isFetchingProject) {
    return (
      <div className="min-h-screen bg-[#F6F1E8] flex flex-col items-center justify-center">
        <Loader2 className="w-7 h-7 animate-spin text-[#D97757]" />
        <span className="mt-3 text-sm text-[#7A756D] font-sans">
          Đang tải không gian đồ án...
        </span>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F6F1E8] text-[#1F1E1D] flex flex-col selection:bg-[#D97757]/20 selection:text-[#1F1E1D]">
      <Header />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-10">
        {/* ===================================================================== */}
        {/* LECTURER VIEW                                                         */}
        {/* ===================================================================== */}
        {user.role === "lecturer" ? (
          <div className="max-w-2xl mx-auto text-center py-12">
            <div className="w-14 h-14 rounded-2xl bg-white border border-[#E0D9CE] flex items-center justify-center text-[#D97757] mx-auto mb-5 shadow-xs">
              <GraduationCap className="w-7 h-7" />
            </div>
            <h1 className="font-serif text-3xl text-[#1F1E1D] font-normal mb-3">
              Không gian Giảng viên hướng dẫn
            </h1>
            <p className="text-base text-[#6F6A62] leading-relaxed mb-8">
              Chào Thầy/Cô <span className="font-medium text-[#1F1E1D]">{user.name}</span>.
              Hệ thống ThesisAI cho phép Thầy/Cô theo dõi tiến độ chuẩn bị đề tài, kiểm tra các lỗ hổng lý thuyết và đánh giá phản biện của các sinh viên mà Thầy/Cô hướng dẫn.
            </p>
            <div className="bg-white rounded-2xl border border-[#E5DFD5] p-6 text-left shadow-xs">
              <h3 className="font-serif text-lg font-semibold text-[#1F1E1D] mb-2">
                Danh sách đồ án được phân công
              </h3>
              <p className="text-sm text-[#7A756D] leading-relaxed">
                Khi sinh viên chọn Thầy/Cô làm Giảng viên hướng dẫn trong bước khởi tạo đề tài, các đồ án và báo cáo phản xạ sẽ tự động hiển thị tại khu vực này.
              </p>
            </div>
          </div>
        ) : (
          /* ===================================================================== */
          /* STUDENT VIEW                                                          */
          /* ===================================================================== */
          <>
            {!project ? (
              /* --------------------------------------------------------------- */
              /* SCENARIO 1: FIRST-TIME ONBOARDING (Create Thesis Project)       */
              /* --------------------------------------------------------------- */
              <div className="max-w-3xl mx-auto">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-[#DDD5C9] text-xs font-medium text-[#5C564E] mb-3.5 shadow-2xs">
                    <Sparkles className="w-3.5 h-3.5 text-[#D97757]" />
                    <span>Bước khởi đầu &bull; Khởi tạo đề tài</span>
                  </div>
                  <h1 className="font-serif text-3xl sm:text-4xl text-[#141312] font-normal tracking-tight mb-3">
                    Thiết lập Đề tài Đồ án tốt nghiệp
                  </h1>
                  <p className="text-sm sm:text-base text-[#6F6A62] max-w-xl mx-auto leading-relaxed">
                    Khai báo thông tin đề tài nghiên cứu của bạn để kích hoạt hệ thống phân tích tài liệu và mô phỏng phòng phản biện ảo.
                  </p>
                </div>

                <div className="bg-white rounded-3xl border border-[#E2DDD3] p-7 sm:p-10 shadow-xs">
                  <form onSubmit={handleCreateProject} className="space-y-6">
                    <div>
                      <label className="block text-xs font-bold text-[#6F6A62] uppercase tracking-wider mb-2">
                        Tên đề tài đồ án tốt nghiệp <span className="text-[#C83228]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder="VD: Nghiên cứu và xây dựng hệ thống hỏi đáp thông minh dựa trên mô hình RAG"
                        className="w-full px-4 py-3 rounded-xl border border-[#DDD5C9] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D97757]/30 focus:border-[#D97757] text-[#1F1E1D] text-sm sm:text-base transition-all"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-bold text-[#6F6A62] uppercase tracking-wider mb-2">
                          Chuyên ngành / Hướng nghiên cứu
                        </label>
                        <input
                          type="text"
                          value={newTopic}
                          onChange={(e) => setNewTopic(e.target.value)}
                          placeholder="VD: Trí tuệ nhân tạo, Thị giác máy tính"
                          className="w-full px-4 py-3 rounded-xl border border-[#DDD5C9] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D97757]/30 focus:border-[#D97757] text-[#1F1E1D] text-sm transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#6F6A62] uppercase tracking-wider mb-2">
                          Niên khóa / Năm học
                        </label>
                        <input
                          type="text"
                          value={newAcademicYear}
                          onChange={(e) => setNewAcademicYear(e.target.value)}
                          placeholder="VD: 2024 - 2025"
                          className="w-full px-4 py-3 rounded-xl border border-[#DDD5C9] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D97757]/30 focus:border-[#D97757] text-[#1F1E1D] text-sm transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#6F6A62] uppercase tracking-wider mb-2">
                        Giảng viên hướng dẫn
                      </label>
                      <select
                        value={newSupervisorId}
                        onChange={(e) => setNewSupervisorId(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-[#DDD5C9] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D97757]/30 focus:border-[#D97757] text-[#1F1E1D] text-sm transition-all cursor-pointer"
                      >
                        <option value="">-- Chưa phân công hoặc chọn sau --</option>
                        {lecturers.map((lec) => (
                          <option key={lec.id} value={lec.id}>
                            {lec.name} ({lec.email})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#6F6A62] uppercase tracking-wider mb-2">
                        Mô tả tóm tắt nội dung đề tài
                      </label>
                      <textarea
                        rows={4}
                        value={newDescription}
                        onChange={(e) => setNewDescription(e.target.value)}
                        placeholder="Tóm tắt ngắn gọn mục tiêu, bài toán giải quyết, phạm vi nghiên cứu và công nghệ dự kiến áp dụng..."
                        className="w-full px-4 py-3 rounded-xl border border-[#DDD5C9] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D97757]/30 focus:border-[#D97757] text-[#1F1E1D] text-sm leading-relaxed transition-all resize-none"
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-[#D97757] hover:bg-[#C86B4D] active:scale-[0.99] text-white font-medium text-sm sm:text-base transition-all shadow-sm cursor-pointer disabled:opacity-60"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Đang lưu đề tài...</span>
                          </>
                        ) : (
                          <>
                            <BookOpen className="w-5 h-5" />
                            <span>Khởi tạo Đề tài Đồ án</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            ) : (
              /* --------------------------------------------------------------- */
              /* SCENARIO 2: ACTIVE STUDENT WORKSPACE                           */
              /* --------------------------------------------------------------- */
              <div className="space-y-8">
                {/* Top Workspace Greeting & Subtitle */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E3DDD2] pb-6">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold text-[#7A756D] uppercase tracking-wider mb-1">
                      <span>Không gian làm việc đồ án</span>
                      <span>&bull;</span>
                      <span className="text-[#D97757] font-semibold">{project.academic_year || "Niên khóa 2024-2025"}</span>
                    </div>
                    <h1 className="font-serif text-2xl sm:text-3xl text-[#141312] font-normal tracking-tight">
                      Xin chào, <span className="font-medium">{user.name}</span>
                    </h1>
                  </div>

                  <button
                    onClick={handleOpenEditModal}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-[#DDD5C9] hover:border-[#D97757] hover:text-[#D97757] text-[#4A453E] text-xs sm:text-sm font-medium transition-all shadow-2xs cursor-pointer self-start sm:self-center"
                  >
                    <Edit3 className="w-4 h-4 text-[#D97757]" />
                    <span>Chỉnh sửa thông tin đề tài</span>
                  </button>
                </div>

                {/* Hero Thesis Project Card */}
                <div className="bg-white rounded-3xl border border-[#E0D9CE] p-7 sm:p-9 shadow-xs relative overflow-hidden">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-6">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2.5 mb-3.5">
                        <span className="text-xs font-bold text-[#8C857B] tracking-wider uppercase">
                          Đề tài đồ án tốt nghiệp
                        </span>
                        <span className="text-[#DDD5C9]">&bull;</span>
                        {/* Status Badge */}
                        <div
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
                            STATUS_CONFIG[project.status].bg
                          } ${STATUS_CONFIG[project.status].color} ${
                            STATUS_CONFIG[project.status].border
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              STATUS_CONFIG[project.status].dot
                            }`}
                          />
                          <span>{STATUS_CONFIG[project.status].label}</span>
                        </div>
                      </div>

                      <h2 className="font-serif text-2xl sm:text-3xl md:text-[32px] text-[#141312] font-normal leading-snug tracking-tight mb-4">
                        {project.title}
                      </h2>

                      {project.description ? (
                        <p className="text-sm sm:text-[15px] text-[#5C564E] leading-relaxed max-w-3xl">
                          {project.description}
                        </p>
                      ) : (
                        <p className="text-sm text-[#8C857B] italic">
                          Chưa có mô tả tóm tắt cho đề tài này. Bạn có thể cập nhật trong phần chỉnh sửa.
                        </p>
                      )}
                    </div>

                    {/* Quick Status Dropdown / Listbox */}
                    <div className="shrink-0">
                      <select
                        value={project.status}
                        onChange={(e) => handleQuickStatusChange(e.target.value as ProjectStatus)}
                        className="text-xs sm:text-sm font-medium bg-[#FAF8F5] hover:bg-[#F2ECE1] border border-[#DDD5C9] rounded-xl px-3.5 py-2.5 text-[#1F1E1D] focus:outline-none focus:ring-2 focus:ring-[#D97757]/30 focus:border-[#D97757] cursor-pointer transition-all shadow-2xs"
                      >
                        <option value="PLANNING">Lập kế hoạch</option>
                        <option value="IN_PROGRESS">Đang triển khai</option>
                        <option value="READY_FOR_DEFENSE">Sẵn sàng bảo vệ</option>
                        <option value="COMPLETED">Đã hoàn thành</option>
                      </select>
                    </div>
                  </div>

                  {/* Metadata Footer Badges */}
                  <div className="pt-6 border-t border-[#F0EBE1] flex flex-wrap items-center gap-y-3 gap-x-6 text-xs sm:text-sm text-[#5C564E]">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-[#D97757]" />
                      <span className="font-semibold text-[#1F1E1D]">Chuyên ngành:</span>
                      <span>{project.topic || "Chưa xác định"}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-[#D97757]" />
                      <span className="font-semibold text-[#1F1E1D]">GVHD:</span>
                      <span>{project.supervisor_name || "Chưa phân công"}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#D97757]" />
                      <span className="font-semibold text-[#1F1E1D]">Niên khóa:</span>
                      <span>{project.academic_year || "2024 - 2025"}</span>
                    </div>
                  </div>
                </div>

                {/* 2-Column Core Action Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
                  {/* Left Column (7 Cols): Documents & Knowledge Base (Phase 5 Bridge) */}
                  <div className="lg:col-span-7 bg-white rounded-3xl border border-[#E0D9CE] p-7 shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-[#F6F1E8] border border-[#E0D9CE] flex items-center justify-center text-[#D97757]">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="font-serif text-lg sm:text-xl font-semibold text-[#1F1E1D]">
                              Hồ sơ Tài liệu & Chỉ mục RAG
                            </h3>
                            <span className="text-xs text-[#7A756D]">
                              Nguồn dữ liệu đối chiếu trong buổi phản biện
                            </span>
                          </div>
                        </div>

                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#F6F1E8] text-[#D97757] border border-[#E0D9CE]">
                          {project.documents_count} tài liệu
                        </span>
                      </div>

                      {project.documents_count === 0 ? (
                        <div className="bg-[#FAF7F2] rounded-2xl border border-[#EBE3D7] p-5 mb-5 text-left">
                          <div className="flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                            <div>
                              <h4 className="text-sm font-semibold text-[#1F1E1D] mb-1">
                                Chưa nạp tài liệu nghiên cứu nào
                              </h4>
                              <p className="text-xs text-[#5C564E] leading-relaxed">
                                Để kích hoạt Hội đồng AI sinh bộ câu hỏi phản biện sát với đề tài, bạn cần nạp file đề cương hoặc toàn văn luận văn (PDF, DOCX).
                              </p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-emerald-50/60 rounded-2xl border border-emerald-200/80 p-5 mb-5 text-left">
                          <div className="flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                            <div>
                              <h4 className="text-sm font-semibold text-emerald-950 mb-1">
                                Nguồn tài liệu đã sẵn sàng
                              </h4>
                              <p className="text-xs text-emerald-800 leading-relaxed">
                                Dữ liệu vector HNSW đã được lập chỉ mục cục bộ. Bạn có thể thêm phiên bản mới bất cứ lúc nào.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => setIsDocModalOpen(true)}
                      className={`w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                        project.documents_count === 0
                          ? "bg-[#D97757] hover:bg-[#C86B4D] text-white shadow-xs"
                          : "bg-[#FAF7F2] hover:bg-[#F2ECE1] border border-[#DDD5C9] text-[#1F1E1D]"
                      }`}
                    >
                      <Upload className="w-4 h-4" />
                      <span>
                        {project.documents_count === 0
                          ? "Tải lên tài liệu nghiên cứu ngay"
                          : "Quản lý & Tải lên tài liệu mới"}
                      </span>
                    </button>
                  </div>

                  {/* Right Column (5 Cols): Practice Room Launchpad (Phase 6 & 7 Bridge) */}
                  <div className="lg:col-span-5 bg-gradient-to-b from-[#1C1B1A] to-[#2B2926] text-white rounded-3xl p-7 shadow-md flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#D97757]/15 rounded-full blur-2xl pointer-events-none" />

                    <div className="relative z-10">
                      <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-[#D97757] mb-5">
                        <Mic className="w-5 h-5" />
                      </div>

                      <span className="text-xs font-bold text-[#D97757] tracking-wider uppercase block mb-2">
                        Trọng tâm luyện tập
                      </span>

                      <h3 className="font-serif text-2xl text-white font-normal leading-snug mb-3">
                        Phòng Luyện tập Phản biện
                      </h3>

                      <p className="text-xs sm:text-sm text-[#D6D3D1] leading-relaxed mb-6 font-normal">
                        Mô phỏng buổi bảo vệ trực tiếp bằng giọng nói (Voice-first). AI đóng vai Hội đồng xoáy sâu vào các điểm quan trọng trong đề tài.
                      </p>

                      <div className="space-y-2 mb-8 text-xs text-[#A8A29E]">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Mode A: Q&A phản xạ thời gian thực</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Mode B: Thuyết trình slide & ngắt lời chất vấn</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Chấm điểm Rubric & nghe lại âm thanh phản biện</span>
                        </div>
                      </div>
                    </div>

                    <div className="relative z-10">
                      <button
                        onClick={() => {
                          if (project.documents_count === 0) {
                            toast.warning(
                              "Bạn chưa nạp tài liệu nghiên cứu. Vui lòng nạp tài liệu trước để Hội đồng AI có căn cứ sinh câu hỏi!"
                            );
                            setIsDocModalOpen(true);
                          } else {
                            toast.success("Nguồn tri thức đã sẵn sàng! Phòng phản biện AI sẽ được kết nối ở Phase 6.");
                          }
                        }}
                        className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl bg-[#D97757] hover:bg-[#C86B4D] active:scale-[0.99] text-white text-sm sm:text-base font-medium transition-all shadow-md cursor-pointer"
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>Bắt đầu Luyện tập Phản biện</span>
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </button>

                      <span className="block text-center text-[11px] text-[#A8A29E] mt-3">
                        Hoàn toàn bảo mật &bull; Chạy cục bộ trên phần cứng máy bạn
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* ===================================================================== */}
        {/* EDIT PROJECT MODAL DIALOG                                             */}
        {/* ===================================================================== */}
        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl border border-[#E0D9CE] max-w-2xl w-full p-6 sm:p-8 shadow-xl relative max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#FAF7F2] border border-[#DDD5C9] flex items-center justify-center text-[#6F6A62] hover:text-[#1F1E1D] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="mb-6">
                <div className="flex items-center gap-2 text-xs font-bold text-[#D97757] uppercase tracking-wider mb-1.5">
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Cập nhật đề tài</span>
                </div>
                <h3 className="font-serif text-2xl text-[#1F1E1D] font-normal">
                  Chỉnh sửa thông tin đồ án tốt nghiệp
                </h3>
              </div>

              <form onSubmit={handleUpdateProject} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-[#6F6A62] uppercase tracking-wider mb-2">
                    Tên đề tài đồ án <span className="text-[#C83228]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#DDD5C9] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D97757]/30 focus:border-[#D97757] text-[#1F1E1D] text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#6F6A62] uppercase tracking-wider mb-2">
                      Chuyên ngành / Hướng nghiên cứu
                    </label>
                    <input
                      type="text"
                      value={editTopic}
                      onChange={(e) => setEditTopic(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#DDD5C9] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D97757]/30 focus:border-[#D97757] text-[#1F1E1D] text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#6F6A62] uppercase tracking-wider mb-2">
                      Trạng thái đề tài
                    </label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value as ProjectStatus)}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#DDD5C9] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D97757]/30 focus:border-[#D97757] text-[#1F1E1D] text-sm cursor-pointer"
                    >
                      <option value="PLANNING">Lập kế hoạch</option>
                      <option value="IN_PROGRESS">Đang triển khai</option>
                      <option value="READY_FOR_DEFENSE">Sẵn sàng bảo vệ</option>
                      <option value="COMPLETED">Đã hoàn thành</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#6F6A62] uppercase tracking-wider mb-2">
                      Niên khóa / Năm học
                    </label>
                    <input
                      type="text"
                      value={editAcademicYear}
                      onChange={(e) => setEditAcademicYear(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#DDD5C9] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D97757]/30 focus:border-[#D97757] text-[#1F1E1D] text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#6F6A62] uppercase tracking-wider mb-2">
                      Giảng viên hướng dẫn
                    </label>
                    <select
                      value={editSupervisorId}
                      onChange={(e) => setEditSupervisorId(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#DDD5C9] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D97757]/30 focus:border-[#D97757] text-[#1F1E1D] text-sm cursor-pointer"
                    >
                      <option value="">-- Chưa chọn giảng viên --</option>
                      {lecturers.map((lec) => (
                        <option key={lec.id} value={lec.id}>
                          {lec.name} ({lec.email})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#6F6A62] uppercase tracking-wider mb-2">
                    Mô tả tóm tắt đề tài
                  </label>
                  <textarea
                    rows={4}
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#DDD5C9] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D97757]/30 focus:border-[#D97757] text-[#1F1E1D] text-sm leading-relaxed resize-none"
                  />
                </div>

                <div className="pt-3 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl border border-[#DDD5C9] text-xs sm:text-sm font-medium text-[#5C564E] hover:bg-[#FAF7F2] transition-colors cursor-pointer"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#D97757] hover:bg-[#C86B4D] text-white text-xs sm:text-sm font-medium transition-all shadow-xs cursor-pointer disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Đang cập nhật...</span>
                      </>
                    ) : (
                      <span>Lưu thay đổi</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Document Manager Modal */}
        {project && (
          <DocumentManagerModal
            projectId={project.id}
            isOpen={isDocModalOpen}
            onClose={() => setIsDocModalOpen(false)}
            onDocumentsChange={(newCount) => {
              setProject((prev) => (prev ? { ...prev, documents_count: newCount } : null));
            }}
          />
        )}
      </main>
    </div>
  );
}
