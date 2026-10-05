import { useEffect, useState } from "react";
import { getCategories } from "../services/categoryService";
import Message from "./Message";

const emptyForm = {
  name: "", email: "", phone: "", role: "",
  category: "", salary: "", gender: "", address: "", joiningDate: "",
};

// Reusable form for both Add and Update
export default function EmployeeForm({ initialData, onSubmit, submitLabel, submitting }) {
  const [form, setForm] = useState(initialData || emptyForm);
  const [errors, setErrors] = useState({});
  const [categories, setCategories] = useState([]);
  const [catError, setCatError] = useState("");

  // Load categories for the dropdown
  useEffect(() => {
    getCategories()
      .then((res) => setCategories(res.data))
      .catch(() => setCatError("Could not load categories"));
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Returns an object of error messages (empty = valid)
  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    else if (form.name.trim().length < 2) e.name = "Name must be at least 2 characters";

    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email";

    if (!form.phone.trim()) e.phone = "Phone number is required";
    else if (!/^\d{10}$/.test(form.phone)) e.phone = "Phone must be exactly 10 digits";

    if (!form.role.trim()) e.role = "Role is required";
    if (!form.category) e.category = "Select a category";

    if (form.salary === "") e.salary = "Salary is required";
    else if (isNaN(form.salary) || Number(form.salary) < 0) e.salary = "Salary must be a positive number";

    if (!form.gender) e.gender = "Select a gender";
    if (!form.address.trim()) e.address = "Address is required";
    if (!form.joiningDate) e.joiningDate = "Joining date is required";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;
    onSubmit({ ...form, salary: Number(form.salary) }); // send salary as a number
  };

  const cls = (field) => `form-control ${errors[field] ? "is-invalid" : ""}`;
  const selCls = (field) => `form-select ${errors[field] ? "is-invalid" : ""}`;

  return (
    <div className="emp">
    <form onSubmit={handleSubmit} noValidate className="card shadow-sm">
      <div className=" emp card-body ">
        <Message type="warning">{catError}</Message>
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Name</label>
            <input name="name" value={form.name} onChange={handleChange} className={cls("name")} />
            <div className="invalid-feedback">{errors.name}</div>
          </div>
          <div className="col-md-6">
            <label className="form-label">Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} className={cls("email")} />
            <div className="invalid-feedback">{errors.email}</div>
          </div>
          <div className="col-md-6">
            <label className="form-label">Phone</label>
            <input name="phone" value={form.phone} onChange={handleChange} maxLength={10} className={cls("phone")} />
            <div className="invalid-feedback">{errors.phone}</div>
          </div>
          <div className="col-md-6">
            <label className="form-label">Role</label>
            <input name="role" value={form.role} onChange={handleChange} className={cls("role")} />
            <div className="invalid-feedback">{errors.role}</div>
          </div>
          <div className="col-md-6">
            <label className="form-label">Category</label>
            <select name="category" value={form.category} onChange={handleChange} className={selCls("category")}>
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
            <div className="invalid-feedback">{errors.category}</div>
          </div>
          <div className="col-md-6">
            <label className="form-label">Salary</label>
            <input type="number" name="salary" value={form.salary} onChange={handleChange} className={cls("salary")} />
            <div className="invalid-feedback">{errors.salary}</div>
          </div>
          <div className="col-md-6">
            <label className="form-label">Gender</label>
            <select name="gender" value={form.gender} onChange={handleChange} className={selCls("gender")}>
              <option value="">Select gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
            <div className="invalid-feedback">{errors.gender}</div>
          </div>
          <div className="col-md-6">
            <label className="form-label">Joining Date</label>
            <input type="date" name="joiningDate" value={form.joiningDate} onChange={handleChange} className={cls("joiningDate")} />
            <div className="invalid-feedback">{errors.joiningDate}</div>
          </div>
          <div className="col-12">
            <label className="form-label">Address</label>
            <textarea name="address" rows={3} value={form.address} onChange={handleChange} className={cls("address")} />
            <div className="invalid-feedback">{errors.address}</div>
          </div>
        </div>
        <button className="btn btn-primary mt-4" disabled={submitting}>
          {submitting ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
    </div>
  );
}
