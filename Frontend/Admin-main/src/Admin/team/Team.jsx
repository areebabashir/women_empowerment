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
  faUserTie,
  faSave
} from '@fortawesome/free-solid-svg-icons';
import AdminLayout from '../../layouts/AdminLayout';

// AddTeamModal component
const AddTeamModal = ({ showModal, setShowModal, onTeamAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    bio: '',
    pic: null,
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
    if (!formData.name.trim() || !formData.position.trim()) {
      Swal.fire('Error', 'Name and Position are required fields', 'error');
      return;
    }
    
    // Validate that an image is selected
    if (!formData.pic) {
      Swal.fire('Error', 'Please select an image for the team member', 'error');
      return;
    }
    
    setLoading(true);
    const data = new FormData();
    data.append('name', formData.name.trim());
    data.append('position', formData.position.trim());
    data.append('bio', formData.bio.trim());
    data.append('pic', formData.pic); // Always append pic since it's required

    try {
      const response = await axios.post('http://localhost:8000/api/teams/addteams', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      Swal.fire({
        icon: 'success',
        title: 'Team Member Added',
        text: `${formData.name} has been added to the team.`
      });
      
      // Reset form and close modal
      setFormData({
        name: '',
        position: '',
        bio: '',
        pic: '',
        previewImage:''
      });
      setShowModal(false);
      
      // Notify parent component that a new member was added
      if (onTeamAdded) {
        onTeamAdded();
      }
    } catch (error) {
      console.error('Add team member error:', error);
      console.error('Error response data:', error.response?.data);
      console.error('Error status:', error.response?.status);
      console.error('Error headers:', error.response?.headers);
      
      let errorMessage = 'An error occurred while adding the team member';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Swal.fire({
        icon: 'error',
        title: 'Failed to Add Team Member',
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
            <h2 className="text-2xl font-bold text-gray-800">Add Team Member</h2>
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
                    className="w-32 h-32 rounded-full object-cover border-4 border-blue-100"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">No image</span>
                  </div>
                )}
              </div>
              <label className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                <span>Upload Image *</span>
                <input 
                  type="file" 
                  name="pic"
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
                className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Enter member's name"
              />
            </div>

            {/* Position Field */}
            <div className="flex flex-col">
              <label htmlFor="position" className="text-sm font-medium text-gray-700 mb-1">Position*</label>
              <input
                type="text"
                id="position"
                name="position"
                value={formData.position}
                onChange={handleChange}
                required
                className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Enter member's position"
              />
            </div>

            {/* Bio Field */}
            <div className="flex flex-col">
              <label htmlFor="bio" className="text-sm font-medium text-gray-700 mb-1">Bio</label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows="3"
                className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Enter member's bio"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faSave} className="mr-2" />
                    Save Member
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

// UpdateTeamModal component
const UpdateTeamModal = ({ showModal, setShowModal, member, onTeamUpdated }) => {
  const [formData, setFormData] = useState({
    name: member?.name || '',
    position: member?.position || '',
    bio: member?.bio || '',
    pic: member?.pic || null,
    previewImage: member?.pic || null
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (member) {
      setFormData({
        name: member.name || '',
        position: member.position || '',
        bio: member.bio || '',
        pic: null,
        previewImage: member.pic || null // This should be the full URL from fetchTeam
      });
    }
  }, [member]);

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
    if (!formData.name.trim() || !formData.position.trim()) {
      Swal.fire('Error', 'Name and Position are required fields', 'error');
      return;
    }
    
    // Validate that an image is selected (either existing or new)
    if (!formData.pic && !formData.previewImage) {
      Swal.fire('Error', 'Please select an image for the team member', 'error');
      return;
    }
    
    setLoading(true);
    const data = new FormData();
    data.append('name', formData.name.trim());
    data.append('position', formData.position.trim());
    data.append('bio', formData.bio.trim());
    if (formData.pic) data.append('pic', formData.pic); // Only append if new image is selected

    try {
      const response = await axios.put(`http://localhost:8000/api/teams/updateteams/${member.id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      Swal.fire({
        icon: 'success',
        title: 'Team Member Updated',
        text: `${formData.name}'s information has been updated successfully.`
      });
      
      // Close modal
      setShowModal(false);
      
      // Notify parent component that member was updated
      if (onTeamUpdated) {
        onTeamUpdated();
      }
    } catch (error) {
      console.error('Update team member error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Failed to Update Team Member',
        text: error.response?.data?.message || 'An error occurred while updating the team member'
      });
    } finally {
      setLoading(false);
    }
  };

  if (!showModal || !member) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Update Team Member</h2>
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
                    className="w-32 h-32 rounded-full object-cover border-4 border-blue-100"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">No image</span>
                  </div>
                )}
              </div>
              <label className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                <span>Change Image *</span>
                <input 
                  type="file" 
                  name="pic"
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
                className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Enter member's name"
              />
            </div>

            {/* Position Field */}
            <div className="flex flex-col">
              <label htmlFor="position" className="text-sm font-medium text-gray-700 mb-1">Position*</label>
              <input
                type="text"
                id="position"
                name="position"
                value={formData.position}
                onChange={handleChange}
                required
                className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Enter member's position"
              />
            </div>

            {/* Bio Field */}
            <div className="flex flex-col">
              <label htmlFor="bio" className="text-sm font-medium text-gray-700 mb-1">Bio</label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows="3"
                className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Enter member's bio"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                    Updating...
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faSave} className="mr-2" />
                    Update Member
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

// TeamData component
const TeamData = ({ teamData, currentPage, itemsPerPage, setTeamData, refreshTeamData }) => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const teamToDisplay = teamData.slice(startIndex, endIndex);
  const [selectedMember, setSelectedMember] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleDelete = async (memberId) => {
    const result = await Swal.fire({
      icon: 'warning',
      title: 'Delete Team Member?',
      text: 'This action cannot be undone!',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:8000/api/teams/deleteteams/${memberId}`);
        const updatedTeam = teamData.filter(member => member.id !== memberId);
        setTeamData(updatedTeam);
        Swal.fire('Deleted!', 'The team member has been deleted.', 'success');
      } catch (error) {
        Swal.fire('Error', 'Failed to delete team member', 'error');
        console.error('Delete error:', error);
      }
    }
  };

  const handleView = async (memberId) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/teams/getteams/${memberId}`);
      setSelectedMember(response.data);
      setShowViewModal(true);
    } catch (error) {
      console.error('Error fetching member details:', error);
      const member = teamData.find(m => m.id === memberId);
      setSelectedMember(member);
      setShowViewModal(true);
    }
  };

  const handleEdit = async (memberId) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/teams/getteams/${memberId}`);
      
      // Transform the API response to match our expected format
      const transformedMember = {
        id: response.data._id || response.data.id,
        name: response.data.name,
        position: response.data.position,
        bio: response.data.bio,
        pic: response.data.pic 
          ? (response.data.pic.startsWith('http') ? response.data.pic : `http://localhost:8000/uploads/${response.data.pic}`)
          : 'https://randomuser.me/api/portraits/lego/1.jpg'
      };
      
      setSelectedMember(transformedMember);
      setShowEditModal(true);
    } catch (error) {
      console.error('Error fetching member details:', error);
      const member = teamData.find(m => m.id === memberId);
      setSelectedMember(member);
      setShowEditModal(true);
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Photo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {teamToDisplay.map(member => (
              <tr key={member.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <img 
                    src={member.pic} 
                    alt={member.name} 
                    className="h-10 w-10 rounded-full object-cover border"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/default-profile.jpg';
                    }}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{member.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{member.position}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    onClick={() => handleView(member.id)}
                    className="text-blue-500 hover:text-blue-700 mx-2" 
                    title="View"
                  >
                    <FontAwesomeIcon icon={faEye} />
                  </button>
                  <button
                    onClick={() => handleEdit(member.id)}
                    className="text-yellow-500 hover:text-yellow-700 mx-2" 
                    title="Edit"
                  >
                    <FontAwesomeIcon icon={faPen} />
                  </button>
                  <button
                    onClick={() => handleDelete(member.id)}
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

      {/* View Member Modal */}
      {showViewModal && selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Team Member Details</h2>
                <button 
                  onClick={() => setShowViewModal(false)}
                  className="text-gray-400 hover:text-gray-700 text-2xl"
                >
                  &times;
                </button>
              </div>

              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0">
                  <img
                    src={
                      selectedMember.pic
                        ? selectedMember.pic.startsWith('http')
                          ? selectedMember.pic
                          : `http://localhost:8000/uploads/${selectedMember.pic}`
                        : '/default-profile.jpg'
                    }
                    alt={selectedMember.name}
                    className="w-32 h-32 rounded-full object-cover border-4 border-blue-100 mx-auto"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/default-profile.jpg';
                    }}
                  />
                </div>

                <div className="flex-grow">
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-gray-800">{selectedMember.name}</h3>
                    <p className="text-blue-600 font-medium">{selectedMember.position}</p>
                  </div>

                  {selectedMember.bio && (
                    <div className="mt-6">
                      <h4 className="text-lg font-medium text-gray-800 mb-2">Bio</h4>
                      <p className="text-gray-600 whitespace-pre-line">{selectedMember.bio}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowViewModal(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Member Modal */}
      {showEditModal && selectedMember && (
        <UpdateTeamModal 
          showModal={showEditModal}
          setShowModal={setShowEditModal}
          member={selectedMember}
          onTeamUpdated={refreshTeamData}
        />
      )}
    </>
  );
};

// Main Team component
const Team = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [teamData, setTeamData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOption, setSortOption] = useState("newest");
  const [showAddModal, setShowAddModal] = useState(false);
  const itemsPerPage = 10;

  const fetchTeam = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get('http://localhost:8000/api/teams/getallteams');
      const teamArray = Array.isArray(response.data) ? response.data : response.data.team;
      
      if (!Array.isArray(teamArray)) throw new Error('No team data received');

      const transformedData = teamArray.map(member => ({
        id: member._id,
        name: member.name,
        position: member.position,
        pic: member.pic 
          ? (member.pic.startsWith('http') ? member.pic : `http://localhost:8000/uploads/${member.pic}`)
          : 'https://randomuser.me/api/portraits/lego/1.jpg',
        bio: member.bio,
        createdAt: member.createdAt || new Date().toISOString()
      }));

      setTeamData(transformedData);
    } catch (err) {
      console.error('Fetch team error:', err);
      setError(err.message || 'Failed to load team members');
      
      // Fallback to mock data if API fails
      const mockTeam = [
        {
          id: 1,
          name: 'Alice Johnson',
          position: 'Project Manager',
          pic: 'https://randomuser.me/api/portraits/women/44.jpg',
          bio: 'Alice is an experienced project manager with a passion for agile methodologies.',
          createdAt: '2023-01-15T10:00:00Z'
        },
        {
          id: 2,
          name: 'Bob Smith',
          position: 'Lead Developer',
          pic: 'https://randomuser.me/api/portraits/men/32.jpg',
          bio: 'Bob specializes in full-stack development and loves working with React and Node.js.',
          createdAt: '2023-02-20T10:00:00Z'
        },
      ];
      setTeamData(mockTeam);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const sortTeam = (team) => {
    const sorted = [...team];
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

  const filteredTeam = teamData.filter(member =>
    member.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.position?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedAndFilteredTeam = sortTeam(filteredTeam);
  const totalPages = Math.ceil(sortedAndFilteredTeam.length / itemsPerPage);

  const handleTeamAdded = (newMember) => {
    fetchTeam(); // refresh the list
    setSearchQuery(newMember.name); // set search to new member's name
  };

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold text-gray-800">Team Management</h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Add Team Member
          </button>
        </div>

        {/* Search and Filter */}
        <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search team members..."
                value={searchQuery}
                onChange={handleSearch}
                className="pl-10 pr-10 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600"
                >
                  <FontAwesomeIcon icon={faTimes} className="text-gray-400" />
                </button>
              )}
            </div>

            <select
              value={sortOption}
              onChange={handleSortChange}
              className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
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
            <FontAwesomeIcon icon={faSpinner} spin size="2x" className="text-blue-500" />
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
        ) : sortedAndFilteredTeam.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-sm border text-center">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-1">
              {searchQuery ? 'No matching team members found' : 'No team members available'}
            </h3>
            <p className="text-gray-500 mb-4">
              {searchQuery ? 'Try a different search term' : 'Add your first team member to get started'}
            </p>
            {!searchQuery && (
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm"
              >
                Add Team Member
              </button>
            )}
          </div>
        ) : (
          <>
            <TeamData
              teamData={sortedAndFilteredTeam}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              setTeamData={setTeamData}
              refreshTeamData={fetchTeam}
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
                      className={`px-3 py-1 border rounded-md ${currentPage === page ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
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

      {/* Add Team Member Modal */}
      <AddTeamModal 
        showModal={showAddModal}
        setShowModal={setShowAddModal}
        onTeamAdded={handleTeamAdded}
      />
    </AdminLayout>
  );
};

export default Team;