import { useState } from "react";
import { useAuth as useAuthContext } from "../context/AuthContext";
import type { ApiError } from "../types/api";

interface LoginParams {
  email: string;
  password: string;
}

interface RegisterParams {
  email: string;
  password: string;
  name: string;
  role?: string;
}

export const useLogin = () => {
  const { login, API_BASE } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const handleLogin = async ({ email, password }: LoginParams) => {
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError((data as ApiError).message || "Login failed");
        throw new Error((data as ApiError).message || "Login failed");
      }

      login(data.token, data.user);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Something went wrong";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { login: handleLogin, loading, error };
};

export const useRegister = () => {
  const { login, API_BASE } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const handleRegister = async ({ email, password, name, role = "VIEWER" }: RegisterParams) => {
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError((data as ApiError).message || "Registration failed");
        throw new Error((data as ApiError).message || "Registration failed");
      }

      login(data.token, data.user);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Something went wrong";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { register: handleRegister, loading, error };
};

