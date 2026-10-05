import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getErrorMessage } from "../services/api";
import Message from "../components/Message";

export default function Login() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  // Already logged in? Skip the login page
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const errs = {};
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = "Enter a valid email";
    if (!form.password) errs.password = "Password is required";
    else if (form.password.length < 6) errs.password = "Password must be at least 6 characters";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return; // stop if invalid

    try {
      setLoading(true);
      await login(form.email, form.password);
      navigate("/dashboard");
    } catch (error) {
      setServerError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login d-flex align-items-center justify-content-center min-vh-100 p-3">
      <div className="card shadow-sm" style={{ width: 400, maxWidth: "100%" }}>
        <div className="card-body p-4 div">
          <h4 className="text-center mb-4"> Login</h4>
          <Message type="danger">{serverError}</Message>

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email" name="email" value={form.email} onChange={handleChange}
                className={`form-control ${errors.email ? "is-invalid" : ""}`}
              />
              <div className="invalid-feedback">{errors.email}</div>
            </div>

            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password" name="password" value={form.password} onChange={handleChange}
                className={`form-control ${errors.password ? "is-invalid" : ""}`}
              />
              <div className="invalid-feedback">{errors.password}</div>
            </div>

            <button className="btn btn-success w-100" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
           
            <p className="mt-2"> <input type="checkbox" /> You are terms & condition</p>
          </form>
        </div>
      </div>
    </div>
  );
}
