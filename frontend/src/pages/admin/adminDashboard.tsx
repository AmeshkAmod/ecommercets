import { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import { DashboardStats } from "../../types/dashboard";

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:5000/api/admin/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data: DashboardStats = await res.json();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <AdminLayout>
      <h1 className="text-xl font-bold mb-6">Dashboard</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Total Orders"
            value={stats?.totalOrders.toString() ?? "0"}
          />
          <StatCard
            title="Total Revenue"
            value={`₹ ${stats?.totalRevenue ?? 0}`}
          />
          <StatCard
            title="Products"
            value={stats?.totalProducts.toString() ?? "0"}
          />
        </div>
      )}
    </AdminLayout>
  );
}

interface StatCardProps {
  title: string;
  value: string;
}

function StatCard({ title, value }: StatCardProps) {
  return (
    <div className="bg-black border border-gray-800 rounded-xl p-5">
      <p className="text-sm text-gray-400">{title}</p>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </div>
  );
}