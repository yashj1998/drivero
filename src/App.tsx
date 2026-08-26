import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { HomePage } from '@/pages/HomePage';
import { FleetPage } from '@/pages/FleetPage';
import { CarDetailPage } from '@/pages/CarDetailPage';
import { AboutPage } from '@/pages/AboutPage';
import { ContactPage } from '@/pages/ContactPage';

// Admin imports
import { AdminAuthProvider } from '@/context/AdminAuthContext';
import { AdminLoginPage } from '@/pages/admin/AdminLoginPage';
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage';
import { AdminBookingsPage } from '@/pages/admin/AdminBookingsPage';
import { AdminCustomersPage } from '@/pages/admin/AdminCustomersPage';
import { AdminFleetPage } from '@/pages/admin/AdminFleetPage';
import { AdminAnalyticsPage } from '@/pages/admin/AdminAnalyticsPage';

function PublicLayoutWrapper() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AdminAuthProvider>
        <Routes>
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/bookings" element={<AdminBookingsPage />} />
          <Route path="/admin/customers" element={<AdminCustomersPage />} />
          <Route path="/admin/fleet" element={<AdminFleetPage />} />
          <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />

          {/* Public Storefront Routes */}
          <Route element={<PublicLayoutWrapper />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/fleet" element={<FleetPage />} />
            <Route path="/fleet/:slug" element={<CarDetailPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="*" element={<HomePage />} />
          </Route>
        </Routes>
      </AdminAuthProvider>
    </BrowserRouter>
  );
}

export default App;
