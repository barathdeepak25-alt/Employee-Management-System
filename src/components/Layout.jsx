import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const links = [
  { to: "/dashboard", label: "Dashboard",icon:"bi bi-speedometer 2"},
  { to: "/employees", label: "Manage Employees",icon:"bi bi-people" },
  { to: "/employees/add", label: "Add Employee",icon:"bi bi-person-fill-add" },
  { to: "/categories", label: "Categories",icon:"bi bi-diagram-3" },
  { to: "/profile", label: "Profile",icon:"bi bi-person-bounding-box" },
];

export default function Layout() {
  const [open, setOpen] = useState(false); // sidebar open on mobile
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="app-shell">
      <aside className={`sidebar ${open ? "open" : ""}`}>
        <h5 className="text-white px-3 py-3 m-0">EMS Admin</h5>
        <nav className="nav flex-column">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end className="nav-link" onClick={() => setOpen(false)}>
              <i className={l.icon}></i>
              <span>{l.label}</span>
            </NavLink>
          ))}
        </nav>
        <button className="btn btn-outline-light m-1 " onClick={handleLogout}>
          <i class="bi bi-box-arrow-left"></i>
        </button>
      </aside>

      <div className="main-area shadow-2">
        <header className="topbar">
          <button className="btn btn-outline-secondary d-md-none" onClick={() => setOpen(!open)}>
            ☰
          </button>
          <h3 className="p-2 d-flex justify-content-center text-center ">Employee Management System</h3>
          <span className="ms-auto text-muted small">{user?.email}</span>
        </header>
        <main className="p-3 p-md-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
