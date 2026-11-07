"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  documentService,
  DocumentItem,
  DOC_STATUS_MAP,
} from "@/services/documentService";
import { toast } from "sonner";
import {
  UploadCloud,
  FileText,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
  Loader2,
  Clock,
  ShieldCheck,
  File,
  Sparkles,
} from "lucide-react";

interface DocumentManagerModalProps {
  projectId: number;
  isOpen: boolean;
  onClose: () => void;
  onDocumentsChange: (newCount: number) => void;
}

export default function DocumentManagerModal({
  projectId,
  isOpen,
  onClose,
  onDocumentsChange,
}: DocumentManagerModalProps) {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [activeVersion, setActiveVersion] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load documents on open
  useEffect(() => {
    if (!isOpen) return;

    async function fetchDocuments() {
      setIsLoading(true);
      try {
        const res = await documentService.getDocuments(projectId);
        setDocuments(res.documents);
        setActiveVersion(res.active_version ?? null);
        onDocumentsChange(res.total);
      } catch (err: any) {
        toast.error(err.message || "Không thể tải danh sách tài liệu.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchDocuments();
  }, [isOpen, projectId]);

  // Handle file upload
  const handleUploadFile = async (file: File) => {
    const ext = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
    const allowed = [".pdf", ".docx", ".pptx"];
    if (!allowed.includes(ext)) {
      toast.error(`Định dạng "${ext}" không được hỗ trợ. Chỉ chấp nhận .pdf, .docx, .pptx.`);
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      toast.error("Dung lượng tệp vượt quá giới hạn tối đa 50MB.");
      return;
    }

    setIsUploading(true);
    try {
      const newDoc = await documentService.uploadDocument(projectId, file);
      toast.success(`Đã tải lên "${file.name}" (Phiên bản v${newDoc.version})!`);

      // Refresh list
      const res = await documentService.getDocuments(projectId);
      setDocuments(res.documents);
      setActiveVersion(res.active_version ?? null);
      onDocumentsChange(res.total);
    } catch (err: any) {
      toast.error(err.message || "Tải lên tài liệu thất bại.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleUploadFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  // Handle delete document
  const handleDeleteDocument = async (docId: number, filename: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa tài liệu "${filename}"?`)) return;

    setDeletingId(docId);
    try {
      await documentService.deleteDocument(projectId, docId);
      toast.success("Đã xóa tài liệu thành công.");

      // Refresh list
      const res = await documentService.getDocuments(projectId);
      setDocuments(res.documents);
      setActiveVersion(res.active_version ?? null);
      onDocumentsChange(res.total);
    } catch (err: any) {
      toast.error(err.message || "Xóa tài liệu thất bại.");
    } finally {
      setDeletingId(null);
    }
  };

  // Helper for file type icon
  const getFileBadge = (filename: string) => {
    const ext = filename.substring(filename.lastIndexOf(".")).toLowerCase();
    if (ext === ".pdf") {
      return {
        label: "PDF",
        bg: "bg-red-50 text-red-700 border-red-200",
      };
    }
    if (ext === ".docx") {
      return {
        label: "WORD",
        bg: "bg-blue-50 text-blue-700 border-blue-200",
      };
    }
    if (ext === ".pptx") {
      return {
        label: "SLIDE",
        bg: "bg-amber-50 text-amber-700 border-amber-200",
      };
    }
    return {
      label: "DOC",
      bg: "bg-stone-50 text-stone-700 border-stone-200",
    };
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-[#E0D9CE] max-w-3xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[92vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-start justify-between pb-5 border-b border-[#EAE4D9]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF7F2] border border-[#E0D9CE] text-xs font-semibold text-[#D97757] mb-2 uppercase tracking-wide">
              <FileText className="w-3.5 h-3.5" />
              <span>Phase 5 &bull; Quản lý tài liệu đồ án</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#141312] font-normal tracking-tight">
              Hồ sơ Tài liệu & Chỉ mục RAG
            </h2>
            <p className="text-xs sm:text-sm text-[#6F6A62] mt-1">
              Tải lên đề cương hoặc toàn văn luận văn để AI phân tích cấu trúc, trích xuất trang và phục vụ đối chiếu phản biện.
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#FAF7F2] border border-[#DDD5C9] flex items-center justify-center text-[#6F6A62] hover:text-[#1F1E1D] transition-colors cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto py-5 space-y-6">
          {/* Upload Dropzone */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
              isDragOver
                ? "border-[#D97757] bg-[#D97757]/5 scale-[0.99]"
                : "border-[#D9D3C7] bg-[#FAF8F5] hover:bg-[#F5EFE6] hover:border-[#C86B4D]"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.pptx"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleUploadFile(e.target.files[0]);
                }
              }}
            />

            {isUploading ? (
              <div className="flex flex-col items-center py-2">
                <Loader2 className="w-9 h-9 animate-spin text-[#D97757] mb-3" />
                <span className="text-sm font-semibold text-[#1F1E1D]">
                  Đang tải lên và tính toán mã băm SHA-256...
                </span>
                <span className="text-xs text-[#7A756D] mt-1">
                  Vui lòng chờ trong giây lát
                </span>
              </div>
            ) : (
              <>
                <div className="w-12 h-12 rounded-2xl bg-white border border-[#E0D9CE] flex items-center justify-center text-[#D97757] mb-3 shadow-2xs">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <h4 className="text-sm sm:text-base font-semibold text-[#1F1E1D] mb-1">
                  Kéo thả tài liệu vào đây, hoặc <span className="text-[#D97757] underline">chọn tệp từ máy tính</span>
                </h4>
                <p className="text-xs text-[#7A756D] max-w-md mx-auto leading-relaxed mb-3">
                  Hỗ trợ định dạng: <strong className="text-[#1F1E1D]">PDF, DOCX, PPTX</strong> &bull; Tối đa 50MB.
                </p>
                <div className="inline-flex items-center gap-1.5 text-[11px] text-[#6F6A62] bg-white px-2.5 py-1 rounded-full border border-[#E0D9CE]">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Bảo mật 100%: Tệp được lưu trữ cục bộ và kiểm tra trùng lặp</span>
                </div>
              </>
            )}
          </div>

          {/* Document List Section */}
          <div>
            <div className="flex items-center justify-between mb-3.5">
              <h3 className="text-xs font-bold text-[#6F6A62] uppercase tracking-wider">
                Lịch sử phiên bản tài liệu ({documents.length})
              </h3>
              {activeVersion && (
                <span className="text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                  Phiên bản đang kích hoạt: v{activeVersion}
                </span>
              )}
            </div>

            {isLoading ? (
              <div className="py-10 text-center text-[#7A756D]">
                <Loader2 className="w-6 h-6 animate-spin text-[#D97757] mx-auto mb-2" />
                <span className="text-xs">Đang tải danh sách tài liệu...</span>
              </div>
            ) : documents.length === 0 ? (
              <div className="bg-[#FAF8F5] rounded-2xl border border-[#EBE3D7] p-8 text-center">
                <File className="w-10 h-10 text-[#C4BDB0] mx-auto mb-2.5" />
                <h4 className="text-sm font-semibold text-[#1F1E1D] mb-1">
                  Chưa có tài liệu nào trong đề tài
                </h4>
                <p className="text-xs text-[#6F6A62] max-w-sm mx-auto">
                  Tải lên tệp đề cương hoặc bài luận văn tốt nghiệp ở khung phía trên để bắt đầu phân tích dữ liệu.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {documents.map((doc) => {
                  const badge = getFileBadge(doc.original_filename);
                  const statusInfo = DOC_STATUS_MAP[doc.processing_status] || DOC_STATUS_MAP.uploaded;
                  const isActive = !doc.is_archived;

                  return (
                    <div
                      key={doc.id}
                      className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 ${
                        isActive
                          ? "bg-white border-[#D97757]/40 shadow-xs ring-1 ring-[#D97757]/10"
                          : "bg-[#FAF8F5] border-[#E5DFD5] opacity-80"
                      }`}
                    >
                      {/* Left: File info */}
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <span
                          className={`px-2 py-1 rounded-md text-[10px] font-bold border tracking-wider shrink-0 mt-0.5 ${badge.bg}`}
                        >
                          {badge.label}
                        </span>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-sm font-semibold text-[#1F1E1D] truncate max-w-md">
                              {doc.original_filename}
                            </h4>

                            {isActive ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full shrink-0">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span>v{doc.version} &bull; Đang dùng cho RAG</span>
                              </span>
                            ) : (
                              <span className="text-[11px] text-[#7A756D] bg-[#EFEAE1] border border-[#DDD5C9] px-2 py-0.5 rounded-full shrink-0">
                                v{doc.version} &bull; Bản lưu trữ
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-3 text-xs text-[#7A756D] mt-1.5">
                            <span>{doc.file_size_formatted}</span>
                            <span>&bull;</span>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-[#A8A29E]" />
                              <span>{new Date(doc.created_at).toLocaleDateString("vi-VN")}</span>
                            </div>
                            <span>&bull;</span>
                            <div
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] border ${statusInfo.bg} ${statusInfo.color} ${statusInfo.border}`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot}`} />
                              <span>{statusInfo.label}</span>
                            </div>
                          </div>

                          {doc.error_message && (
                            <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                              <span>{doc.error_message}</span>
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                        <button
                          disabled={deletingId === doc.id}
                          onClick={() => handleDeleteDocument(doc.id, doc.original_filename)}
                          className="p-2 rounded-xl text-[#8A847B] hover:text-[#C83228] hover:bg-rose-50 transition-colors cursor-pointer disabled:opacity-50"
                          title="Xóa tài liệu này"
                        >
                          {deletingId === doc.id ? (
                            <Loader2 className="w-4 h-4 animate-spin text-[#C83228]" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="pt-4 border-t border-[#EAE4D9] flex items-center justify-between text-xs text-[#7A756D]">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#D97757]" />
            <span>Khi tải lên bản mới, hệ thống tự động lưu trữ bản cũ để tránh lỗi thời RAG.</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#1F1E1D] hover:bg-[#343330] text-white text-xs sm:text-sm font-medium transition-colors cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
