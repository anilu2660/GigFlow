import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { LayoutDashboard, Users, Download, LogOut, Zap } from 'lucide-react';
import { useEffect } from 'react';
import gsap from 'gsap';
import { leadService } from '../features/leads/LeadService';

export const Sidebar = () => {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Leads', path: '/leads', icon: Users },
  ];
  
  const handleExport = async () => {
    try {
      await leadService.exportCSV();
    } catch (error) {
      console.error('Failed to export CSV', error);
    }
  };

  useEffect(() => {
    gsap.fromTo('.sidebar-item', 
      { x: -20, opacity: 0 }, 
      { x: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power2.out' }
    );
  }, []);

  return (
    <div className="w-64 h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col transition-colors duration-300">
      <div className="p-6 flex items-center gap-2">
        <Zap className="text-primary-600 dark:text-primary-400" size={28} />
        <h2 className="text-2xl font-bold text-primary-600 dark:text-primary-400">Gigflow</h2>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`sidebar-item flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                isActive 
                  ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              <Icon size={20} />
              <span>{item.name}</span>
            </Link>
          );
        })}
        {user?.role === 'admin' && (
          <button
            onClick={handleExport}
            className="w-full sidebar-item flex items-center space-x-3 px-4 py-3 rounded-lg transition-all text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <Download size={20} />
            <span>Export CSV</span>
          </button>
        )}
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <div className="flex items-center space-x-3 px-4 py-3 mb-2">
          <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold">
            {user?.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full sidebar-item flex items-center space-x-3 px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};
