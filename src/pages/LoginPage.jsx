import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { XCircle, Loader2, LogIn, Lock, User2 } from "lucide-react"; // Import Lucide icons

export default function LoginPage() {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const { login, error } = useAuth();
  const navigate = useNavigate();
  const [localError, setLocalError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    setLocalError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const success = await login(credentials);
      if (success) {
        navigate("/dashboard");
        toast.success("Login Success");
      } else {
        setLocalError("Invalid username or password");
      }
    } catch (err) {
      setLocalError("An error occurred during login");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="w-full min-h-screen bg-cover bg-center bg-no-repeat flex flex-col"
      style={{ backgroundImage: "url('/src/images/bg.jpg')" }}
    >
      {/* Centered content area */}
      <div className="flex flex-1 justify-center items-center p-4 shadow-2xl">
        <form
          className="bg-white bg-opacity-90 p-8 rounded-xl shadow-2xl space-y-6 w-full max-w-md"
          onSubmit={handleSubmit}
        >
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-600">
              Please enter your credentials to login
            </p>
          </div>

          {(error || localError) && (
            <div className="bg-red-50 text-red-700 p-3 rounded-lg border border-red-200 flex items-center">
              <XCircle className="h-5 w-5 mr-2" /> {/* Replaced SVG with XCircle */}
              <span className="text-sm">{error || localError}</span>
            </div>
          )}

          <div className="space-y-4">
            <div className="flex flex-col space-y-2">
              <label
                htmlFor="username"
                className="flex items-center gap-1 text-sm font-medium text-gray-700"
              >
                <User2 className="w-4 h-4"/>
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                onChange={handleChange}
                className="border border-gray-300 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 rounded-lg p-3 transition duration-200"
                placeholder="Enter your username"
                required
              />
            </div>

            <div className="flex flex-col space-y-2">
              <label
                htmlFor="password"
                className="flex items-center gap-1 text-sm font-medium text-gray-700"
              >
                <Lock className="w-4 h-4"/>
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                onChange={handleChange}
                className="border border-gray-300 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 rounded-lg p-3 transition duration-200"
                placeholder="Enter your password"
                required
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full  bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200 flex justify-center items-center gap-1"
              disabled={isSubmitting}
            >
              <LogIn className="w-5 h-5"/>
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" /> {/* Replaced SVG with Loader2 */}
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}