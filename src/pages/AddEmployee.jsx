import { useState } from "react";
import { useNavigate } from "react-router-dom";
import EmployeeForm from "../components/EmployeeForm";
import Message from "../components/Message";
import { createEmployee } from "../services/employeeService";
import { getErrorMessage } from "../services/api";

export default function AddEmployee() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (data) => {
    setError("");
    try {
      setSubmitting(true);
      await createEmployee(data);
      setSuccess("Employee added successfully! Redirecting...");
      setTimeout(() => navigate("/employees"), 1000);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
    
    <div className="">
      <h3 className="mb-3">Add Employee</h3>
      <Message type="danger">{error}</Message>
      <Message type="success">{success}</Message>
      <EmployeeForm onSubmit={handleSubmit} submitLabel="Add Employee" submitting={submitting} />
      </div>
    </>
  );
}
