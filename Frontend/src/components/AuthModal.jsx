import React, { useState, useEffect } from "react";
import Input from "./Input";
import Select from "./Select";
import Button from "./Button";
import { useLogin, useRegister } from "../hooks";

const AuthModal = ({ isOpen, onClose, initialMode = "login" }) => {
  const { login: handleLogin, loading: loginLoading, error: loginError } = useLogin();
  const { register: handleRegister, loading: registerLoading, error: registerError } = useRegister();
  const [mode, setMode] = useState(initialMode);

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    email: "",
    password: "",
    name: "",
    role: "VIEWER",
  });

  const loading = mode === "login" ? loginLoading : registerLoading;
  const error = mode === "login" ? loginError : registerError;

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode, isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleLoginChange = (e) => {
    setLoginForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleRegisterChange = (e) => {
    setRegisterForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const onLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      await handleLogin({ email: loginForm.email, password: loginForm.password });
      onClose();
    } catch (err) {
      // Error is handled by the hook
    }
  };

  const onRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      await handleRegister({
        email: registerForm.email,
        password: registerForm.password,
        name: registerForm.name,
        role: registerForm.role,
      });
      onClose();
    } catch (err) {
      // Error is handled by the hook
    }
  };

  const switchMode = () => {
    setMode(mode === "login" ? "register" : "login");
    setError("");
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[1000] p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative bg-bg-card border border-border rounded-[1.25rem] w-full max-w-lg p-8 shadow-[0_8px_24px_rgba(0,0,0,0.5)] animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 bg-transparent border-none text-text-muted cursor-pointer p-2 rounded-lg transition-all hover:bg-bg-hover hover:text-text-primary"
          onClick={onClose}
        >
          <svg
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="text-center mb-6">
          <h2 className="m-0 mb-1 text-2xl font-bold text-text-primary">
            {mode === "login" ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="m-0 text-sm text-text-secondary">
            {mode === "login"
              ? "Sign in to your account"
              : "Get started with VideoSense"}
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 px-4 py-3 bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.2)] rounded-xl text-accent-red text-sm mb-4">
            <svg
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {mode === "login" ? (
          <form onSubmit={onLoginSubmit} className="flex flex-col gap-4">
            <Input
              id="login-email"
              type="email"
              name="email"
              value={loginForm.email}
              onChange={handleLoginChange}
              placeholder="you@example.com"
              label="Email"
              required
              autoFocus
              className="rounded-xl py-3.5 text-[0.95rem] focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)]"
            />

            <Input
              id="login-password"
              type="password"
              name="password"
              value={loginForm.password}
              onChange={handleLoginChange}
              placeholder="••••••••"
              label="Password"
              required
              className="rounded-xl py-3.5 text-[0.95rem] focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)]"
            />

            <Button
              type="submit"
              loading={loading}
              className="mt-2 px-6 py-3.5 rounded-xl text-base font-semibold shadow-[0_4px_12px_rgba(59,130,246,0.3)] hover:shadow-[0_6px_16px_rgba(59,130,246,0.4)]"
            >
              Sign In
            </Button>
          </form>
        ) : (
          <form onSubmit={onRegisterSubmit} className="flex flex-col gap-4">
            <Input
              id="register-name"
              type="text"
              name="name"
              value={registerForm.name}
              onChange={handleRegisterChange}
              placeholder="John Doe"
              label="Name"
              autoFocus
              className="rounded-xl py-3.5 text-[0.95rem] focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)]"
            />

            <Input
              id="register-email"
              type="email"
              name="email"
              value={registerForm.email}
              onChange={handleRegisterChange}
              placeholder="you@example.com"
              label="Email"
              required
              className="rounded-xl py-3.5 text-[0.95rem] focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)]"
            />

            <Input
              id="register-password"
              type="password"
              name="password"
              value={registerForm.password}
              onChange={handleRegisterChange}
              placeholder="••••••••"
              label="Password"
              required
              className="rounded-xl py-3.5 text-[0.95rem] focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)]"
            />

            <Select
              id="register-role"
              name="role"
              value={registerForm.role}
              onChange={handleRegisterChange}
              label="Role"
              options={[
                { value: "VIEWER", label: "Viewer" },
                { value: "EDITOR", label: "Editor" },
                { value: "ADMIN", label: "Admin" },
              ]}
              className="rounded-xl py-3.5 text-[0.95rem] focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)]"
            />

            <Button
              type="submit"
              loading={loading}
              className="mt-2 px-6 py-3.5 rounded-xl text-base font-semibold shadow-[0_4px_12px_rgba(59,130,246,0.3)] hover:shadow-[0_6px_16px_rgba(59,130,246,0.4)]"
            >
              Create Account
            </Button>
          </form>
        )}

        <div className="mt-6 pt-6 border-t border-border text-center text-sm text-text-secondary">
          <span>
            {mode === "login"
              ? "Don't have an account?"
              : "Already have an account?"}
          </span>
          <button
            type="button"
            className="bg-transparent border-none text-accent-blue text-sm font-semibold cursor-pointer ml-1 transition-colors hover:text-accent-blue-hover hover:underline"
            onClick={switchMode}
          >
            {mode === "login" ? "Sign up" : "Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
