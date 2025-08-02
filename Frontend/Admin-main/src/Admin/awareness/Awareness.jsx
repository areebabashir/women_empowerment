import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEye,
  faPen,
  faTrash,
  faPlus,
  faSearch,
  faTimes,
  faSpinner,
  faSave,
  faToggleOn,
  faToggleOff
} from '@fortawesome/free-solid-svg-icons';
import AdminLayout from '../../layouts/AdminLayout';

// AddAwarenessModal component
const AddAwarenessModal = ({ showModal, setShowModal, onAwarenessAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    serviceAvailable: '',
    phoneNumber: '',
    emergencyNumber: '',
    image: null,
    previewImage: null
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      const file = files[0];
      if (file) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          Swal.fire('Error', 'Please select an image file', 'error');
          return;
        }
        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          Swal.fire('Error', 'Image size should be less than 5MB', 'error');
          return;
        }
        setFormData({
          ...formData,
          [name]: file,
          previewImage: URL.createObjectURL(file)
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name.trim() || !formData.description.trim() || !formData.serviceAvailable.trim() || !formData.phoneNumber.trim() || !formData.emergencyNumber.trim()) {
      Swal.fire('Error', 'Name, Description, Legal Awareness, Phone Number, and Emergency Number are required fields', 'error');
      return;
    }
    
    // Validate that an image is selected
    if (!formData.image) {
      Swal.fire('Error', 'Please select an image for the awareness item', 'error');
      return;
    }
    
    setLoading(true);
    const data = new FormData();
    data.append('name', formData.name.trim());
    data.append('description', formData.description.trim());
    data.append('serviceAvailable', formData.serviceAvailable.trim());
    data.append('phoneNumber', formData.phoneNumber.trim());
    data.append('emergencyNumber', formData.emergencyNumber.trim());
    data.append('image', formData.image);

    try {
      const response = await axios.post('http://localhost:8000/api/awareness/addawareness', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      Swal.fire({
        icon: 'success',
        title: 'Awareness Item Added',
        text: `${formData.name} has been added successfully.`
      });
      
      // Reset form and close modal
      setFormData({
        name: '',
        description: '',
        serviceAvailable: '',
        phoneNumber: '',
        emergencyNumber: '',
        image: null,
        previewImage: null
      });
      setShowModal(false);
      
      // Notify parent component that a new item was added
      if (onAwarenessAdded) {
        onAwarenessAdded();
      }
    } catch (error) {
      console.error('Add awareness error:', error);
      let errorMessage = 'An error occurred while adding the awareness item';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Swal.fire({
        icon: 'error',
        title: 'Failed to Add Awareness Item',
        text: errorMessage
      });
    } finally {
      setLoading(false);
    }
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Add Awareness Item</h2>
            <button 
              onClick={() => setShowModal(false)}
              className="text-gray-400 hover:text-gray-700 text-2xl"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Image Upload */}
            <div className="flex flex-col items-center">
              <div className="mb-4">
                {formData.previewImage ? (
                  <img 
                    src={formData.previewImage} 
                    alt="Preview" 
                    className="w-32 h-32 rounded-lg object-cover border-4 border-green-100"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-lg bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">No image</span>
                  </div>
                )}
              </div>
              <label className="cursor-pointer bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
                <span>Upload Image *</span>
                <input 
                  type="file" 
                  name="image"
                  accept="image/*"
                  onChange={handleChange}
                  required
                  className="hidden"
                />
              </label>
              <p className="text-xs text-gray-500 mt-2">Max size: 5MB, Supported: JPG, PNG, GIF *Required</p>
            </div>

            {/* Name Field */}
            <div className="flex flex-col">
              <label htmlFor="name" className="text-sm font-medium text-gray-700 mb-1">Name*</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                placeholder="Enter awareness item name"
              />
            </div>

            {/* Description Field */}
            <div className="flex flex-col">
              <label htmlFor="description" className="text-sm font-medium text-gray-700 mb-1">Description*</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                required
                className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                placeholder="Enter awareness item description"
              />
            </div>

            {/* Legal Awareness Field */}
            <div className="flex flex-col">
              <label htmlFor="serviceAvailable" className="text-sm font-medium text-gray-700 mb-1">Legal Awareness*</label>
              <input
                type="text"
                id="serviceAvailable"
                name="serviceAvailable"
                value={formData.serviceAvailable}
                onChange={handleChange}
                required
                className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                placeholder="Enter legal awareness information"
              />
            </div>

            {/* Phone Number Field */}
            <div className="flex flex-col">
              <label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700 mb-1">Phone Number*</label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
                className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                placeholder="Enter phone number"
              />
            </div>

            {/* Emergency Number Field */}
            <div className="flex flex-col">
              <label htmlFor="emergencyNumber" className="text-sm font-medium text-gray-700 mb-1">Emergency Number*</label>
              <input
                type="tel"
                id="emergencyNumber"
                name="emergencyNumber"
                value={formData.emergencyNumber}
                onChange={handleChange}
                required
                className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                placeholder="Enter emergency number"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faSave} className="mr-2" />
                    Save Item
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// UpdateAwarenessModal component
const UpdateAwarenessModal = ({ showModal, setShowModal, item, onAwarenessUpdated }) => {
  const [formData, setFormData] = useState({
    name: item?.name || '',
    description: item?.description || '',
    serviceAvailable: item?.serviceAvailable || '',
    phoneNumber: item?.phoneNumber || '',
    emergencyNumber: item?.emergencyNumber || '',
    image: null,
    previewImage: item?.image || null
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || '',
        description: item.description || '',
        serviceAvailable: item.serviceAvailable || '',
        phoneNumber: item.phoneNumber || '',
        emergencyNumber: item.emergencyNumber || '',
        image: null,
        previewImage: item.image || null
      });
    }
  }, [item]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      const file = files[0];
      if (file) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          Swal.fire('Error', 'Please select an image file', 'error');
          return;
        }
        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          Swal.fire('Error', 'Image size should be less than 5MB', 'error');
          return;
        }
        setFormData({
          ...formData,
          [name]: file,
          previewImage: URL.createObjectURL(file)
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name.trim() || !formData.description.trim() || !formData.serviceAvailable.trim() || !formData.phoneNumber.trim() || !formData.emergencyNumber.trim()) {
      Swal.fire('Error', 'Name, Description, Legal Awareness, Phone Number, and Emergency Number are required fields', 'error');
      return;
    }
    
    setLoading(true);
    const data = new FormData();
    data.append('name', formData.name.trim());
    data.append('description', formData.description.trim());
    data.append('serviceAvailable', formData.serviceAvailable.trim());
    data.append('phoneNumber', formData.phoneNumber.trim());
    data.append('emergencyNumber', formData.emergencyNumber.trim());
    if (formData.image) data.append('image', formData.image);

    try {
      const response = await axios.put(`http://localhost:8000/api/awareness/updateawareness/${item.id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      Swal.fire({
        icon: 'success',
        title: 'Awareness Item Updated',
        text: `${formData.name}'s information has been updated successfully.`
      });
      
      // Close modal
      setShowModal(false);
      
      // Notify parent component that item was updated
      if (onAwarenessUpdated) {
        onAwarenessUpdated();
      }
    } catch (error) {
      console.error('Update awareness error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Failed to Update Awareness Item',
        text: error.response?.data?.message || 'An error occurred while updating the awareness item'
      });
    } finally {
      setLoading(false);
    }
  };

  if (!showModal || !item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Update Awareness Item</h2>
            <button 
              onClick={() => setShowModal(false)}
              className="text-gray-400 hover:text-gray-700 text-2xl"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Image Upload */}
            <div className="flex flex-col items-center">
              <div className="mb-4">
                {formData.previewImage ? (
                  <img 
                    src={formData.previewImage} 
                    alt="Preview" 
                    className="w-32 h-32 rounded-lg object-cover border-4 border-green-100"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-lg bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">No image</span>
                  </div>
                )}
              </div>
              <label className="cursor-pointer bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
                <span>Change Image</span>
                <input 
                  type="file" 
                  name="image"
                  accept="image/*"
                  onChange={handleChange}
                  className="hidden"
                />
              </label>
              <p className="text-xs text-gray-500 mt-2">Max size: 5MB, Supported: JPG, PNG, GIF</p>
            </div>

            {/* Name Field */}
            <div className="flex flex-col">
              <label htmlFor="name" className="text-sm font-medium text-gray-700 mb-1">Name*</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                placeholder="Enter awareness item name"
              />
            </div>

            {/* Description Field */}
            <div className="flex flex-col">
              <label htmlFor="description" className="text-sm font-medium text-gray-700 mb-1">Description*</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                required
                className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                placeholder="Enter awareness item description"
              />
            </div>

            {/* Legal Awareness Field */}
            <div className="flex flex-col">
              <label htmlFor="serviceAvailable" className="text-sm font-medium text-gray-700 mb-1">Legal Awareness*</label>
              <input
                type="text"
                id="serviceAvailable"
                name="serviceAvailable"
                value={formData.serviceAvailable}
                onChange={handleChange}
                required
                className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                placeholder="Enter legal awareness information"
              />
            </div>

            {/* Phone Number Field */}
            <div className="flex flex-col">
              <label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700 mb-1">Phone Number*</label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
                className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                placeholder="Enter phone number"
              />
            </div>

            {/* Emergency Number Field */}
            <div className="flex flex-col">
              <label htmlFor="emergencyNumber" className="text-sm font-medium text-gray-700 mb-1">Emergency Number*</label>
              <input
                type="tel"
                id="emergencyNumber"
                name="emergencyNumber"
                value={formData.emergencyNumber}
                onChange={handleChange}
                required
                className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                placeholder="Enter emergency number"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                    Updating...
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faSave} className="mr-2" />
                    Update Item
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// AwarenessData component
const AwarenessData = ({ awarenessData, currentPage, itemsPerPage, setAwarenessData, refreshAwarenessData }) => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const itemsToDisplay = awarenessData.slice(startIndex, endIndex);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleDelete = async (itemId) => {
    const result = await Swal.fire({
      icon: 'warning',
      title: 'Delete Awareness Item?',
      text: 'This action cannot be undone!',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:8000/api/awareness/deleteawareness/${itemId}`);
        const updatedItems = awarenessData.filter(item => item.id !== itemId);
        setAwarenessData(updatedItems);
        Swal.fire('Deleted!', 'The awareness item has been deleted.', 'success');
      } catch (error) {
        Swal.fire('Error', 'Failed to delete awareness item', 'error');
        console.error('Delete error:', error);
      }
    }
  };

  const handleToggleStatus = async (itemId) => {
    try {
      await axios.patch(`http://localhost:8000/api/awareness/toggleawareness/${itemId}`);
      refreshAwarenessData();
      Swal.fire('Success', 'Status updated successfully', 'success');
    } catch (error) {
      Swal.fire('Error', 'Failed to update status', 'error');
      console.error('Toggle status error:', error);
    }
  };

  const handleView = async (itemId) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/awareness/getawareness/${itemId}`);
      setSelectedItem(response.data.awareness);
      setShowViewModal(true);
    } catch (error) {
      console.error('Error fetching item details:', error);
      const item = awarenessData.find(i => i.id === itemId);
      setSelectedItem(item);
      setShowViewModal(true);
    }
  };

  const handleEdit = async (itemId) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/awareness/getawareness/${itemId}`);
      
      // Transform the API response to match our expected format
      const transformedItem = {
        id: response.data.awareness._id || response.data.awareness.id,
        name: response.data.awareness.name,
        description: response.data.awareness.description,
        serviceAvailable: response.data.awareness.serviceAvailable || '',
        phoneNumber: response.data.awareness.phoneNumber || '',
        emergencyNumber: response.data.awareness.emergencyNumber || '',
        image: response.data.awareness.image 
          ? (response.data.awareness.image.startsWith('http') ? response.data.awareness.image : `http://localhost:8000/${response.data.awareness.image}`)
          : 'https://via.placeholder.com/150'
      };
      
      setSelectedItem(transformedItem);
      setShowEditModal(true);
    } catch (error) {
      console.error('Error fetching item details:', error);
      const item = awarenessData.find(i => i.id === itemId);
      setSelectedItem(item);
      setShowEditModal(true);
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Legal Awareness</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {itemsToDisplay.map(item => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="h-12 w-12 rounded-lg object-cover border"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/default-image.jpg';
                    }}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{item.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {item.serviceAvailable || 'N/A'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {item.phoneNumber || 'N/A'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleToggleStatus(item.id)}
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {item.isActive ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    onClick={() => handleView(item.id)}
                    className="text-blue-500 hover:text-blue-700 mx-2" 
                    title="View"
                  >
                    <FontAwesomeIcon icon={faEye} />
                  </button>
                  <button
                    onClick={() => handleEdit(item.id)}
                    className="text-yellow-500 hover:text-yellow-700 mx-2" 
                    title="Edit"
                  >
                    <FontAwesomeIcon icon={faPen} />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-red-500 hover:text-red-700 mx-2" 
                    title="Delete"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View Item Modal */}
      {showViewModal && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Awareness Item Details</h2>
                <button 
                  onClick={() => setShowViewModal(false)}
                  className="text-gray-400 hover:text-gray-700 text-2xl"
                >
                  &times;
                </button>
              </div>

              <div className="flex flex-col gap-6">
                <div className="flex-shrink-0">
                  <img
                    src={
                      selectedItem.image
                        ? (selectedItem.image.startsWith('http') ? selectedItem.image : `http://localhost:8000/${selectedItem.image}`)
                        : '/default-image.jpg'
                    }
                    alt={selectedItem.name}
                    className="w-full h-48 rounded-lg object-cover border-4 border-green-100"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/default-image.jpg';
                    }}
                  />
                </div>

                <div className="flex-grow">
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-gray-800">{selectedItem.name}</h3>
                    <p className="text-green-600 font-medium">
                      {selectedItem.isActive ? 'Active' : 'Inactive'}
                    </p>
                  </div>

                  <div className="mt-6">
                    <h4 className="text-lg font-medium text-gray-800 mb-2">Description</h4>
                    <p className="text-gray-600 whitespace-pre-line">{selectedItem.description}</p>
                  </div>

                  <div className="mt-6">
                    <h4 className="text-lg font-medium text-gray-800 mb-2">Legal Awareness</h4>
                    <p className="text-gray-600">{selectedItem.serviceAvailable}</p>
                  </div>

                  <div className="mt-6">
                    <h4 className="text-lg font-medium text-gray-800 mb-2">Phone Number</h4>
                    <p className="text-gray-600">{selectedItem.phoneNumber}</p>
                  </div>

                  <div className="mt-6">
                    <h4 className="text-lg font-medium text-gray-800 mb-2">Emergency Number</h4>
                    <p className="text-gray-600">{selectedItem.emergencyNumber}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowViewModal(false)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Item Modal */}
      {showEditModal && selectedItem && (
        <UpdateAwarenessModal 
          showModal={showEditModal}
          setShowModal={setShowEditModal}
          item={selectedItem}
          onAwarenessUpdated={refreshAwarenessData}
        />
      )}
    </>
  );
};

// Main Awareness component
const Awareness = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [awarenessData, setAwarenessData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOption, setSortOption] = useState("newest");
  const [showAddModal, setShowAddModal] = useState(false);
  const itemsPerPage = 10;

  const fetchAwareness = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get('http://localhost:8000/api/awareness/getallawareness');
      const awarenessArray = response.data.awareness || [];
      
      if (!Array.isArray(awarenessArray)) throw new Error('No awareness data received');

      const transformedData = awarenessArray.map(item => ({
        id: item._id,
        name: item.name,
        description: item.description,
        serviceAvailable: item.serviceAvailable || '',
        phoneNumber: item.phoneNumber || '',
        emergencyNumber: item.emergencyNumber || '',
        image: item.image 
          ? (item.image.startsWith('http') ? item.image : `http://localhost:8000/${item.image}`)
          : 'https://via.placeholder.com/150',
        isActive: item.isActive,
        createdAt: item.createdAt || new Date().toISOString()
      }));

      setAwarenessData(transformedData);
    } catch (err) {
      console.error('Fetch awareness error:', err);
      setError(err.message || 'Failed to load awareness items');
      
      // Fallback to mock data if API fails
      const mockAwareness = [
        {
          id: 1,
          name: 'Women Empowerment Campaign',
          description: 'Raising awareness about women empowerment and gender equality.',
          image: 'https://via.placeholder.com/150',
          isActive: true,
          createdAt: '2023-01-15T10:00:00Z'
        },
        {
          id: 2,
          name: 'Education for All',
          description: 'Promoting education opportunities for women and girls.',
          image: 'https://via.placeholder.com/150',
          isActive: true,
          createdAt: '2023-02-20T10:00:00Z'
        },
      ];
      setAwarenessData(mockAwareness);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAwareness();
  }, []);

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const sortAwareness = (items) => {
    const sorted = [...items];
    switch (sortOption) {
      case "newest":
        return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case "oldest":
        return sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      case "name-asc":
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case "name-desc":
        return sorted.sort((a, b) => b.name.localeCompare(a.name));
      default:
        return sorted;
    }
  };

  const sortedAwareness = sortAwareness(awarenessData);
  const totalPages = Math.ceil(sortedAwareness.length / itemsPerPage);

  const handleAwarenessAdded = () => {
    fetchAwareness(); // refresh the list
  };

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold text-gray-800">Awareness Management</h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Add Awareness Item
          </button>
        </div>

        {/* Sort Filter */}
        <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <select
              value={sortOption}
              onChange={handleSortChange}
              className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
            </select>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <FontAwesomeIcon icon={faSpinner} spin size="2x" className="text-green-500" />
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex items-center text-red-700">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">Error: {error}</span>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded text-sm"
            >
              Retry
            </button>
          </div>
        ) : sortedAwareness.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-sm border text-center">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-1">
              No awareness items available
            </h3>
            <p className="text-gray-500 mb-4">
              Add your first awareness item to get started
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg text-sm"
            >
              Add Awareness Item
            </button>
          </div>
        ) : (
          <>
            <AwarenessData
              awarenessData={sortedAwareness}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              setAwarenessData={setAwarenessData}
              refreshAwarenessData={fetchAwareness}
            />

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <nav className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border rounded-md bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 border rounded-md ${currentPage === page ? 'bg-green-500 text-white border-green-500' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border rounded-md bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </div>

      {/* Add Awareness Item Modal */}
      <AddAwarenessModal 
        showModal={showAddModal}
        setShowModal={setShowAddModal}
        onAwarenessAdded={handleAwarenessAdded}
      />
    </AdminLayout>
  );
};

export default Awareness; 