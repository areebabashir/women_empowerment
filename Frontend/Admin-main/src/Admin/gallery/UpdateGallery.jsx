import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faSpinner, faArrowLeft, faSave, faTrash } from '@fortawesome/free-solid-svg-icons';
import AdminLayout from '../../layouts/AdminLayout';

const UpdateGallery = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    tags: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [currentImageUrl, setCurrentImageUrl] = useState('');
  const [existingImages, setExistingImages] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchGalleryItem = async () => {
      try {
        setFetching(true);
        const response = await axios.get(`http://localhost:8000/api/gallery/getbyid/${id}`);
        console.log('API Response:', response);
        
        // Handle different possible response structures
        let item = null;
        if (response.data) {
          if (response.data.data) {
            item = response.data.data;
          } else if (response.data.gallery) {
            item = response.data.gallery;
          } else {
            item = response.data;
          }
        }
        
        if (item) {
          console.log('Fetched gallery item:', item);
          
          // Format date for input field (YYYY-MM-DD)
          let formattedDate = '';
          if (item.date) {
            const dateObj = new Date(item.date);
            if (!isNaN(dateObj.getTime())) {
              formattedDate = dateObj.toISOString().split('T')[0];
            }
          }
          
          setFormData({
            title: item.title || '',
            description: item.description || '',
            category: item.category || '',
            date: formattedDate,
            tags: item.tags ? (Array.isArray(item.tags) ? item.tags.join(', ') : item.tags) : ''
          });
          
          console.log('Form data set:', {
            title: item.title || '',
            description: item.description || '',
            category: item.category || '',
            date: formattedDate,
            tags: item.tags ? (Array.isArray(item.tags) ? item.tags.join(', ') : item.tags) : ''
          });
          
          // Handle multiple images
          if (item.images && Array.isArray(item.images) && item.images.length > 0) {
            const imageUrls = item.images.map(img => 
              img.startsWith('http') ? img : `http://localhost:8000/uploads/images/${img}`
            );
            setExistingImages(imageUrls);
            setCurrentImageUrl(imageUrls[0]);
            setPreviewUrl(imageUrls[0]);
            console.log('Set image URLs:', imageUrls);
          } else if (item.imageUrl) {
            const imageUrl = item.imageUrl.startsWith('http') 
              ? item.imageUrl 
              : `http://localhost:8000/uploads/images/${item.imageUrl}`;
            setExistingImages([imageUrl]);
            setCurrentImageUrl(imageUrl);
            setPreviewUrl(imageUrl);
            console.log('Set single image URL:', imageUrl);
          }
        }
      } catch (error) {
        console.error('Error fetching gallery item:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load gallery item details',
          confirmButtonText: 'OK'
        });
        navigate('/Admin/Gallery');
      } finally {
        setFetching(false);
      }
    };

    if (id) {
      fetchGalleryItem();
    }
  }, [id, navigate]);



  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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
    const files = Array.from(e.target.files);
    
    // Validate number of files (max 10 total)
    if (existingImages.length - imagesToDelete.length + newImages.length + files.length > 10) {
      Swal.fire('Error', 'You can have a maximum of 10 images total', 'error');
      return;
    }

    const validFiles = [];
    const newPreviewUrls = [];

    files.forEach(file => {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        Swal.fire('Error', `${file.name} is not a valid image file (JPEG, PNG, GIF, or WebP)`, 'error');
        return;
      }

      // Validate file size (5MB limit)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        Swal.fire('Error', `${file.name} is too large. File size must be less than 5MB`, 'error');
        return;
      }

      validFiles.push(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        newPreviewUrls.push(e.target.result);
        if (newPreviewUrls.length === validFiles.length) {
          setNewImages(prev => [...prev, ...validFiles]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDeleteExistingImage = (index, event) => {
    const imageToDelete = existingImages[index];
    
    // Add visual feedback
    if (event && event.target) {
      const button = event.target;
      button.style.backgroundColor = '#dc2626'; // darker red
      button.style.transform = 'scale(0.9)';
      
      setTimeout(() => {
        button.style.backgroundColor = '';
        button.style.transform = '';
      }, 150);
    }
    
    setImagesToDelete(prev => [...prev, imageToDelete]);
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleRemoveNewImage = (index) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleRestoreDeletedImage = (imageUrl) => {
    setImagesToDelete(prev => prev.filter(img => img !== imageUrl));
    setExistingImages(prev => [...prev, imageUrl]);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    }

    if (!formData.date.trim()) {
      newErrors.date = 'Date is required';
    }

    // Ensure we have at least one image (either existing or new)
    if (existingImages.length === 0 && newImages.length === 0) {
      newErrors.images = 'At least one image is required';
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
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('date', formData.date);
      
      if (formData.tags.trim()) {
        formDataToSend.append('tags', formData.tags);
      }
      
      // Append existing images that are not deleted (these will be kept)
      if (existingImages.length > 0) {
        existingImages.forEach(imageUrl => {
          formDataToSend.append('existingImages', imageUrl);
        });
      }

      // Append new images to add
      if (newImages.length > 0) {
        newImages.forEach(file => {
          formDataToSend.append('images', file);
        });
      }

      // Append list of images to delete (only the ones marked for deletion)
      if (imagesToDelete.length > 0) {
        formDataToSend.append('imagesToDelete', JSON.stringify(imagesToDelete));
      }

      // Send total count for validation
      formDataToSend.append('totalImages', existingImages.length + newImages.length);
      
      // Send original image count for reference
      formDataToSend.append('originalImageCount', existingImages.length + imagesToDelete.length);



      const response = await axios.put(`http://localhost:8000/api/gallery/update/${id}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });



      if (response.status === 200) {
        await Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Gallery item has been updated successfully.',
          confirmButtonText: 'OK'
        });
        navigate('/Admin/Gallery');
      }
    } catch (error) {
      console.error('Error updating gallery item:', error);
      
      let errorMessage = 'Failed to update gallery item';
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
    navigate('/Admin/Gallery');
  };

  const handleDelete = async () => {
    const result = await Swal.fire({
      icon: 'warning',
      title: 'Delete Gallery Item?',
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
        await axios.delete(`http://localhost:8000/api/gallery/delete/${id}`);
        
        await Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Gallery item has been deleted successfully.',
          confirmButtonText: 'OK'
        });
        navigate('/Admin/Gallery');
      } catch (error) {
        console.error('Error deleting gallery item:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to delete gallery item',
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
            <p className="text-gray-600">Loading gallery item...</p>
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
              <h1 className="text-2xl font-bold text-gray-800">Edit Gallery Item</h1>
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
              {/* Existing Images Section */}
              {existingImages.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Images ({existingImages.length})
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
                    {existingImages.map((imageUrl, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={imageUrl}
                          alt={`Current image ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/default-image.jpg';
                          }}
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleDeleteExistingImage(index, e);
                          }}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors z-10"
                          title="Delete this image"
                          style={{ zIndex: 10 }}
                        >
                          ×
                        </button>
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center">
                          <span className="text-white opacity-0 group-hover:opacity-100 text-sm font-medium">
                            Image {index + 1}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Deleted Images Section */}
              {imagesToDelete.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Deleted Images ({imagesToDelete.length}) - Click to restore
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
                    {imagesToDelete.map((imageUrl, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={imageUrl}
                          alt={`Deleted image ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border-2 border-red-300 opacity-50"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/default-image.jpg';
                          }}
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleRestoreDeletedImage(imageUrl);
                          }}
                          className="absolute top-2 right-2 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-green-600 transition-colors z-10"
                          title="Restore this image"
                          style={{ zIndex: 10 }}
                        >
                          ↺
                        </button>
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center">
                          <span className="text-white opacity-0 group-hover:opacity-100 text-sm font-medium">
                            Deleted
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* New Images Section */}
              {newImages.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Images to Add ({newImages.length})
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
                    {newImages.map((file, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`New image ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border-2 border-green-300"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/default-image.jpg';
                          }}
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleRemoveNewImage(index);
                          }}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors z-10"
                          title="Remove this image"
                          style={{ zIndex: 10 }}
                        >
                          ×
                        </button>
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center">
                          <span className="text-white opacity-0 group-hover:opacity-100 text-sm font-medium">
                            New Image {index + 1}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* New Image Upload Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Add New Images (Optional)
                </label>
                <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  errors.images ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                }`}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="image-upload"
                    multiple
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <div className="space-y-4">
                      <FontAwesomeIcon icon={faUpload} className="text-4xl text-gray-400" />
                      <div className="text-gray-600">
                        <p className="font-medium">Click to add new images</p>
                        <p className="text-sm">PNG, JPG, GIF, WebP up to 5MB each</p>
                        <p className="text-xs text-gray-500">
                          Total images: {existingImages.length + newImages.length} / 10
                        </p>
                      </div>
                    </div>
                  </label>
                </div>
                {errors.images && (
                  <p className="text-red-500 text-sm mt-1">{errors.images}</p>
                )}
              </div>

              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                    errors.title ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter image title"
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">{errors.title}</p>
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
                  placeholder="Enter image description"
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                )}
              </div>

              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                    errors.category ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select a category</option>
                  <option value="Events">Events</option>
                  <option value="Workshops">Workshops</option>
                  <option value="Community">Community</option>
                  <option value="Success Stories">Success Stories</option>
                  <option value="Programs">Programs</option>
                  <option value="Team">Team</option>
                  <option value="Other">Other</option>
                </select>
                {errors.category && (
                  <p className="text-red-500 text-sm mt-1">{errors.category}</p>
                )}
              </div>

              {/* Date */}
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                  Date *
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                    errors.date ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.date && (
                  <p className="text-red-500 text-sm mt-1">{errors.date}</p>
                )}
              </div>

              {/* Tags */}
              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                  Tags (optional)
                </label>
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Enter tags separated by commas"
                />
                <p className="text-gray-500 text-sm mt-1">
                  Separate multiple tags with commas (e.g., women, empowerment, leadership)
                </p>
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
                      <span>Update Gallery Item</span>
                    </>
                  )}
                </button>
              </div>
            </form>
            
            {/* Image Validation Error */}
            {errors.images && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mt-4">
                <div className="flex items-center text-red-700">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">{errors.images}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default UpdateGallery; 