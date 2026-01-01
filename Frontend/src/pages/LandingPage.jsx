import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const LandingPage = ({ onLogin, onRegister }) => {
  const { user } = useAuth();
  const isAdmin = user && (user.role === 'ADMIN');

  return (
    <section>
      <div className="text-center py-16">
        <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-text-primary to-accent-blue bg-clip-text text-transparent">VideoSense</h1>
        <p className="text-xl text-text-secondary max-w-[600px] mx-auto mb-8">
          Upload videos, run sensitivity analysis in real-time, and stream them
          securely with role-based access control.
        </p>

        <div className="flex gap-4 justify-center">
          {user ? (
            <Link to={isAdmin ? "/admin" : "/dashboard"} className="gradient-blue text-white rounded-lg py-2.5 px-5 border-none cursor-pointer text-sm font-medium transition-all inline-flex items-center gap-2 shadow-[0_2px_8px_rgba(59,130,246,0.3)] hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(59,130,246,0.4)]">
              Go to Dashboard
            </Link>
          ) : (
            <>
              <button onClick={onRegister} className="gradient-blue text-white rounded-lg py-2.5 px-5 border-none cursor-pointer text-sm font-medium transition-all inline-flex items-center gap-2 shadow-[0_2px_8px_rgba(59,130,246,0.3)] hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(59,130,246,0.4)]">
                Get Started
              </button>
              <button onClick={onLogin} className="bg-bg-tertiary text-text-primary border border-border rounded-lg py-2.5 px-5 cursor-pointer text-sm font-medium transition-all inline-flex items-center gap-2 hover:bg-bg-hover hover:border-border-light">
                Login
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid gap-5 py-8 md:grid-cols-3">
        <div className="bg-bg-card rounded-xl p-6 border border-border transition-all hover:border-border-light hover:-translate-y-0.5">
          <h3 className="m-0 mb-3 text-lg">Real-time Processing</h3>
          <p className="m-0 text-sm text-text-secondary">Track video sensitivity analysis live with Socket.io updates.</p>
        </div>
        <div className="bg-bg-card rounded-xl p-6 border border-border transition-all hover:border-border-light hover:-translate-y-0.5">
          <h3 className="m-0 mb-3 text-lg">Secure Streaming</h3>
          <p className="m-0 text-sm text-text-secondary">Chunked HTTP streaming with access control per user and role.</p>
        </div>
        <div className="bg-bg-card rounded-xl p-6 border border-border transition-all hover:border-border-light hover:-translate-y-0.5">
          <h3 className="m-0 mb-3 text-lg">Multi-Role Access</h3>
          <p className="m-0 text-sm text-text-secondary">Admin, Editor, and Viewer roles for fine control.</p>
        </div>
      </div>
    </section>
  );
};

export default LandingPage;
