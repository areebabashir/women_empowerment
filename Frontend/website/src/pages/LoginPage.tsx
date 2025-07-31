// src/pages/LoginPage.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { apiCall } from "../api/apiCall";
import { isAuthenticated } from "../utils/auth";
import { ApiErrorResponse } from "../types";
import toast from "react-hot-toast";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

interface LoginResponse {
  token: string;
  role: string;
  msg: string;
  isApproved?: boolean;
  approvalStatus?: string;
  rejectionReason?: string;
}

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  // Check if user is already authenticated
  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/UserDashboard");
    }
  }, [navigate]);
  useEffect(() => {
    scrollTo(0,0)
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous messages
    setError(null);
    setSuccess(null);
    
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        email: email.trim().toLowerCase(),
        password: password
      };

      const response = await apiCall<LoginResponse>({
        url: `${API_BASE_URL}/users/login`,
        method: 'POST',
        data: payload
      });

      if (response.success) {
        // Check if user needs approval (for companies and NGOs)
        if (response.data.role === 'company' || response.data.role === 'ngo') {
          if (!response.data.isApproved) {
            if (response.data.approvalStatus === 'pending') {
              setError('Your account is pending approval. Please wait for admin approval.');
              toast.error('Account pending approval. Please wait for admin approval.');
              return;
            } else if (response.data.approvalStatus === 'rejected') {
              const rejectionMsg = response.data.rejectionReason 
                ? `Your account has been rejected. Reason: ${response.data.rejectionReason}`
                : 'Your account has been rejected.';
              setError(rejectionMsg);
              toast.error('Account rejected. Please contact admin for more information.');
              return;
            }
          }
        }

        // Store authentication data
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('userRole', response.data.role);
        
        setSuccess(response.data.msg || 'Login successful!');
        
        // Show success toast
        toast.success(response.data.msg || 'Login Successful! Welcome back!');
        
        // Clear form
        setEmail("");
        setPassword("");
        
        // Navigate to dashboard after short delay
        setTimeout(() => {
          navigate('/UserDashboard');
        }, 1500);

      } else {
        const errorData = response.data as ApiErrorResponse;
        const errorMessage = errorData?.msg || 'Login failed. Please try again.';
        setError(errorMessage);
        
        // Show error toast
        toast.error(`Login Failed - ${errorMessage}`);
      }
    } catch (err: any) {
      console.error("Login error:", err);
      const errorMessage = 'Network error. Please check your connection and try again.';
      setError(errorMessage);
      
      // Show error toast
      toast.error(`Network Error - ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen flex items-center justify-center bg-section-soft ">
        <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold text-center text-primary mb-6">Login</h2>
          
          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}
          
          {/* Success Message */}
          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
{/* 
            <div className="text-right text-sm">
              <button
                type="button"
                className="text-soft-purple hover:underline"
                onClick={() => navigate("/forgot-password")}
                disabled={isLoading}
              >
                Forgot Password?
              </button>
            </div> */}

            <Button 
              type="submit" 
              className="w-full bg-primary text-white"
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <button
              className="text-primary hover:underline"
              onClick={() => navigate("/signup")}
              disabled={isLoading}
            >
              Sign up here
            </button>
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default LoginPage;