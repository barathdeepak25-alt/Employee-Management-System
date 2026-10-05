// type: "success" | "danger" | "warning" | "info"
export default function Message({ type = "danger", children }) {
  if (!children) return null;
  return <div className={`alert alert-${type}`}>{children}</div>;
}
