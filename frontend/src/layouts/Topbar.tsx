import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import gsap from 'gsap';

export const Topbar = () => {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark') ||
        (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
    
    // GSAP animation for body bg color to smooth out transition
    gsap.to('body', { duration: 0.3, backgroundColor: isDark ? '#111827' : '#f9fafb' });
  }, [isDark]);

  return (
    <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-8 transition-colors duration-300">
      <h1 className="text-xl font-semibold text-gray-800 dark:text-white">Dashboard</h1>
      
      <div className="flex items-center space-x-4">
        <button
          onClick={() => setIsDark(!isDark)}
          className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all"
          aria-label="Toggle Dark Mode"
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </header>
  );
};
