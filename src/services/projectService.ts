import { api } from "@/lib/api";

export type ProjectStatus = "PLANNING" | "IN_PROGRESS" | "READY_FOR_DEFENSE" | "COMPLETED";

export interface Project {
  id: number;
  student_id: number;
  student_name?: string | null;
  student_email?: string | null;
  supervisor_id?: number | null;
  supervisor_name?: string | null;
  title: string;
  topic?: string | null;
  description?: string | null;
  status: ProjectStatus;
  academic_year?: string | null;
  documents_count: number;
  created_at: string;
  updated_at: string;
}

export interface Lecturer {
  id: number;
  name: string;
  email: string;
}

export interface ProjectCreatePayload {
  title: string;
  topic?: string;
  description?: string;
  academic_year?: string;
  supervisor_id?: number | null;
}

export interface ProjectUpdatePayload {
  title?: string;
  topic?: string;
  description?: string;
  status?: ProjectStatus;
  academic_year?: string;
  supervisor_id?: number | null;
}

export const STATUS_CONFIG: Record<
  ProjectStatus,
  { label: string; color: string; bg: string; border: string; dot: string }
> = {
  PLANNING: {
    label: "Lập kế hoạch",
    color: "text-amber-800",
    bg: "bg-amber-50",
    border: "border-amber-200",
    dot: "bg-amber-500",
  },
  IN_PROGRESS: {
    label: "Đang triển khai",
    color: "text-sky-800",
    bg: "bg-sky-50",
    border: "border-sky-200",
    dot: "bg-sky-500",
  },
  READY_FOR_DEFENSE: {
    label: "Sẵn sàng bảo vệ",
    color: "text-emerald-800",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    dot: "bg-emerald-500",
  },
  COMPLETED: {
    label: "Đã hoàn thành",
    color: "text-purple-800",
    bg: "bg-purple-50",
    border: "border-purple-200",
    dot: "bg-purple-500",
  },
};

export const projectService = {
  async getMyProject(): Promise<Project | null> {
    return api.get<Project | null>("/projects/my-project");
  },

  async createProject(payload: ProjectCreatePayload): Promise<Project> {
    return api.post<Project>("/projects", payload);
  },

  async updateProject(id: number, payload: ProjectUpdatePayload): Promise<Project> {
    return api.patch<Project>(`/projects/${id}`, payload);
  },

  async getLecturers(): Promise<Lecturer[]> {
    return api.get<Lecturer[]>("/projects/lecturers");
  },
};

