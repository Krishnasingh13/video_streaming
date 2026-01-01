import AdminLayout from "../layouts/AdminLayout";
import StatCard from "../components/StatCard";
import QuickActionCard from "../components/QuickActionCard";
import ErrorBanner from "../components/ErrorBanner";
import LoadingState from "../components/LoadingState";
import { adminStatCards } from "../constants/constant";
import { useAdminSummary } from "../hooks";

const AdminDashboard = () => {
  const { summary, loading, error } = useAdminSummary();

  return (
    <AdminLayout>
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-[1.75rem] font-bold m-0 mb-1 text-text-primary">
            Admin Overview
          </h1>
          <p className="m-0 text-text-secondary text-[0.95rem]">
            System-wide statistics and management tools
          </p>
        </div>
      </div>

      {error && <ErrorBanner message={error} />}

      {loading ? (
        <LoadingState message="Loading dashboard..." />
      ) : (
        <>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 mb-8">
            {adminStatCards(summary).map((stat) => (
              <StatCard
                key={stat.label}
                label={stat.label}
                value={stat.value}
                icon={stat.icon}
                color={stat.color}
                link={stat.link}
              />
            ))}
          </div>

          <div className="grid gap-6">
            <div className="bg-bg-card rounded-xl border border-border overflow-hidden">
              <div className="px-5 py-4 border-b border-border flex justify-between items-center">
                <h2 className="m-0 text-base font-semibold">Quick Actions</h2>
              </div>
              <div className="p-4 flex flex-col gap-3">
                <QuickActionCard
                  title="Manage Users"
                  description="View and manage all registered users"
                  icon={
                    <svg
                      width="28"
                      height="28"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                  }
                  iconBg="bg-[rgba(59,130,246,0.15)] text-accent-blue"
                  to="/admin/users"
                />

                <QuickActionCard
                  title="Manage Videos"
                  description="View all uploaded videos across the system"
                  icon={
                    <svg
                      width="28"
                      height="28"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
                      />
                    </svg>
                  }
                  iconBg="bg-[rgba(139,92,246,0.15)] text-accent-purple"
                  to="/admin/videos"
                />
              </div>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
};

export default AdminDashboard;
