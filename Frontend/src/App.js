import { Route, Routes, useLocation } from 'react-router-dom';
import React, { useEffect } from 'react';
import CustomerRouters from './customer/routers/CustomerRouters';
import AdminRouters from './customer/routers/AdminRouters';
import AdminGuard from './admin/components/AdminGuard';
import IsAdmin from './config/isAdmin';
import WhatsAppContact from './customer/components/navigation/WhatsAppContact';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ScrollToTop from "./components/ScrollToTop";

function App() {
  // Initialize theme from localStorage once on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('theme');
      const shouldUseDark = saved ? saved === 'dark' : false;
      const root = document.documentElement;
      if (shouldUseDark) root.classList.add('dark');
      else root.classList.remove('dark');
    } catch {
      // ignore
    }
  }, []);
  const isAdmin = IsAdmin();
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isComingSoonRoute = location.pathname === '/';

  return (
    <div className="min-h-screen bg-[#fafafa] text-gray-900 dark:bg-gray-900 dark:text-gray-100">

      <ScrollToTop />
      
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path='/*' element={<CustomerRouters />}></Route>
        <Route path='/admin/*' element={<AdminGuard><AdminRouters /></AdminGuard>} />
      </Routes>
      {!isAdminRoute && !isComingSoonRoute && <WhatsAppContact />}
    </div>
  );
}

export default App;
