import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Biographies from './pages/Biographies';
import Biography from './pages/Biography';
import Merch from './pages/Merch';
import About from './pages/About';
import Login from './pages/Login';
import AuthCallback from './pages/AuthCallback';
import Account from './pages/Account';
import AdminLogin from './pages/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import DashboardOverview from './pages/admin/DashboardOverview';
import UploadVideo from './pages/admin/UploadVideo';
import ManageVideos from './pages/admin/ManageVideos';
import Subscribers from './pages/admin/Subscribers';
import AdminSettings from './pages/admin/AdminSettings';

export default function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen flex flex-col bg-dark">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/biographies" element={<Biographies />} />
                <Route path="/biography/:id" element={<Biography />} />
                <Route path="/merch" element={<Merch />} />
                <Route path="/about" element={<About />} />
                <Route path="/login" element={<Login />} />
                <Route path="/auth/callback" element={<AuthCallback />} />
                <Route
                  path="/account"
                  element={
                    <ProtectedRoute>
                      <Account />
                    </ProtectedRoute>
                  }
                />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute requireAdmin>
                      <AdminLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route path="dashboard" element={<DashboardOverview />} />
                  <Route path="upload" element={<UploadVideo />} />
                  <Route path="videos" element={<ManageVideos />} />
                  <Route path="subscribers" element={<Subscribers />} />
                  <Route path="settings" element={<AdminSettings />} />
                </Route>
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </HelmetProvider>
  );
}
