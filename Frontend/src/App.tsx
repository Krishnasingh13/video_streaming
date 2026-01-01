import { useState } from "react";
import { Link, Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import VideoUploadPage from "./pages/VideoUploadPage";
import MyVideosPage from "./pages/MyVideosPage";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsersPage from "./pages/AdminUsersPage";
import AdminVideosPage from "./pages/AdminVideosPage";
import AuthModal from "./components/AuthModal";

const App = () => {
  const { user, loading, logout } = useAuth();
  const [authModal, setAuthModal] = useState<{ isOpen: boolean; mode: 'login' | 'register' }>({
    isOpen: false,
    mode: 'login',
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[40vh]">
        <p>Loading...</p>
      </div>
    );
  }

  const isAdmin = user && (user.role === "ADMIN");

  const openLogin = () => setAuthModal({ isOpen: true, mode: 'login' });
  const openRegister = () => setAuthModal({ isOpen: true, mode: 'register' });
  const closeAuth = () => setAuthModal({ isOpen: false, mode: 'login' });

  return (
    <div className="min-h-screen flex flex-col">
      <header className="py-3.5 px-8 border-b border-border flex justify-between items-center bg-bg-secondary sticky top-0 z-[100]">
        <Link to="/" className="font-bold text-xl text-gradient">
          VideoSense
        </Link>

        <nav className="flex gap-2 items-center">
          {user ? (
            <>
              <span className="text-sm text-text-muted pr-4 border-r border-border mr-2">
                Hello, {user.name || user.email}
              </span>
              <button 
                onClick={logout} 
                className="rounded-lg py-2.5 px-5 border-none cursor-pointer text-sm font-medium transition-all inline-flex items-center gap-2 bg-bg-tertiary text-text-primary border border-border hover:bg-bg-hover hover:border-border-light"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={openLogin} 
                className="bg-transparent text-text-secondary border-none py-2 px-4 text-sm cursor-pointer transition-colors hover:text-text-primary"
              >
                Login
              </button>
              <button 
                onClick={openRegister} 
                className="gradient-blue text-white rounded-lg py-2.5 px-5 border-none cursor-pointer text-sm font-medium transition-all inline-flex items-center gap-2 shadow-[0_2px_8px_rgba(59,130,246,0.3)] hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(59,130,246,0.4)]"
              >
                Register
              </button>
            </>
          )}
        </nav>
      </header>

      <Routes>
        {/* Public landing page */}
        <Route
          path="/"
          element={
            user ? (
              <Navigate to={isAdmin ? "/admin" : "/dashboard"} />
            ) : (
              <main className="flex-1 p-8 max-w-[1200px] mx-auto w-full">
                <LandingPage onLogin={openLogin} onRegister={openRegister} />
              </main>
            )
          }
        />

        {/* Redirect old auth routes to home with modal */}
        <Route
          path="/login"
          element={<Navigate to="/" />}
        />
        <Route
          path="/register"
          element={<Navigate to="/" />}
        />

        {/* User Dashboard pages - redirect admins to admin dashboard */}
        <Route
          path="/dashboard"
          element={
            user ? (
              isAdmin ? (
                <Navigate to="/admin" />
              ) : (
                <Dashboard />
              )
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/upload"
          element={
            user ? (
              isAdmin ? (
                <Navigate to="/admin" />
              ) : (
                <VideoUploadPage />
              )
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/my-videos"
          element={
            user ? (
              isAdmin ? (
                <Navigate to="/admin" />
              ) : (
                <MyVideosPage />
              )
            ) : (
              <Navigate to="/" />
            )
          }
        />

        {/* Admin pages with admin sidebar layout */}
        <Route
          path="/admin"
          element={isAdmin ? <AdminDashboard /> : <Navigate to="/dashboard" />}
        />
        <Route
          path="/admin/users"
          element={isAdmin ? <AdminUsersPage /> : <Navigate to="/dashboard" />}
        />
        <Route
          path="/admin/videos"
          element={isAdmin ? <AdminVideosPage /> : <Navigate to="/dashboard" />}
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModal.isOpen}
        onClose={closeAuth}
        initialMode={authModal.mode}
      />
    </div>
  );
};

export default App;
