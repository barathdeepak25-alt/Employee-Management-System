import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ManageEmployees from "./pages/ManageEmployees";
import AddEmployee from "./pages/AddEmployee";
import UpdateEmployee from "./pages/UpdateEmployee";
import EmployeeProfile from "./pages/EmployeeProfile";
import ManageCategories from "./pages/ManageCategories";
import Profile from "./pages/Profile";

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<Login />} />

      {/* Private: needs login */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/employees" element={<ManageEmployees />} />
        <Route path="/employees/add" element={<AddEmployee />} />
        <Route path="/employees/edit/:id" element={<UpdateEmployee />} />
        <Route path="/employees/:id" element={<EmployeeProfile />} />
        <Route path="/categories" element={<ManageCategories />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      {/* Anything else goes to the dashboard (redirects to login if needed) */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
