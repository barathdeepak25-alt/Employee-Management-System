import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import EmployeeForm from "../components/EmployeeForm";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { getEmployee, updateEmployee } from "../services/employeeService";
import { getErrorMessage } from "../services/api";

export default function UpdateEmployee() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Load the existing employee and convert it to what the form fields expect
  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await getEmployee(id);
        setInitialData({
          name: data.name,
          email: data.email,
          phone: data.phone,
          role: data.role,
          category: data.category?._id || "",
          salary: data.salary,
          gender: data.gender,
          address: data.address,
          joiningDate: data.joiningDate.slice(0, 10), // "2025-01-31T..." -> "2025-01-31"
        });
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleSubmit = async (data) => {
    setError("");
    try {
      setSubmitting(true);
      await updateEmployee(id, data);
      navigate("/employees"); // back to the list after success
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <>
      <h3 className="mb-3">Update Employee</h3>
      <Message type="danger">{error}</Message>
      {initialData && (
        <EmployeeForm
          initialData={initialData}
          onSubmit={handleSubmit}
          submitLabel="Update Employee"
          submitting={submitting}
        />
      )}
    </>
  );
}
