import { useEffect, useState } from "react";
import {
  getCategories, createCategory, updateCategory, deleteCategory,
} from "../services/categoryService";
import { getErrorMessage } from "../services/api";
import Loader from "../components/Loader";
import Message from "../components/Message";

export default function ManageCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState(""); // new category input
  const [editId, setEditId] = useState(null); // row being edited
  const [editName, setEditName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const load = async () => {
    try {
      const { data } = await getCategories();
      setCategories(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  // Shared name check for add and update
  const validName = (value) => {
    if (!value.trim()) { setError("Category name is required"); return false; }
    if (value.trim().length < 2) { setError("Category name must be at least 2 characters"); return false; }
    return true;
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    clearMessages();
    if (!validName(name)) return;
    try {
      await createCategory(name.trim());
      setName("");
      setSuccess("Category added");
      load();
    } catch (err) {
      setError(getErrorMessage(err)); // e.g. "Category already exists"
    }
  };

  const handleUpdate = async (id) => {
    clearMessages();
    if (!validName(editName)) return;
    try {
      await updateCategory(id, editName.trim());
      setEditId(null);
      setSuccess("Category updated");
      load();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleDelete = async (cat) => {
    if (!window.confirm(`Delete category "${cat.name}"?`)) return;
    clearMessages();
    try {
      await deleteCategory(cat._id);
      setSuccess("Category deleted");
      load();
    } catch (err) {
      setError(getErrorMessage(err)); // e.g. "employees use this category"
    }
  };

  if (loading) return <Loader />;

  return (
    <>
      <h3 className="mb-3">Manage Categories</h3>
      <Message type="danger">{error}</Message>
      <Message type="success">{success}</Message>

      <form onSubmit={handleAdd} className="input-group mb-4" style={{ maxWidth: 500 }}>
        <input
          className="form-control" placeholder="New category name"
          value={name} onChange={(e) => setName(e.target.value)}
        />
        <button className="btn btn-primary">Add</button>
      </form>

      <div className="card shadow-sm">
        <div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead className="table-light">
              <tr><th style={{width:40}}>S.NO</th><th style={{width:220}}>Name</th><th style={{ width: 20 }}>Actions</th></tr>
            </thead>
            <tbody>
              {categories.length === 0 && (
                <tr><td colSpan="3" className="text-center text-muted py-4">No categories yet</td></tr>
              )}
              {categories.map((cat, i) => (
                <tr key={cat._id}>
                  <td>{i + 1}</td>
                  <td>
                    {editId === cat._id ? (
                      <input
                        className="form-control form-control-sm"
                        value={editName} onChange={(e) => setEditName(e.target.value)}
                      />
                    ) : (
                      cat.name
                    )}
                  </td>
                  <td className="text-nowrap">
                    {editId === cat._id ? (
                      <>
                        <button className="btn btn-sm btn-success me-1" onClick={() => handleUpdate(cat._id)}>Save</button>
                        <button className="btn btn-sm btn-secondary" onClick={() => setEditId(null)}>Cancel</button>
                      </>
                    ) : (
                      <>
                        <button
                          className="btn btn-sm btn-warning me-1"
                          onClick={() => { setEditId(cat._id); setEditName(cat.name); clearMessages(); }}
                        >
                          <i class="bi bi-pencil-square"/>
                        </button>
                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(cat)}><i class="bi bi-trash"/></button>
                      </>
                    )}
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
