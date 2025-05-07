import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./components/Auth/ProtectedRoute";
import AdminLayout from "./components/Layouts/AdminLayout";
import Accounts from "./components/Admin/Accounts";
import Loans from "./components/Admin/Loans";
import Transactions from "./components/Admin/Transactions";
import Branches from "./components/Admin/Branches";
import Employees from "./components/Admin/Employees";
import Customers from "./components/Admin/Customers";
import AdminDashboard from "./components/Admin/AdminDashboard";
import Login from "./pages/Auth/Login";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Admin Routes */}
        <Route
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/accounts" element={<Accounts />} />
          <Route path="/admin/transactions" element={<Transactions />} />
          <Route path="/admin/branches" element={<Branches />} /> 
          <Route path="/admin/loans" element={<Loans />} />
          <Route path="/admin/employees" element={<Employees />} />
          <Route path="/admin/customers" element={<Customers />} />
          <Route
            path="/admin/*"
            element={<Navigate to="/admin/dashboard" replace />}
          />
        </Route>

        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
