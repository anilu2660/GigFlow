import { useEffect, useRef, useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import gsap from 'gsap';
import { Users, UserPlus, FileText, CheckCircle, Loader2 } from 'lucide-react';
import { leadService } from '../features/leads/LeadService';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend
} from 'recharts';

interface DashboardStats {
  totalLeads: number;
  newLeads: number;
  qualifiedLeads: number;
  lostLeads: number;
  statusDistribution: { name: string; value: number }[];
  sourceDistribution: { name: string; value: number }[];
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export const Dashboard = () => {
  const { user } = useAuthStore();
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await leadService.getDashboardStats();
        setStats(res.data);
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  useEffect(() => {
    if (!loading && stats && containerRef.current) {
      // Animate stat cards
      const cards = containerRef.current.querySelectorAll('.stat-card');
      gsap.fromTo(cards,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out' }
      );

      // Animate charts
      const charts = containerRef.current.querySelectorAll('.chart-card');
      gsap.fromTo(charts,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.8, stagger: 0.2, ease: 'back.out(1.2)' }
      );
    }
  }, [loading, stats]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-primary-500" size={48} />
      </div>
    );
  }

  const statCards = [
    { label: 'Total Leads', value: stats?.totalLeads || 0, icon: Users, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30' },
    { label: 'New Leads', value: stats?.newLeads || 0, icon: UserPlus, color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/30' },
    { label: 'Qualified', value: stats?.qualifiedLeads || 0, icon: CheckCircle, color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-900/30' },
    { label: 'Lost', value: stats?.lostLeads || 0, icon: FileText, color: 'text-red-500', bg: 'bg-red-100 dark:bg-red-900/30' },
  ];

  return (
    <div className="space-y-6" ref={containerRef}>
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome back, {user?.name}</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Here's what's happening with your leads today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="stat-card card p-6 flex items-center space-x-4">
              <div className={`p-4 rounded-full ${stat.bg}`}>
                <Icon className={stat.color} size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="chart-card card p-6 min-h-[350px]">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Lead Sources</h2>
          <div className="h-72">
            {stats?.sourceDistribution && stats.sourceDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.sourceDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" tick={{ fill: '#6b7280' }} className="capitalize" />
                  <YAxis tick={{ fill: '#6b7280' }} allowDecimals={false} />
                  <Tooltip 
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  />
                  <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">No data available</div>
            )}
          </div>
        </div>

        <div className="chart-card card p-6 min-h-[350px]">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Lead Status</h2>
          <div className="h-72">
            {stats?.statusDistribution && stats.statusDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.statusDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {stats.statusDistribution.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">No data available</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
