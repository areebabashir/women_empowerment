import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEye, faPen, faTrash, faPlus, faSearch, faTimes, faSpinner, faSave, faToggleOn, faToggleOff,
  faHeart, faShield, faScaleBalanced, faBuilding, faMapPin, faGlobe, faUsers, faGraduationCap, faFileText
} from '@fortawesome/free-solid-svg-icons';
import AdminLayout from '../../layouts/AdminLayout';

const AwarenessEnhanced = () => {
  const [awarenessData, setAwarenessData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    description: '',
    serviceAvailable: '',
    phoneNumber: '',
    services: [],
    icon: 'Shield'
  });

  // Available icons for dropdown
  const availableIcons = [
    { value: 'Heart', label: 'Heart', icon: faHeart },
    { value: 'Shield', label: 'Shield', icon: faShield },
    { value: 'Scale', label: 'Scale', icon: faScaleBalanced },
    { value: 'Building', label: 'Building', icon: faBuilding },
    { value: 'MapPin', label: 'Map Pin', icon: faMapPin },
    { value: 'Globe', label: 'Globe', icon: faGlobe },
    { value: 'Users', label: 'Users', icon: faUsers },
    { value: 'GraduationCap', label: 'Graduation Cap', icon: faGraduationCap },
    { value: 'FileText', label: 'File Text', icon: faFileText }
  ];

  // Available services for multi-select
  const availableServices = [
    'Crisis intervention and emotional support',
    'Safety planning assistance',
    'Local shelter and resource referrals',
    'Legal advocacy information',
    '24/7 crisis counseling',
    'Medical and legal advocacy',
    'Support group referrals',
    'Online chat support available',
    'Family law and divorce assistance',
    'Employment discrimination cases',
    'Housing rights advocacy',
    'Immigration law support',
    'Text-based crisis counseling',
    'Suicide prevention support',
    'Mental health resource referrals',
    'Anonymous and confidential',
    'Sexual harassment reporting',
    'Wage discrimination claims',
    'Pregnancy discrimination support',
    'Workplace accommodation requests',
    'Tenant rights education',
    'Housing discrimination cases',
    'Eviction prevention assistance',
    'Accessible housing advocacy'
  ];

  useEffect(() => {
    fetchAwareness();
  }, []);

  const fetchAwareness = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8000/api/awareness/getallawareness');
      if (response.data.success) {
        setAwarenessData(response.data.awareness || []);
      } else {
        console.error('API returned error:', response.data);
        Swal.fire('Error', response.data.message || 'Failed to fetch awareness data', 'error');
      }
    } catch (error) {
      console.error('Error fetching awareness data:', error);
      Swal.fire('Error', error.response?.data?.message || 'Failed to fetch awareness data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setFormData({
      name: '',
      title: '',
      description: '',
      serviceAvailable: '',
      phoneNumber: '',
      services: [],
      icon: 'Shield'
    });
    setShowAddModal(true);
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setFormData({
      name: item.name || '',
      title: item.title || '',
      description: item.description || '',
      serviceAvailable: item.serviceAvailable || '',
      phoneNumber: item.phoneNumber || '',
      services: Array.isArray(item.services) ? item.services : [],
      icon: item.icon || 'Shield'
    });
    setShowEditModal(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        const response = await axios.delete(`http://localhost:8000/api/awareness/deleteawareness/${id}`);
        if (response.data.success) {
          Swal.fire('Deleted!', 'Awareness item has been deleted.', 'success');
          fetchAwareness();
        } else {
          Swal.fire('Error', response.data.message || 'Failed to delete item', 'error');
        }
      } catch (error) {
        console.error('Delete Error:', error);
        Swal.fire('Error', error.response?.data?.message || 'Failed to delete item', 'error');
      }
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      const response = await axios.patch(`http://localhost:8000/api/awareness/toggleawareness/${id}`);
      if (response.data.success) {
        fetchAwareness();
      } else {
        Swal.fire('Error', response.data.message || 'Failed to toggle status', 'error');
      }
    } catch (error) {
      console.error('Toggle Error:', error);
      Swal.fire('Error', error.response?.data?.message || 'Failed to toggle status', 'error');
    }
  };

  const handleServiceToggle = (service) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.description.trim() || !formData.serviceAvailable.trim() || !formData.phoneNumber.trim() || !formData.icon) {
      Swal.fire('Error', 'Required fields cannot be empty', 'error');
      return;
    }

    const data = {
      name: formData.name.trim(),
      title: formData.title.trim(),
      description: formData.description.trim(),
      serviceAvailable: formData.serviceAvailable.trim(),
      phoneNumber: formData.phoneNumber.trim(),
      services: JSON.stringify(formData.services),
      icon: formData.icon
    };

    try {
      if (showAddModal) {
        const response = await axios.post('http://localhost:8000/api/awareness/addawareness', data);
        if (response.data.success) {
          Swal.fire('Success', 'Awareness item added successfully', 'success');
        } else {
          Swal.fire('Error', response.data.message || 'Failed to add awareness item', 'error');
        }
      } else {
        const response = await axios.put(`http://localhost:8000/api/awareness/updateawareness/${selectedItem._id}`, data);
        if (response.data.success) {
          Swal.fire('Success', 'Awareness item updated successfully', 'success');
        } else {
          Swal.fire('Error', response.data.message || 'Failed to update awareness item', 'error');
        }
      }
      
      setShowAddModal(false);
      setShowEditModal(false);
      fetchAwareness();
    } catch (error) {
      console.error('API Error:', error);
      Swal.fire('Error', error.response?.data?.message || 'Operation failed', 'error');
    }
  };



  const filteredData = awarenessData.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.title && item.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
    item.serviceAvailable.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Awareness Management</h1>
          <button
            onClick={handleAdd}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2"
          >
            <FontAwesomeIcon icon={faPlus} />
            <span>Add Awareness</span>
          </button>
        </div>

        {/* Search */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name, title, or service..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-3 text-gray-400" />
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <FontAwesomeIcon icon={faSpinner} spin size="2x" className="text-blue-600" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Icon</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Organization</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredData.map((item) => (
                    <tr key={item._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {availableIcons.find(icon => icon.value === item.icon) && (
                          <FontAwesomeIcon 
                            icon={availableIcons.find(icon => icon.value === item.icon).icon} 
                            className="w-6 h-6 text-blue-600" 
                          />
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.title || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.serviceAvailable}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.phoneNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleStatus(item._id)}
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            item.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}
                        >
                          <FontAwesomeIcon icon={item.isActive ? faToggleOn : faToggleOff} className="mr-1" />
                          {item.isActive ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(item)}
                            className="text-green-600 hover:text-green-900"
                            title="Edit"
                          >
                            <FontAwesomeIcon icon={faPen} />
                          </button>
                          <button
                            onClick={() => handleDelete(item._id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete"
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Add/Edit Modal */}
        {(showAddModal || showEditModal) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  {showAddModal ? 'Add Awareness Item' : 'Edit Awareness Item'}
                </h2>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FontAwesomeIcon icon={faTimes} size="lg" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Organization Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter organization name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter title (optional)"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter description"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Service Available *</label>
                  <input
                    type="text"
                    value={formData.serviceAvailable}
                    onChange={(e) => setFormData({...formData, serviceAvailable: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter service available"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                    <input
                      type="text"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter phone number"
                      required
                    />
                  </div>

                </div>

                {/* Icon Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Icon *</label>
                  <select
                    value={formData.icon}
                    onChange={(e) => setFormData({...formData, icon: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    {availableIcons.map((iconOption) => (
                      <option key={iconOption.value} value={iconOption.value}>
                        {iconOption.label}
                      </option>
                    ))}
                  </select>
                  <div className="mt-2 flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Selected Icon:</span>
                    {availableIcons.find(icon => icon.value === formData.icon) && (
                      <FontAwesomeIcon 
                        icon={availableIcons.find(icon => icon.value === formData.icon).icon} 
                        className="w-6 h-6 text-blue-600" 
                      />
                    )}
                  </div>
                </div>

                {/* Services Multi-Select */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Services (Multi-select)</label>
                  <div className="border border-gray-300 rounded-md p-3 max-h-48 overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {availableServices.map((service) => (
                        <label key={service} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.services.includes(service)}
                            onChange={() => handleServiceToggle(service)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">{service}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  {formData.services.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-600">Selected Services ({formData.services.length}):</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {formData.services.map((service, index) => (
                          <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                            {service}
                            <button
                              type="button"
                              onClick={() => handleServiceToggle(service)}
                              className="ml-1 text-blue-600 hover:text-blue-800"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>



                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setShowEditModal(false);
                    }}
                    className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    <FontAwesomeIcon icon={faSave} className="mr-2" />
                    {showAddModal ? 'Add Awareness' : 'Update Awareness'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AwarenessEnhanced; 