import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import DashboardLayout from "../layouts/DashboardLayout";
import StatCard from "../components/StatCard";
import ProfileCard from "../components/ProfileCard";
import { dashboardStatCards } from "../constants/constant";
import { useVideoStats } from "../hooks";

const Dashboard = () => {
  const { user } = useAuth();
  const stats = useVideoStats();

  return (
    <DashboardLayout>
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-[1.75rem] font-bold m-0 mb-1 text-text-primary">
            Welcome back, {user?.name || "there"}!
          </h1>
          <p className="m-0 text-text-secondary text-[0.95rem]">
            Here&apos;s an overview of your video library
          </p>
        </div>
        <Link
          to="/upload"
          className="gradient-blue text-white rounded-lg py-2.5 px-5 border-none cursor-pointer text-sm font-medium transition-all inline-flex items-center gap-2 shadow-[0_2px_8px_rgba(59,130,246,0.3)] hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(59,130,246,0.4)]"
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Upload Video
        </Link>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 mb-8">
        {dashboardStatCards(stats).map((stat) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
          />
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <ProfileCard user={user} badge={user?.role} />

        <div className="bg-bg-card rounded-xl border border-border overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex justify-between items-center">
            <h2 className="m-0 text-base font-semibold">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-2 gap-3 px-5 py-4">
            <Link
              to="/upload"
              className="flex flex-col items-center gap-3 p-5 bg-bg-tertiary rounded-xl border border-border transition-all text-center text-sm text-text-secondary hover:border-accent-blue hover:-translate-y-0.5 hover:text-text-primary"
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[rgba(59,130,246,0.15)] text-accent-blue">
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
              </div>
              <span>Upload New Video</span>
            </Link>
            <Link
              to="/my-videos"
              className="flex flex-col items-center gap-3 p-5 bg-bg-tertiary rounded-xl border border-border transition-all text-center text-sm text-text-secondary hover:border-accent-blue hover:-translate-y-0.5 hover:text-text-primary"
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[rgba(139,92,246,0.15)] text-accent-purple">
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <span>View Library</span>
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
