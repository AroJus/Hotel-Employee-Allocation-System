import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function EmployeeLoginPage() {
  const [empname, setEmpname] = useState("");
  const [error, setError] = useState(null);
  const { employeeLogin, loading } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const success = await employeeLogin(empname);
    if (!success) setError("Employee not found");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <form onSubmit={handleSubmit} className="flex flex-col bg-white p-8 rounded shadow space-y-4">
        <h2 className="text-xl font-bold">Employee Login</h2>
        <input
          type="text"
          placeholder="Employee Name"
          value={empname}
          onChange={(e) => setEmpname(e.target.value)}
          className="border rounded p-2 w-64"
          required
        />
        {error && <div className="text-red-500">{error}</div>}
        <button type="submit" className="bg-yellow-600 text-white px-4 py-2 rounded" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}