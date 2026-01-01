import { createContext } from "react";

export interface User {
  email: string;
  name: string;
  role: string;
  [key: string]: string | number | boolean | null;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  API_BASE: string;
}

export const AuthContext = createContext<AuthContextType | null>(null);

