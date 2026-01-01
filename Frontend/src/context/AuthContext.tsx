import { useEffect, useState, type ReactNode } from "react";
import { initializeSocket, disconnectSocket, getSocket } from "../utils/socket";
import { AuthContext, type User, type AuthContextType } from "./AuthContext";

const API_BASE = "http://localhost:4000"; // change if needed

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null); // { email, role, name, ... }
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // for initial /me check

  useEffect(() => {
    // On first load, check localStorage for token and try to fetch /me
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });

        if (!res.ok) {
          localStorage.removeItem("token");
          setLoading(false);
          return;
        }

        const data = await res.json();
        setToken(storedToken);
        setUser(data.user);

        // Initialize socket connection
        if (data.user?._id) {
          initializeSocket(data.user._id.toString(), storedToken, API_BASE);
        }
      } catch (err) {
        console.error("Error fetching /me:", err);
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Listen for role updates from socket
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleRoleUpdate = ({ newRole }: { newRole: string }) => {
      console.log("Role updated via socket:", newRole);
      setUser((prev) => (prev ? { ...prev, role: newRole } : null));
    };

    socket.on("roleUpdated", handleRoleUpdate);

    return () => {
      socket.off("roleUpdated", handleRoleUpdate);
    };
  }, []);

  const login = (token: string, user: User) => {
    localStorage.setItem("token", token);
    setToken(token);
    setUser(user);

    // Initialize socket connection after login
    if (user?._id) {
      initializeSocket(user._id.toString(), token, API_BASE);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);

    // Disconnect socket on logout
    disconnectSocket();
  };

  const value: AuthContextType = {
    user,
    token,
    loading,
    login,
    logout,
    API_BASE,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
