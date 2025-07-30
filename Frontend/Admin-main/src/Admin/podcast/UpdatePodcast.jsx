import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faSpinner, faArrowLeft, faSave, faTrash } from '@fortawesome/free-solid-svg-icons';
import AdminLayout from '../../layouts/AdminLayout';

const getVideoUrl = (video) => {
  if (!video) return '';
  if (video.startsWith('http')) return video;
  return `http://localhost:8000/uploads/${video}`;
};

const UpdatePodcast = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    guest: '',
    duration: '',
    episodeNumber: '',
    isPublished: false
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [currentVideoUrl, setCurrentVideoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchPodcastItem = async () => {
      try {
        setFetching(true);
        const response = await axios.get(`http://localhost:8000/api/podcasts/getbyid/${id}`);
        console.log('API Response:', response);
        
        // Handle different possible response structures
        let item = null;
        if (response.data) {
          if (response.data.data) {
            item = response.data.data;
          } else if (response.data.podcast) {
            item = response.data.podcast;
          } else {
            item = response.data;
          }
        }
        
        if (item) {
          console.log('Fetched podcast item:', item);
          
          setFormData({
            name: item.name || '',
            description: item.description || '',
            guest: item.guest || '',
            duration: item.duration || '',
            episodeNumber: item.episodeNumber || '',
            isPublished: item.isPublished || false
          });
          
          if (item.video) {
            setCurrentVideoUrl(item.video);
          }
        }
      } catch (error) {
        console.error('Error fetching podcast item:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load podcast episode details',
          confirmButtonText: 'OK'
        });
        navigate('/Admin/Podcast');
      } finally {
        setFetching(false);
      }
    };

    if (id) {
      fetchPodcastItem();
    }
  }, [id, navigate]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/flv', 'video/webm', 'video/mkv'];
      if (!validTypes.includes(file.type)) {
        Swal.fire('Error', 'Please select a valid video file (MP4, AVI, MOV, WMV, FLV, WEBM, MKV)', 'error');
        return;
      }

      // Validate file size (500MB limit for videos)
      const maxSize = 500 * 1024 * 1024; // 500MB
      if (file.size > maxSize) {
        Swal.fire('Error', 'File size must be less than 500MB', 'error');
        return;
      }

      setSelectedFile(file);
      
      // Create preview URL for video
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.guest.trim()) {
      newErrors.guest = 'Guest is required';
    }

    if (!formData.duration.trim()) {
      newErrors.duration = 'Duration is required';
    }

    if (!formData.episodeNumber || formData.episodeNumber.toString().trim() === '') {
      newErrors.episodeNumber = 'Episode number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('guest', formData.guest);
      formDataToSend.append('duration', formData.duration);
      formDataToSend.append('episodeNumber', formData.episodeNumber);
      formDataToSend.append('isPublished', formData.isPublished);
      
      if (selectedFile) {
        formDataToSend.append('video', selectedFile);
      }

      const response = await axios.put(`http://localhost:8000/api/podcasts/update/${id}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        await Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Podcast episode has been updated successfully.',
          confirmButtonText: 'OK'
        });
        navigate('/Admin/Podcast');
      }
    } catch (error) {
      console.error('Error updating podcast episode:', error);
      
      let errorMessage = 'Failed to update podcast episode';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMessage,
        confirmButtonText: 'OK'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/Admin/Podcast');
  };

  const handleDelete = async () => {
    const result = await Swal.fire({
      icon: 'warning',
      title: 'Delete Podcast Episode?',
      text: 'This action cannot be undone!',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        setLoading(true);
        await axios.delete(`http://localhost:8000/api/podcasts/delete/${id}`);
        
        await Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Podcast episode has been deleted successfully.',
          confirmButtonText: 'OK'
        });
        navigate('/Admin/Podcast');
      } catch (error) {
        console.error('Error deleting podcast episode:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to delete podcast episode',
          confirmButtonText: 'OK'
        });
      } finally {
        setLoading(false);
      }
    }
  };

  if (fetching) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <FontAwesomeIcon icon={faSpinner} spin size="2x" className="text-blue-500 mb-4" />
            <p className="text-gray-600">Loading podcast episode...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <button
                onClick={handleCancel}
                className="text-gray-600 hover:text-gray-800 transition-colors"
              >
                <FontAwesomeIcon icon={faArrowLeft} className="text-xl" />
              </button>
              <h1 className="text-2xl font-bold text-gray-800">Edit Podcast Episode</h1>
            </div>
            <button
              onClick={handleDelete}
              disabled={loading}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              <FontAwesomeIcon icon={faTrash} />
              <span>Delete</span>
            </button>
          </div>

          {/* Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Episode Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter episode name"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter episode description"
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                )}
              </div>

              {/* Guest */}
              <div>
                <label htmlFor="guest" className="block text-sm font-medium text-gray-700 mb-2">
                  Guest *
                </label>
                <input
                  type="text"
                  id="guest"
                  name="guest"
                  value={formData.guest}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                    errors.guest ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter guest name"
                />
                {errors.guest && (
                  <p className="text-red-500 text-sm mt-1">{errors.guest}</p>
                )}
              </div>

              {/* Duration */}
              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
                  Duration *
                </label>
                <input
                  type="text"
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                    errors.duration ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., 45:30"
                />
                {errors.duration && (
                  <p className="text-red-500 text-sm mt-1">{errors.duration}</p>
                )}
              </div>

              {/* Episode Number */}
              <div>
                <label htmlFor="episodeNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  Episode Number *
                </label>
                <input
                  type="number"
                  id="episodeNumber"
                  name="episodeNumber"
                  value={formData.episodeNumber}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                    errors.episodeNumber ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter episode number"
                  min="1"
                />
                {errors.episodeNumber && (
                  <p className="text-red-500 text-sm mt-1">{errors.episodeNumber}</p>
                )}
              </div>

              {/* Video Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Video File
                </label>
                {/* Video preview */}
                {(previewUrl || currentVideoUrl) && (
                  <div className="mb-4">
                    <video controls className="w-full max-h-64 rounded" src={getVideoUrl(previewUrl || currentVideoUrl)}>
                      Your browser does not support the video tag.
                    </video>
                  </div>
                )}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="video-upload"
                  />
                  <label htmlFor="video-upload" className="cursor-pointer">
                    {selectedFile ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-center">
                          <FontAwesomeIcon icon={faUpload} className="text-4xl text-green-500" />
                        </div>
                        <div className="text-sm text-gray-600">
                          New video file: {selectedFile.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          Click to change video file
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <FontAwesomeIcon icon={faUpload} className="text-4xl text-gray-400" />
                        <div className="text-gray-600">
                          <p className="font-medium">Click to upload new video file</p>
                          <p className="text-sm">MP4, AVI, MOV, WMV, FLV, WEBM, MKV up to 500MB</p>
                        </div>
                      </div>
                    )}
                  </label>
                </div>
                {currentVideoUrl && !selectedFile && (
                  <p className="text-sm text-gray-500 mt-2">
                    Current video file will be kept if no new file is selected
                  </p>
                )}
              </div>

              {/* Publish Status */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isPublished"
                  name="isPublished"
                  checked={formData.isPublished}
                  onChange={handleInputChange}
                  className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isPublished" className="text-sm font-medium text-gray-700">
                  Publish episode
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 pt-6 border-t">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                >
                  {loading ? (
                    <>
                      <FontAwesomeIcon icon={faSpinner} spin />
                      <span>Updating...</span>
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faSave} />
                      <span>Update Podcast Episode</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default UpdatePodcast; 