import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <h3 className="mb-3">My Profile</h3>
      <div className="card shadow-sm" style={{ maxWidth: 500 }}>
        <div className="card-body">
          <p className="mb-1 text-muted">Logged in as</p>
          <h5>{user?.email}</h5>
          <p className="text-muted">Role: Administrator</p>
          <button className="btn btn-danger" onClick={handleLogout}><i class="bi bi-box-arrow-left"></i></button>
        </div>
      </div>
    </>
  );
}
