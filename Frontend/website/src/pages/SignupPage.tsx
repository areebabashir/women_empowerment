import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import { apiCall } from "../api/apiCall";
import toast from "react-hot-toast";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "member",
    phone: "",
    address: ""

  });
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    documents: "",
    general: [],
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: "",
        general: prev.general.filter(err => !err.includes(name))
      }));
    }
  };

  const handleDocumentChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      const validDocumentTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      
      const invalidFiles = files.filter(file => !validDocumentTypes.includes(file.type));
      if (invalidFiles.length > 0) {
        setErrors(prev => ({
          ...prev,
          documents: "Documents must be PDF, DOC, or DOCX format"
        }));
        return;
      }
      
      const oversizedFiles = files.filter(file => file.size > 10 * 1024 * 1024);
      if (oversizedFiles.length > 0) {
        setErrors(prev => ({
          ...prev,
          documents: "Each document must be less than 10MB"
        }));
        return;
      }
      
      if (files.length > 10) {
        setErrors(prev => ({
          ...prev,
          documents: "Maximum 10 documents allowed"
        }));
        return;
      }
      
      setDocuments(files);
      setErrors(prev => ({
        ...prev,
        documents: ""
      }));
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      name: "",
      email: "",
      password: "",
      phone: "",
      documents: "",
      general: []
    };

    // Name validation
    const nameRegex = /^[A-Za-z\s]+$/;
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    } else if (!nameRegex.test(formData.name)) {
      newErrors.name = "Name must contain only letters and spaces";
      isValid = false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = "Invalid email format";
      isValid = false;
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
      isValid = false;
    }

    // Phone validation (optional)
    const phoneRegex = /^\+\d{10,15}$/;
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      newErrors.phone = "Phone must start with + and contain 10-15 digits";
      isValid = false;
    }

    // Company validation (required for company role)
    // if (formData.role === 'company' && !formData.company.trim()) {
    //   newErrors.company = "Company name is required";
    //   isValid = false;
    // }

    // // NGO validation (required for NGO role)
    // if (formData.role === 'ngo' && !formData.ngo.trim()) {
    //   newErrors.ngo = "NGO name is required";
    //   isValid = false;
    // }

    // Documents validation (required for NGO role)
    // Temporarily disabled for testing
    // if (formData.role === 'ngo' && documents.length === 0) {
    //   newErrors.documents = "Documents are required for NGO registration";
    //   isValid = false;
    // }
    if (formData.role === 'ngo') {
      if (documents.length === 0) {
        newErrors.documents = "Documents are required for NGO registration";
        isValid = false;
      }
    }


    setErrors(newErrors);
    return isValid;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      // Send as JSON data instead of FormData for testing
      const userData = {
        name: formData.name,
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        role: formData.role,
        phone: formData.phone,
        address: formData.address,
      };

      console.log('User data being sent:', userData);

      const response = await apiCall({
        url: `${API_BASE_URL}/users/register`,
        method: "POST",
        data: userData,
        requiresAuth: false,
      });

      if (response.success) {
        // Show success toast
        toast.success("Registration Successful! Account created successfully. Please log in.");
        
        navigate("/login");
      } else {
        const errorMessage = response.data.msg || "Registration failed";
        setErrors(prev => ({
          ...prev,
          general: [errorMessage]
        }));
        
        // Show error toast
        toast.error(`Registration Failed - ${errorMessage}`);
      }
    } catch (err) {
      const errorMessage = err.message || "Network error occurred";
      setErrors(prev => ({
        ...prev,
        general: [errorMessage]
      }));
      
      // Show error toast
      toast.error(`Network Error - ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="h-[70px]"></div>
      <div className="min-h-screen flex items-center justify-center bg-section-soft py-8 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold text-center text-primary mb-6">Create Account</h2>

          {errors.general.length > 0 && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {errors.general.map((error, index) => (
                <p key={index}>{error}</p>
              ))}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <Input 
                type="text" 
                name="name"
                placeholder=" Name *" 
                value={formData.name} 
                onChange={handleChange}
                disabled={loading} 
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            <div>
              <Input 
                type="email" 
                name="email"
                placeholder="Email *" 
                value={formData.email} 
                onChange={handleChange}
                disabled={loading} 
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            <div>
              <Input 
                type="password" 
                name="password"
                placeholder="Password *" 
                value={formData.password} 
                onChange={handleChange}
                disabled={loading} 
              />
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </div>

            <div>
              <Input 
                type="tel" 
                name="phone"
                placeholder="Phone Number (e.g., +923001234567)" 
                value={formData.phone} 
                onChange={handleChange}
                disabled={loading} 
              />
              {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
            </div>

            <div>
              <Input 
                type="text" 
                name="address"
                placeholder="Address" 
                value={formData.address} 
                onChange={handleChange}
                disabled={loading} 
              />
            </div>

            <select 
              value={formData.role} 
              onChange={(e) => setFormData(prev => ({...prev, role: e.target.value}))} 
              disabled={loading} 
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-soft-purple"
            >
              <option value="member">As a Member</option>
              <option value="donor">As a Donor</option>
              <option value="trainee">As a Trainee</option>
              <option value="company">As a Company</option>
              <option value="ngo">As an NGO</option>
            </select>

            {/* Company field - shown only when company role is selected */}
            {/* {formData.role === 'company' && (
              <div>
                <Input 
                  type="text" 
                  name="company"
                  placeholder="Company Name *" 
                  value={formData.company} 
                  onChange={handleChange}
                  disabled={loading} 
                />
                {errors.company && <p className="mt-1 text-sm text-red-600">{errors.company}</p>}
              </div>
            )} */}

            {/* NGO field - shown only when NGO role is selected */}
            {/* {formData.role === 'ngo' && (
              <div>
                <Input 
                  type="text" 
                  name="ngo"
                  placeholder="NGO Name *" 
                  value={formData.ngo} 
                  onChange={handleChange}
                  disabled={loading} 
                />
                {errors.ngo && <p className="mt-1 text-sm text-red-600">{errors.ngo}</p>}
              </div>
            )} */}

            {/* Document upload - shown only when NGO role is selected */}
            {formData.role === 'ngo' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  NGO Documents * (PDF, DOC, DOCX - Max 10 files, 10MB each)
                </label>
                <input 
                  type="file" 
                  accept=".pdf,.doc,.docx" 
                  multiple
                  onChange={handleDocumentChange} 
                  disabled={loading} 
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-soft-purple" 
                />
                {documents.length > 0 && (
                  <p className="mt-1 text-sm text-green-600">
                    {documents.length} document(s) selected
                  </p>
                )}
                {errors.documents && <p className="mt-1 text-sm text-red-600">{errors.documents}</p>}
              </div>
            )}

            <Button type="submit" className="w-full bg-primary text-white" disabled={loading}>
              {loading ? "Creating Account..." : "Sign Up"}
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            Already have an account? <button className="text-primary hover:underline" onClick={() => navigate("/login")}>Login here</button>
          </p>
        </div>
      </div>
    </>
  );
};

export default SignUpPage;