import EmployeeDashboard from "../../components/EmployeeDashboard";
import EmployeeLayout from "../../components/EmployeeLayout";
import { useAuth } from "../../context/AuthContext";

export default function EmployeeDashboardPage() {

  return (
    <EmployeeLayout>
        <EmployeeDashboard />
    </EmployeeLayout>
  );
}
