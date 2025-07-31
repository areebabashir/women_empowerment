import React, { useState, useEffect } from "react";
import { X, Upload, Calendar, Clock, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { apiCall } from "../../api/apiCall";
import toast from "react-hot-toast";
import { Program } from "../../types";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

interface UpdateProgramModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  program: Program | null;
}

const UpdateProgramModal: React.FC<UpdateProgramModalProps> = ({ isOpen, onClose, onSuccess, program }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startingDate: "",
    endingDate: "",
    day: "",
    time: ""
  });
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  // Initialize form data when program changes
  useEffect(() => {
    if (program) {
      setFormData({
        title: program.title || "",
        description: program.description || "",
        startingDate: program.startingDate ? new Date(program.startingDate).toISOString().split('T')[0] : "",
        endingDate: program.endingDate ? new Date(program.endingDate).toISOString().split('T')[0] : "",
        day: program.day || "",
        time: program.time || ""
      });
    }
  }, [program]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!program) {
      toast.error('No program selected for update');
      return;
    }

    if (!formData.title || !formData.description || !formData.startingDate || 
        !formData.endingDate || !formData.day || !formData.time) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('startingDate', formData.startingDate);
      formDataToSend.append('endingDate', formData.endingDate);
      formDataToSend.append('day', formData.day);
      formDataToSend.append('time', formData.time);
      
      if (image) {
        formDataToSend.append('image', image);
      }

      const response = await apiCall({
        url: `${API_BASE_URL}/programs/update/${program._id}`,
        method: 'PUT',
        data: formDataToSend,
        requiresAuth: true
      });

      if (response.success) {
        toast.success('Program updated successfully!');
        onSuccess();
        onClose();
        // Reset form
        setFormData({
          title: "",
          description: "",
          startingDate: "",
          endingDate: "",
          day: "",
          time: ""
        });
        setImage(null);
      } else {
        toast.error('Failed to update program');
      }
    } catch (error) {
      console.error('Error updating program:', error);
      toast.error('Error updating program');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !program) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[#7F264B]">Update Program</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Program Title *
            </label>
            <Input
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter program title"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter program description"
              rows={4}
              required
            />
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date *
              </label>
              <Input
                type="date"
                name="startingDate"
                value={formData.startingDate}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date *
              </label>
              <Input
                type="date"
                name="endingDate"
                value={formData.endingDate}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          {/* Day and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Day *
              </label>
              <Input
                name="day"
                value={formData.day}
                onChange={handleInputChange}
                placeholder="e.g., Monday, Tuesday"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time *
              </label>
              <Input
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                placeholder="e.g., 10:00 AM - 2:00 PM"
                required
              />
            </div>
          </div>

          {/* Current Image */}
          {program.image && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Image
              </label>
              <img
                src={`${API_BASE_URL.replace('/api', '')}/uploads/images/${program.image}`}
                alt="Current program image"
                className="w-32 h-32 object-cover rounded-lg border"
              />
            </div>
          )}

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Update Image (Optional)
            </label>
            <div className="flex items-center space-x-4">
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="flex-1"
              />
              {image && (
                <span className="text-sm text-green-600">
                  {image.name}
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#7F264B] hover:bg-[#6a1f3f]"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Program'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProgramModal; 