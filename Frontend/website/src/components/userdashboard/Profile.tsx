import React, { useState } from "react";
import { Mail, Phone, MapPin, Pencil, Save, AlertCircle, CheckCircle, FileText } from "lucide-react";
import { User, ApiErrorResponse } from "../../types";
import { apiCall } from "@/api/apiCall";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

interface ProfileProps {
    user: User;
}

interface ValidationErrors {
    name?: string;
    phone?: string;
    address?: string;
    image?: string;
    documents?: string;
}

interface FormData {
    name: string;
    address: string;
    phone: string;
    role: string;
    image: File | null;
    documents: File[];
}

// Move InputField component outside of Profile component
const InputField: React.FC<{
    label: string;
    name: string;
    type?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
    error?: string;
    placeholder?: string;
    touched?: Record<string, boolean>;
    loading?: boolean;
}> = ({ label, name, type = "text", value, onChange, onBlur, error, placeholder, touched, loading }) => (
    <div>
        <label className="block text-sm font-medium text-[#7F264B] mb-1">{label}</label>
        <div className="relative">
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                placeholder={placeholder}
                disabled={loading}
                className={`w-full p-3 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#7F264B]/20 ${error
                        ? 'border-red-500 bg-red-50'
                        : touched?.[name] && !error
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-300 focus:border-[#7F264B]'
                    }`}
            />
            {Boolean(touched?.[name]) && (
                <div className="absolute right-3 top-3">
                    {error ? (
                        <AlertCircle className="w-5 h-5 text-red-500" />
                    ) : (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                </div>
            )}
        </div>
        {Boolean(error) && Boolean(touched?.[name]) && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {error}
            </p>
        )}
    </div>
);

const Profile: React.FC<ProfileProps> = ({ user: initialUser }) => {
    const [editMode, setEditMode] = useState(false);
    const [user, setUser] = useState<User>(initialUser);
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const [formData, setFormData] = useState<FormData>({
        name: user.name || "",
        address: user.address || "",
        phone: user.phone || "",
        role: user.role || "member",
        image: null,
        documents: [],
    });

    const [errors, setErrors] = useState<ValidationErrors>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    // Validation functions
    const validateName = (name: string): string | undefined => {
        if (!name.trim()) return "Name is required";
        if (name.trim().length < 2) return "Name must be at least 2 characters";
        if (name.trim().length > 50) return "Name must be less than 50 characters";
        if (!/^[a-zA-Z\s]+$/.test(name.trim())) return "Name can only contain letters and spaces";
        return undefined;
    };

    const validatePhone = (phone: string): string | undefined => {
        if (!phone.trim()) return "Phone number is required";
        // Pakistani phone number format validation
        const phoneRegex = /^(\+92|0)?[0-9]{10}$/;
        if (!phoneRegex.test(phone.replace(/\s|-/g, ''))) {
            return "Please enter a valid Pakistani phone number";
        }
        return undefined;
    };

    const validateAddress = (address: string): string | undefined => {
        if (!address.trim()) return "Address is required";
        if (address.trim().length < 5) return "Address must be at least 5 characters";
        if (address.trim().length > 200) return "Address must be less than 200 characters";
        return undefined;
    };

    const validateImage = (file: File | null): string | undefined => {
        if (file) {
            const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
            if (!validTypes.includes(file.type)) {
                return "Image must be JPEG, PNG, or GIF";
            }
            if (file.size > 5 * 1024 * 1024) {
                return "Image size must be less than 5MB";
            }
        }
        return undefined;
    };

    const validateDocuments = (files: File[]): string | undefined => {
        if (user.role === 'ngo' && files.length === 0) {
            return "Documents are required for NGO users";
        }
        
        for (const file of files) {
            const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            if (!validTypes.includes(file.type)) {
                return "Documents must be PDF, DOC, or DOCX format";
            }
            if (file.size > 10 * 1024 * 1024) {
                return "Each document must be less than 10MB";
            }
        }
        
        if (files.length > 10) {
            return "Maximum 10 documents allowed";
        }
        
        return undefined;
    };

    const validateForm = (): ValidationErrors => {
        return {
            name: validateName(formData.name),
            phone: validatePhone(formData.phone),
            address: validateAddress(formData.address),
            image: validateImage(formData.image),
            documents: validateDocuments(formData.documents),
        };
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
        if (errors[name as keyof ValidationErrors]) {
            setErrors(prev => ({
                ...prev,
                [name]: undefined
            }));
        }

        // Mark field as touched
        setTouched(prev => ({ ...prev, [name]: true }));
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));

        // Validate specific field
        let fieldError: string | undefined;
        switch (name) {
            case 'name':
                fieldError = validateName(value);
                break;
            case 'phone':
                fieldError = validatePhone(value);
                break;
            case 'address':
                fieldError = validateAddress(value);
                break;
        }

        if (fieldError !== errors[name as keyof ValidationErrors]) {
            setErrors(prev => ({
                ...prev,
                [name]: fieldError
            }));
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setFormData(prev => ({ ...prev, image: file }));
        
        const imageError = validateImage(file);
        setErrors(prev => ({ ...prev, image: imageError }));
        setTouched(prev => ({ ...prev, image: true }));
    };

    const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setFormData(prev => ({ ...prev, documents: files }));
        
        const documentError = validateDocuments(files);
        setErrors(prev => ({ ...prev, documents: documentError }));
        setTouched(prev => ({ ...prev, documents: true }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setApiError("");
        setSuccessMessage("");

        // Mark all fields as touched
        setTouched({
            name: true,
            phone: true,
            address: true,
            image: true,
            documents: true,
        });

        // Validate form
        const formErrors = validateForm();
        setErrors(formErrors);

        // Check if form has errors
        const hasErrors = Object.values(formErrors).some(error => error !== undefined);
        if (hasErrors) {
            setLoading(false);
            setApiError("Please fix the errors above before submitting.");
            return;
        }

        const token = localStorage.getItem("authToken");
        if (!token) {
            setApiError("Authentication token not found. Please log in again.");
            setLoading(false);
            return;
        }

        try {
            const body = new FormData();
            body.append("name", formData.name.trim());
            body.append("address", formData.address.trim());
            body.append("phone", formData.phone.trim());
            body.append("role", formData.role);
            if (formData.image) body.append("image", formData.image);
            
            // Append documents for NGO users
            if (user.role === 'ngo') {
                formData.documents.forEach((doc, index) => {
                    body.append("documents", doc);
                });
            }

            const response = await apiCall<User>({
                url: `${API_BASE_URL}/users/profile`,
                method: 'PUT',
                data: body,
                requiresAuth: true
            });

            if (response.success) {
                setUser(response.data["user"]);
                setEditMode(false);
                setSuccessMessage("Profile updated successfully!");
                setErrors({});
                setTouched({});

                // Clear success message after 3 seconds
                setTimeout(() => setSuccessMessage(""), 3000);
                window.location.reload();

            } else {
                setApiError(response.data["msg"] || "Failed to update profile.");
            }
        } catch (error: any) {
            setApiError(error.message || "Network error occurred.");
        } finally {
            setLoading(false);
        }
    };

    const handleCancelEdit = () => {
        setEditMode(false);
        setFormData({
            name: user.name || "",
            address: user.address || "",
            phone: user.phone || "",
            role: user.role || "member",
            image: null,
            documents: [],
        });
        setErrors({});
        setTouched({});
        setApiError("");
        setSuccessMessage("");
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Profile Information</h2>
                {!editMode ? (
                    <button
                        onClick={() => setEditMode(true)}
                        className="flex items-center space-x-2 px-4 py-2 bg-[#7F264B] text-white rounded-lg hover:bg-[#7F264B]/90 transition-colors"
                    >
                        <Pencil className="w-4 h-4" />
                        <span>Edit Profile</span>
                    </button>
                ) : (
                    <div className="flex space-x-3">
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                        >
                            <Save className="w-4 h-4" />
                            <span>{loading ? "Saving..." : "Save Changes"}</span>
                        </button>
                        <button
                            onClick={handleCancelEdit}
                            disabled={loading}
                            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>
                    </div>
                )}
            </div>

            {apiError && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                    {apiError}
                </div>
            )}

            {successMessage && (
                <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                    {successMessage}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField
                        label="Full Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors.name}
                        touched={touched}
                        loading={loading}
                        placeholder="Enter your full name"
                    />

                    <InputField
                        label="Phone Number"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors.phone}
                        touched={touched}
                        loading={loading}
                        placeholder="+923001234567"
                    />
                </div>

                <InputField
                    label="Address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.address}
                    touched={touched}
                    loading={loading}
                    placeholder="Enter your address"
                />

                {/* Image Upload */}
                <div>
                    <label className="block text-sm font-medium text-[#7F264B] mb-1">
                        Profile Image
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        disabled={loading}
                        className={`w-full p-3 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#7F264B]/20 ${
                            errors.image ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-[#7F264B]'
                        }`}
                    />
                    {errors.image && touched.image && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {errors.image}
                        </p>
                    )}
                    {formData.image && (
                        <p className="mt-1 text-sm text-green-600 flex items-center">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Image selected: {formData.image.name}
                        </p>
                    )}
                </div>

                {/* Document Upload for NGO Users */}
                {user.role === 'ngo' && (
                    <div>
                        <label className="block text-sm font-medium text-[#7F264B] mb-1">
                            NGO Documents (PDF, DOC, DOCX - Max 10 files, 10MB each)
                        </label>
                        <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            multiple
                            onChange={handleDocumentChange}
                            disabled={loading}
                            className={`w-full p-3 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#7F264B]/20 ${
                                errors.documents ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-[#7F264B]'
                            }`}
                        />
                        {errors.documents && touched.documents && (
                            <p className="mt-1 text-sm text-red-600 flex items-center">
                                <AlertCircle className="w-4 h-4 mr-1" />
                                {errors.documents}
                            </p>
                        )}
                        {formData.documents.length > 0 && (
                            <div className="mt-2">
                                <p className="text-sm text-green-600 flex items-center mb-2">
                                    <CheckCircle className="w-4 h-4 mr-1" />
                                    {formData.documents.length} document(s) selected:
                                </p>
                                <ul className="text-sm text-gray-600 space-y-1">
                                    {formData.documents.map((doc, index) => (
                                        <li key={index} className="flex items-center">
                                            <FileText className="w-4 h-4 mr-2" />
                                            {doc.name}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}

                {/* Display current documents for NGO users */}
                {user.role === 'ngo' && user.documents && user.documents.length > 0 && (
                    <div>
                        <label className="block text-sm font-medium text-[#7F264B] mb-1">
                            Current Documents
                        </label>
                        <div className="p-3 bg-gray-50 rounded-lg">
                            <ul className="text-sm text-gray-600 space-y-1">
                                {user.documents.map((doc, index) => (
                                    <li key={index} className="flex items-center">
                                        <FileText className="w-4 h-4 mr-2" />
                                        <a 
                                            href={doc.startsWith('http') ? doc : `${API_BASE_URL.replace('/api', '')}/uploads/${doc}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:underline"
                                        >
                                            {doc.split('/').pop() || `Document ${index + 1}`}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            </form>

            {/* Display current profile information in view mode */}
            {!editMode && (
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                            <Mail className="w-5 h-5 text-gray-500" />
                            <div>
                                <p className="text-sm text-gray-500">Email</p>
                                <p className="text-gray-800 font-medium">{user.email}</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <Phone className="w-5 h-5 text-gray-500" />
                            <div>
                                <p className="text-sm text-gray-500">Phone</p>
                                <p className="text-gray-800 font-medium">{user.phone || "Not provided"}</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <MapPin className="w-5 h-5 text-gray-500" />
                            <div>
                                <p className="text-sm text-gray-500">Address</p>
                                <p className="text-gray-800 font-medium">{user.address || "Not provided"}</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-5 h-5 text-gray-500">👤</div>
                            <div>
                                <p className="text-sm text-gray-500">Role</p>
                                <p className="text-gray-800 font-medium capitalize">{user.role}</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <div className="w-5 h-5 text-gray-500">📅</div>
                            <div>
                                <p className="text-sm text-gray-500">Member Since</p>
                                <p className="text-gray-800 font-medium">
                                    {new Date(user.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;