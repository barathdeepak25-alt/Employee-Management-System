import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getEmployee } from "../services/employeeService";
import { getErrorMessage } from "../services/api";
import Loader from "../components/Loader";
import Message from "../components/Message";

export default function EmployeeProfile() {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getEmployee(id)
      .then((res) => setEmployee(res.data))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader />;
  if (error) return <Message type="danger">{error}</Message>;

  const rows = [
    ["Name", employee.name],
    ["Email", employee.email],
    ["Phone", employee.phone],
    ["Role", employee.role],
    ["Category", employee.category?.name || "-"],
    ["Salary", `₹${employee.salary.toLocaleString()}`],
    ["Gender", employee.gender],
    ["Address", employee.address],
    ["Joining Date", new Date(employee.joiningDate).toLocaleDateString()],
  ];

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="m-0">Employee Profile</h3>
        <div>
          <Link to="/employees" className="btn btn-outline-secondary me-2"><i class="bi bi-arrow-90deg-left"></i></Link>
          <Link to={`/employees/edit/${employee._id}`} className="btn btn-warning"><i class="bi bi-pencil-square"/></Link>
        </div>
      </div>
      <div className="card shadow-sm">
        <ul className="list-group list-group-flush">
          {rows.map(([label, value]) => (
            <li key={label} className="list-group-item d-flex flex-column flex-sm-row">
              <strong style={{ width: 160 }}>{label}</strong>
              <span>{value}</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
