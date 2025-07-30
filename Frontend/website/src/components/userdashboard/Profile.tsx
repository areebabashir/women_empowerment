import React, { useState } from "react";
import { Mail, Phone, MapPin, Pencil, Save, AlertCircle, CheckCircle } from "lucide-react";
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
}

interface FormData {
    name: string;
    address: string;
    phone: string;
    role: string;
    image: File | null;
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
        if (!file) return undefined;

        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
        if (!allowedTypes.includes(file.type)) {
            return "Please select a valid image file (JPEG, PNG, or GIF)";
        }

        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            return "Image size must be less than 5MB";
        }

        return undefined;
    };

    // Validate all fields
    const validateForm = (): ValidationErrors => {
        return {
            name: validateName(formData.name),
            phone: validatePhone(formData.phone),
            address: validateAddress(formData.address),
            image: validateImage(formData.image),
        };
    };

    // Handle input changes with real-time validation
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Clear API error when user starts typing
        if (apiError) setApiError("");
        if (successMessage) setSuccessMessage("");

        // Real-time validation for touched fields
        if (touched[name]) {
            const newErrors = { ...errors };
            switch (name) {
                case 'name':
                    newErrors.name = validateName(value);
                    break;
                case 'phone':
                    newErrors.phone = validatePhone(value);
                    break;
                case 'address':
                    newErrors.address = validateAddress(value);
                    break;
            }
            setErrors(newErrors);
        }
    };

    // Handle field blur (mark as touched)
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const { name } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));

        // Validate on blur
        const newErrors = { ...errors };
        switch (name) {
            case 'name':
                newErrors.name = validateName(formData.name);
                break;
            case 'phone':
                newErrors.phone = validatePhone(formData.phone);
                break;
            case 'address':
                newErrors.address = validateAddress(formData.address);
                break;
        }
        setErrors(newErrors);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setFormData(prev => ({ ...prev, image: file }));

        // Clear messages
        if (apiError) setApiError("");
        if (successMessage) setSuccessMessage("");

        // Validate image
        const imageError = validateImage(file);
        setErrors(prev => ({ ...prev, image: imageError }));
        setTouched(prev => ({ ...prev, image: true }));
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
            setApiError("Unauthorized. Please log in again.");
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
        });
        setErrors({});
        setTouched({});
        setApiError("");
        setSuccessMessage("");
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-start">
                <h1 className="text-3xl font-bold text-[#7F264B]">PROFILE</h1>
                <div className="relative w-32 h-32 bg-gradient-to-br from-[#7F264B] to-[#e44487] rounded-full flex items-center justify-center">
                    <img
                        src={`http://localhost:8000/${user.image}`}
                        alt="Profile"
                        className="w-full h-full rounded-full object-cover"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = '/default-avatar.png'; // Fallback image
                        }}
                    />
                </div>
            </div>

            {/* Success Message */}
            {successMessage && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                    <span className="text-green-700">{successMessage}</span>
                </div>
            )}

            {/* API Error Message */}
            {apiError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
                    <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                    <span className="text-red-700">{apiError}</span>
                </div>
            )}

            <div className="flex justify-end gap-3">
                {editMode && (
                    <button
                        type="button"
                        onClick={handleCancelEdit}
                        disabled={loading}
                        className="flex items-center px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                )}
                {!editMode && (
                    <button
                        type="button"
                        onClick={() => setEditMode(true)}
                        className="flex items-center px-6 py-2 bg-[#7F264B] text-white rounded-lg hover:bg-[#5e1d39] transition-colors"
                    >
                        <Pencil className="w-4 h-4 mr-2" />
                        Edit Profile
                    </button>
                )}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                {editMode ? (
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <InputField
                                label="Full Name *"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={errors.name}
                                placeholder="Enter your full name"
                                touched={touched}
                                loading={loading}
                            />

                            <div>
                                <label className="block text-sm font-medium text-[#7F264B] mb-1">Role</label>
                                <select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    disabled={loading}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7F264B]/20 focus:border-[#7F264B]"
                                >
                                    <option value="member">Member</option>
                                    <option value="donor">Donor</option>
                                    <option value="volunteer">Volunteer</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#7F264B] mb-1">Email</label>
                                <div className="flex items-center p-3 bg-gray-50 border border-gray-300 rounded-lg">
                                    <Mail className="w-4 h-4 text-gray-400 mr-2" />
                                    <span className="text-gray-600">{user.email} (Cannot be changed)</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <InputField
                                label="Phone Number *"
                                name="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={errors.phone}
                                placeholder="e.g., +923001234567 or 03001234567"
                                touched={touched}
                                loading={loading}
                            />

                            <InputField
                                label="Address *"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={errors.address}
                                placeholder="Enter your complete address"
                                touched={touched}
                                loading={loading}
                            />

                            <div>
                                <label className="block text-sm font-medium text-[#7F264B] mb-1">Profile Image</label>
                                <input
                                    type="file"
                                    name="image"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    disabled={loading}
                                    className={`w-full p-3 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#7F264B]/20 ${errors.image ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-[#7F264B]'
                                        }`}
                                />
                                {errors.image && touched.image && (
                                    <p className="mt-1 text-sm text-red-600 flex items-center">
                                        <AlertCircle className="w-4 h-4 mr-1" />
                                        {errors.image}
                                    </p>
                                )}
                                <p className="mt-1 text-xs text-gray-500">
                                    Supported formats: JPEG, PNG, GIF. Max size: 5MB
                                </p>
                            </div>
                        </div>

                        <div className="md:col-span-2 flex justify-end">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex items-center px-6 py-2 bg-[#7F264B] text-white rounded-lg hover:bg-[#5e1d39] transition-colors disabled:opacity-50"
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4 mr-2" />
                                        Save Changes
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-[#7F264B]">Full Name</label>
                                <p className="text-lg text-gray-800 mt-1">{user.name}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-[#7F264B]">Role</label>
                                <p className="text-lg text-gray-800 mt-1 capitalize">{user.role}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-[#7F264B]">Email</label>
                                <div className="flex items-center mt-1">
                                    <Mail className="w-4 h-4 text-gray-400 mr-2" />
                                    <p className="text-lg text-gray-800">{user.email}</p>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-[#7F264B]">Phone</label>
                                <div className="flex items-center mt-1">
                                    <Phone className="w-4 h-4 text-gray-400 mr-2" />
                                    <p className="text-lg text-gray-800">{user.phone || "Not provided"}</p>
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-[#7F264B]">Address</label>
                                <div className="flex items-center mt-1">
                                    <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                                    <p className="text-lg text-gray-800">{user.address || "Not provided"}</p>
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-[#7F264B]">Member Since</label>
                                <p className="text-lg text-gray-800 mt-1">
                                    {new Date(user.createdAt).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;