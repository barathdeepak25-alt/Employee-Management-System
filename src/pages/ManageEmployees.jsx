import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getEmployees, deleteEmployee } from "../services/employeeService";
import { getErrorMessage } from "../services/api";
import Loader from "../components/Loader";
import Message from "../components/Message";

export default function ManageEmployees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadEmployees = async () => {
    try {
      const { data } = await getEmployees();
      setEmployees(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const handleDelete = async (emp) => {
    // Confirmation before deleting
    if (!window.confirm(`Delete ${emp.name}? This cannot be undone.`)) return;
    setError("");
    setSuccess("");
    try {
      await deleteEmployee(emp._id);
      setSuccess("Employee deleted successfully");
      await loadEmployees(); // refresh the list
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  if (loading) return <Loader />;

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="m-0">Manage Employees</h3>
        <Link to="/employees/add" className="btn btn-success">+ Add Employee</Link>
      </div>
      <Message type="danger">{error}</Message>
      <Message type="success">{success}</Message>

      <div className="card shadow-sm">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>ID</th><th>Name</th><th>Email</th><th>Phone</th>
                <th>Role</th><th>Category</th><th>Salary</th><th>Joined</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.length === 0 && (
                <tr><td colSpan="9" className="text-center text-muted py-4">No employees found</td></tr>
              )}
              {employees.map((emp) => (
                <tr key={emp._id}>
                  <td>{emp._id.slice(-6).toUpperCase()}</td>
                  <td>{emp.name}</td>
                  <td>{emp.email}</td>
                  <td>{emp.phone}</td>
                  <td>{emp.role}</td>
                  <td>{emp.category?.name || "-"}</td>
                  <td>₹{emp.salary.toLocaleString()}</td>
                  <td>{new Date(emp.joiningDate).toLocaleDateString()}</td>
                  <td className="text-nowrap">
                    <Link to={`/employees/${emp._id}`} className="btn btn-md btn-info me-1"><i class="bi bi-eye"></i></Link>
                    <Link to={`/employees/edit/${emp._id}`} className="btn btn-md btn-warning me-1"><i class="bi bi-pencil-square"></i></Link>
                    <button className="btn btn-md btn-danger" onClick={() => handleDelete(emp)}><i class="bi bi-trash"></i></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
