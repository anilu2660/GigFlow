import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { useRef, useEffect } from 'react';
import gsap from 'gsap';

export const DashboardLayout = () => {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      gsap.fromTo(contentRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, delay: 0.2, ease: 'power2.out' }
      );
    }
  }, []);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950 overflow-hidden text-gray-900 dark:text-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-950 p-6" ref={contentRef}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};
