import { Navigate } from 'react-router-dom';

// Legacy redirect — admin dashboard now lives at /admin/dashboard
export default function AdminDashboard() {
  return <Navigate to="/admin/dashboard" replace />;
}
