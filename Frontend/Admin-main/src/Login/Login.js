import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post("http://localhost:8000/api/users/login", {
        email,
        password,
      });

      // Debug: log the full response data
      console.log('Login response data:', response.data);

      // Check if response contains required data
      if (!response.data || !response.data.token) {
        throw new Error("Invalid response from server");
      }

      // Prepare user data safely
      const userData = {
        email: response.data.email || email, // Fallback to form email if not in response
        role: response.data.role || 'member', // Default role if not provided
        ...(response.data.user || {}) // Spread any additional user data if exists
      };

      // Only allow admin role
      if (userData.role !== 'admin') {
        setError('Access denied: Only admin can log in.');
        setIsLoading(false);
        return;
      }

      // Store the token and user data in localStorage
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('userData', JSON.stringify(userData));

      // Redirect to home page
      navigate('/');

      console.log("Login successful:", response.data);
    } catch (error) {
      console.error("Login error:", error);
      
      let errorMessage = "Login failed. Please check your credentials and try again.";
      
      if (error.response) {
        // Server responded with error status
        errorMessage = error.response.data.message || 
                      error.response.data.error || 
                      errorMessage;
      } else if (error.request) {
        // Request was made but no response received
        errorMessage = "No response from server. Please try again later.";
      } else if (error.message) {
        // Something happened in setting up the request
        errorMessage = error.message;
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded shadow-md" style={{ marginTop: "-50px" }}>
        <h2 className="text-2xl font-semibold mb-4">Login</h2>

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="email" className="block font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              className="mt-1 p-2 border rounded w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              className="mt-1 p-2 border rounded w-full"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="text-red-500 mb-4">{error}</p>}

          <div className="text-center">
            <button 
              className={`w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Sign In'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;