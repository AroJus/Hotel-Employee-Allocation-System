import { useState, createContext, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { API_URL } from '../api/api_url';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [employee, setEmployee] = useState(() => {
    // Restore employee from localStorage if present
    const stored = localStorage.getItem("employee");
    return stored ? JSON.parse(stored) : null;
  });
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Axios interceptor for token refresh (admin/user)
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (
          error.response?.status === 401 &&
          error.response?.data?.code === 'token_not_valid' &&
          !originalRequest._retry
        ) {
          originalRequest._retry = true;
          try {
            const response = await axios.post(
              `${API_URL}user/refresh/`,
              { refresh: refreshToken }
            );
            const newAccessToken = response.data.access;
            setAccessToken(newAccessToken);
            originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
            return axios(originalRequest);
          } catch (refreshError) {
            setUser(null);
            setAccessToken(null);
            setRefreshToken(null);
            setError('Session expired. Please log in again.');
            navigate('/');
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      }
    );
    return () => axios.interceptors.response.eject(interceptor);
  }, [refreshToken, navigate]);

  // Check for existing session on initial load (admin/user)
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Restore employee from localStorage on mount
  useEffect(() => {
    const storedEmployee = localStorage.getItem("employee");
    if (storedEmployee) {
      setEmployee(JSON.parse(storedEmployee));
    }
  }, []);

  // Keep employee in localStorage in sync
  useEffect(() => {
    if (employee) {
      localStorage.setItem("employee", JSON.stringify(employee));
    } else {
      localStorage.removeItem("employee");
    }
  }, [employee]);

  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}user/`, {
        withCredentials: true,
      });
      const userData = Array.isArray(response.data) ? response.data[0] : response.data;
      if (userData && Object.keys(userData).length > 0) {
        setUser(userData);
      } else {
        setUser(null);
      }
    } catch (err) {
      setUser(null);
      setError(err.response?.data?.message || 'Failed to verify session');
    } finally {
      setLoading(false);
    }
  };

  // Admin/User login
  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_URL}user/login/`, credentials, {
        withCredentials: true,
      });
      const { user, access, refresh } = response.data;
      setUser(user);
      setAccessToken(access);
      setRefreshToken(refresh);
      navigate('/dashboard', { replace: true });
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await axios.post(`${API_URL}user/logout/`, {}, {
        withCredentials: true,
      });
      setUser(null);
      setAccessToken(null);
      setRefreshToken(null);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Logout failed');
    } finally {
      setLoading(false);
    }
  };

  // Employee login
  const employeeLogin = async (empname) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_URL}employee/`);
      const found = res.data.find(emp => emp.empname === empname);
      if (found) {
        setEmployee(found);
        localStorage.setItem("employee", JSON.stringify(found));
        navigate("/employee-dashboard", { replace: true });
        toast.success("Login Successfully")
        return true;
      } else {
        setError("Employee not found");
        return false;
      }
    } catch (e) {
      setError("Employee login failed");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const employeeLogout = () => {
    setEmployee(null);
    localStorage.removeItem("employee");
    navigate("/employee-login", { replace: true });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        employee,
        setEmployee,
        error,
        loading,
        login,
        logout,
        employeeLogin,
        employeeLogout,
        checkAuthStatus,
        accessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);