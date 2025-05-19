import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AuthProvider, { useAuth } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import EmployeePage from "./pages/EmployeePage";
import TaskPage from "./pages/TaskPage";
import SchedulePage from "./pages/SchedulePage";
import NotificationPage from "./pages/NotificationPage";
import UserPage from "./pages/UserPage";
import EmployeeLoginPage from "./pages/employee/EmployeeLoginPage";
import EmployeeDashboardPage from "./pages/employee/EmployeeDashboardPage";
import EmployeeTaskPage from "./pages/employee/EmployeeTask";
import EmployeeSchedulePage from "./pages/employee/EmployeeSchedule";
import EmployeeNotificationPage from "./pages/employee/EmployeeNotification";
import { ToastContainer } from "react-toastify";

const PrivateRoute = ({ element }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  return user ? element : <Navigate to="/" replace />;
};

const EmployeePrivateRoute = ({ element }) => {
  const { employee } = useAuth();
  return employee ? element : <Navigate to="/employee-login" replace />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastContainer position="top-center" autoClose={1500} />
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/dashboard" element={<PrivateRoute element={<DashboardPage />} />} />
          <Route path="/employee" element={<PrivateRoute element={<EmployeePage />} />} />
          <Route path="/task" element={<PrivateRoute element={<TaskPage />} />} />
          <Route path="/schedule" element={<PrivateRoute element={<SchedulePage />} />} />
          <Route path="/notification" element={<PrivateRoute element={<NotificationPage />} />} />
          <Route path="/user" element={<PrivateRoute element={<UserPage />} />} />

          {/* Employee routes */}
          <Route path="/employee-login" element={<EmployeeLoginPage />} />
          <Route path="/employee-dashboard" element={<EmployeePrivateRoute element={<EmployeeDashboardPage />} />} />
          <Route path="/employee-task" element={<EmployeePrivateRoute element={<EmployeeTaskPage />} />} />
          <Route path="/employee-schedule" element={<EmployeePrivateRoute element={<EmployeeSchedulePage />} />} />
          <Route path="/employee-notification" element={<EmployeePrivateRoute element={<EmployeeNotificationPage />} />} />



        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;