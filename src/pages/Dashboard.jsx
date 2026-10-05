import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getEmployees } from "../services/employeeService";
import { getCategories } from "../services/categoryService";
import { getErrorMessage } from "../services/api";
import Loader from "../components/Loader";
import Message from "../components/Message";

export default function Dashboard() {
  const [counts, setCounts] = useState({ employees: 0, categories: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        // Run both requests at the same time
        const [emp, cat] = await Promise.all([getEmployees(), getCategories()]);
        setCounts({ employees: emp.data.length, categories: cat.data.length });
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <Loader />;

  return (
    <>
      <h3 className="mb-1 text-black">Welcome back, Admin! 👋</h3>
      <p className="text-black">Here is an overview of your organisation.</p>
      <Message type="danger">{error}</Message>

      <div className="row g-3 mb-4">
        <div className="col-12 col-md-6">
          <div className="card card shadow-sm">
            <div className="card-body">
              <div className="fw-bold">Total Employees</div>
              <h2>{counts.employees}</h2>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-6">
          <div className="card card shadow-sm">
            <div className="card-body">
              <div className="fw-bold">Total Categories</div>
              <h2>{counts.categories}</h2>
            </div>
          </div>
        </div>
      </div>

      <h5 className="text-black">Quick Actions</h5>
      <div className="d-flex flex-wrap gap-2">
        <Link to="/employees/add" className="btn btn-outline-success"><i class="bi bi-person-fill-add"></i></Link>
        <Link to="/employees" className="btn btn-outline-info"><i class="bi bi-people"></i></Link>
        <Link to="/categories" className="btn btn-outline-info"><i class="bi bi-diagram-3"></i></Link>
        <Link to="/profile" className="btn btn-secondary"><i class="bi bi-person-bounding-box"></i></Link>
      </div>
    </>
  );
}
