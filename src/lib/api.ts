export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export interface User {
  id: number;
  name: string;
  email: string;
  role: "student" | "lecturer" | "admin";
  is_active: boolean;
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

class ApiClient {
  private getAuthHeader(): Record<string, string> {
    if (typeof window === "undefined") return {};
    const token = localStorage.getItem("thesisai_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...this.getAuthHeader(),
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const message = errorData.detail || "Đã xảy ra lỗi khi kết nối máy chủ";
      throw new Error(message);
    }

    return res.json();
  }

  async get<T>(endpoint: string): Promise<T> {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "GET",
      headers: {
        ...this.getAuthHeader(),
      },
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const message = errorData.detail || "Đã xảy ra lỗi khi kết nối máy chủ";
      throw new Error(message);
    }

    return res.json();
  }

  async patch<T>(endpoint: string, data: any): Promise<T> {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...this.getAuthHeader(),
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const message = errorData.detail || "Đã xảy ra lỗi khi kết nối máy chủ";
      throw new Error(message);
    }

    return res.json();
  }

  async upload<T>(endpoint: string, formData: FormData): Promise<T> {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        ...this.getAuthHeader(),
      },
      body: formData,
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const message = errorData.detail || "Đã xảy ra lỗi khi tải lên tệp";
      throw new Error(message);
    }

    return res.json();
  }

  async delete<T>(endpoint: string): Promise<T> {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "DELETE",
      headers: {
        ...this.getAuthHeader(),
      },
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const message = errorData.detail || "Đã xảy ra lỗi khi xóa dữ liệu";
      throw new Error(message);
    }

    return res.json();
  }
}

export const api = new ApiClient();
