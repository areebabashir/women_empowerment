import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faEye,
  faTrash,
  faPen,
  faTimes,
  faSpinner,
  faUserShield,
  faUser,
  faUserTie,
  faHandHoldingHeart,
  faPlus,
  faBuilding,
  faUsers,
  faCheck,
  faFileText
} from "@fortawesome/free-solid-svg-icons";
import AdminLayout from "../../layouts/AdminLayout";

const API_BASE_URL = 'http://localhost:8000/api';

// Helper function to download documents
const downloadDocument = async (fileUrl, fileName) => {
  try {
    const response = await fetch(fileUrl);
    if (!response.ok) {
      throw new Error('Failed to download file');
    }
    
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Download error:', error);
    // Fallback to direct link
    window.open(fileUrl, '_blank');
  }
};

const UserTable = ({ users, currentPage, itemsPerPage, setUsers, loadingRoles, setLoadingRoles }) => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const usersToDisplay = users.slice(startIndex, endIndex);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const getRoleBorder = (role) => {
    switch (role) {
      case 'admin':
        return 'border-purple-500';
      case 'member':
        return 'border-blue-500';
      case 'trainee':
        return 'border-green-500';
      case 'company':
        return 'border-orange-500';
      case 'ngo':
        return 'border-purple-500';
      case 'donor':
        return 'border-red-500';
      default:
        return 'border-gray-500';
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin':
        return <FontAwesomeIcon icon={faUserShield} className="text-purple-500" />;
      case 'member':
        return <FontAwesomeIcon icon={faUser} className="text-blue-500" />;
      case 'trainee':
        return <FontAwesomeIcon icon={faUserTie} className="text-green-500" />;
      case 'company':
        return <FontAwesomeIcon icon={faBuilding} className="text-orange-500" />;
      case 'ngo':
        return <FontAwesomeIcon icon={faUsers} className="text-purple-500" />;
      case 'donor':
        return <FontAwesomeIcon icon={faHandHoldingHeart} className="text-red-500" />;
      default:
        return <FontAwesomeIcon icon={faUser} className="text-gray-500" />;
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'member':
        return 'bg-blue-100 text-blue-800';
      case 'trainee':
        return 'bg-green-100 text-green-800';
      case 'company':
        return 'bg-orange-100 text-orange-800';
      case 'ngo':
        return 'bg-purple-100 text-purple-800';
      case 'donor':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getApprovalBadgeColor = (approvalStatus) => {
    switch (approvalStatus) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDelete = async (userId) => {
    const result = await Swal.fire({
      icon: 'warning',
      title: 'Delete User?',
      text: 'This action cannot be undone!',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${API_BASE_URL}/users/delete/${userId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        });

        const updatedUsers = users.filter(user => user._id !== userId);
        setUsers(updatedUsers);
        Swal.fire('Deleted!', 'User has been deleted.', 'success');
      } catch (error) {
        Swal.fire('Error', error.response?.data?.message || 'Failed to delete user', 'error');
      }
    }
  };

  const handleView = (user) => {
    setSelectedUser(user);
    setShowViewModal(true);
  };

  const handleApprove = async (userId) => {
    const result = await Swal.fire({
      icon: 'question',
      title: 'Approve User?',
      text: 'This will allow the user to access their dashboard.',
      showCancelButton: true,
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Approve',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        await axios.put(`${API_BASE_URL}/users/approve/${userId}`, {}, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        });

        // Update the user in the list
        setUsers(users.map(user => 
          user._id === userId ? { ...user, isApproved: true, approvalStatus: 'approved' } : user
        ));
        
        Swal.fire('Approved!', 'User has been approved successfully.', 'success');
      } catch (error) {
        Swal.fire('Error', error.response?.data?.msg || 'Failed to approve user', 'error');
      }
    }
  };

  const handleReject = async (userId) => {
    const { value: rejectionReason } = await Swal.fire({
      icon: 'warning',
      title: 'Reject User?',
      text: 'Please provide a reason for rejection:',
      input: 'textarea',
      inputPlaceholder: 'Enter rejection reason...',
      inputValidator: (value) => {
        if (!value) {
          return 'You need to provide a rejection reason!';
        }
      },
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Reject',
      cancelButtonText: 'Cancel'
    });

    if (rejectionReason) {
      try {
        await axios.put(`${API_BASE_URL}/users/reject/${userId}`, 
          { rejectionReason }, 
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
          }
        );

        // Update the user in the list
        setUsers(users.map(user => 
          user._id === userId ? { 
            ...user, 
            isApproved: false, 
            approvalStatus: 'rejected',
            rejectionReason 
          } : user
        ));
        
        Swal.fire('Rejected!', 'User has been rejected.', 'success');
      } catch (error) {
        Swal.fire('Error', error.response?.data?.msg || 'Failed to reject user', 'error');
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {usersToDisplay.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className={`flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-2 ${getRoleBorder(user.role)}`}>
                      {(user.image || user.profileImage || user.avatar) ? (
                        <img
                          src={(() => {
                            const imagePath = user.image || user.profileImage || user.avatar;
                            if (imagePath.startsWith('http')) {
                              return imagePath;
                            } else if (imagePath.startsWith('uploads/')) {
                              return `http://localhost:8000/${imagePath}`;
                            } else {
                              return `http://localhost:8000/uploads/images/${imagePath}`;
                            }
                          })()}
                          alt={user.name}
                          className="w-full h-full object-cover rounded-full"
                          onError={(e) => {
                            console.log('Image failed to load:', e.target.src);
                            e.target.style.display = 'none';
                            const fallbackDiv = e.target.parentNode.querySelector('.fallback-icon');
                            if (fallbackDiv) {
                              fallbackDiv.style.display = 'flex';
                            }
                          }}
                        />
                      ) : null}
                      <div className={`fallback-icon ${(user.image || user.profileImage || user.avatar) ? 'hidden' : 'flex'} items-center justify-center w-full h-full`}>
                        {getRoleIcon(user.role)}
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      <div className={`text-xs px-2 py-1 rounded-full inline-block mt-1 ${getRoleBadgeColor(user.role)}`}>
                        {user.role}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.phone || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`text-sm px-3 py-1 rounded-full inline-block ${getRoleBadgeColor(user.role)}`}>
                    {user.role}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {(user.role === 'company' || user.role === 'ngo') ? (
                    <div className={`text-sm px-3 py-1 rounded-full inline-block ${getApprovalBadgeColor(user.approvalStatus)}`}>
                      {user.approvalStatus || 'pending'}
                    </div>
                  ) : (
                    <div className="text-sm px-3 py-1 rounded-full inline-block bg-green-100 text-green-800">
                      Approved
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => handleView(user)}
                      className="text-blue-500 hover:text-blue-700 transition-colors"
                      title="View"
                    >
                      <FontAwesomeIcon icon={faEye} />
                    </button>
                    {(user.role === 'company' || user.role === 'ngo') && user.approvalStatus === 'pending' && (
                      <>
                        <button
                          onClick={() => handleApprove(user._id)}
                          className="text-green-500 hover:text-green-700 transition-colors"
                          title="Approve"
                        >
                          <FontAwesomeIcon icon={faCheck} />
                        </button>
                        <button
                          onClick={() => handleReject(user._id)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                          title="Reject"
                        >
                          <FontAwesomeIcon icon={faTimes} />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
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

      {/* User Detail Modal */}
      {showViewModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-800">User Details</h2>
                <button 
                  onClick={() => setShowViewModal(false)}
                  className="text-gray-400 hover:text-gray-700 text-2xl"
                >
                  &times;
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* User Avatar and Basic Info */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className={`flex-shrink-0 h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-2 ${getRoleBorder(selectedUser.role)}`}>
                                             {(selectedUser.image || selectedUser.profileImage || selectedUser.avatar) ? (
                         <img
                           src={(() => {
                             const imagePath = selectedUser.image || selectedUser.profileImage || selectedUser.avatar;
                             if (imagePath.startsWith('http')) {
                               return imagePath;
                             } else if (imagePath.startsWith('uploads/')) {
                               return `http://localhost:8000/${imagePath}`;
                             } else {
                               return `http://localhost:8000/uploads/images/${imagePath}`;
                             }
                           })()}
                           alt={selectedUser.name}
                           className="w-full h-full object-cover rounded-full"
                           onError={(e) => {
                             console.log('Modal image failed to load:', e.target.src);
                             e.target.style.display = 'none';
                             const fallbackDiv = e.target.parentNode.querySelector('.modal-fallback-icon');
                             if (fallbackDiv) {
                               fallbackDiv.style.display = 'flex';
                             }
                           }}
                         />
                       ) : null}
                      <div className={`modal-fallback-icon ${(selectedUser.image || selectedUser.profileImage || selectedUser.avatar) ? 'hidden' : 'flex'} items-center justify-center w-full h-full`}>
                        {getRoleIcon(selectedUser.role)}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">{selectedUser.name}</h3>
                      <div className={`text-sm px-3 py-1 rounded-full inline-block mt-1 ${getRoleBadgeColor(selectedUser.role)}`}>
                        {selectedUser.role}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <FontAwesomeIcon icon={faUser} className="text-gray-500 w-4 h-4" />
                      <div>
                        <p className="text-sm text-gray-500">Full Name</p>
                        <p className="text-gray-800 font-medium">{selectedUser.name}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <FontAwesomeIcon icon={faUserTie} className="text-gray-500 w-4 h-4" />
                      <div>
                        <p className="text-sm text-gray-500">Role</p>
                        <p className="text-gray-800 font-medium capitalize">{selectedUser.role}</p>
                      </div>
                    </div>

                    {(selectedUser.role === 'company' || selectedUser.role === 'ngo') && (
                      <div className="flex items-center space-x-3">
                        <FontAwesomeIcon icon={faCheck} className="text-gray-500 w-4 h-4" />
                        <div>
                          <p className="text-sm text-gray-500">Approval Status</p>
                          <div className={`text-sm px-2 py-1 rounded-full inline-block ${getApprovalBadgeColor(selectedUser.approvalStatus)}`}>
                            {selectedUser.approvalStatus || 'pending'}
                          </div>
                        </div>
                      </div>
                    )}

                    {(selectedUser.role === 'company' || selectedUser.role === 'ngo') && selectedUser.approvalStatus === 'rejected' && selectedUser.rejectionReason && (
                      <div className="flex items-center space-x-3">
                        <FontAwesomeIcon icon={faTimes} className="text-gray-500 w-4 h-4" />
                        <div>
                          <p className="text-sm text-gray-500">Rejection Reason</p>
                          <p className="text-gray-800 font-medium">{selectedUser.rejectionReason}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-800">Contact Information</h4>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <FontAwesomeIcon icon={faUser} className="text-gray-500 w-4 h-4" />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="text-gray-800 font-medium">{selectedUser.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <FontAwesomeIcon icon={faUser} className="text-gray-500 w-4 h-4" />
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="text-gray-800 font-medium">{selectedUser.phone || 'Not provided'}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <FontAwesomeIcon icon={faUser} className="text-gray-500 w-4 h-4" />
                      <div>
                        <p className="text-sm text-gray-500">Member Since</p>
                        <p className="text-gray-800 font-medium">
                          {new Date(selectedUser.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* NGO Documents Section */}
                {selectedUser.role === 'ngo' && (
                  <div className="mt-6">
                    <h4 className="text-lg font-semibold text-gray-800 mb-3">NGO Documents</h4>
                    {selectedUser.documents && selectedUser.documents.length > 0 ? (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="space-y-2">
                          {selectedUser.documents.map((doc, index) => {
                            const fileName = doc.split('/').pop() || `Document ${index + 1}`;
                            const fileUrl = doc.startsWith('http') ? doc : `http://localhost:8000/${doc}`;
                            
                            return (
                              <div key={index} className="flex items-center justify-between p-3 bg-white rounded border hover:shadow-sm transition-shadow">
                                <div className="flex items-center space-x-3">
                                  <FontAwesomeIcon icon={faFileText} className="text-blue-500 w-5 h-5" />
                                  <div>
                                    <span className="text-sm font-medium text-gray-700">
                                      {fileName}
                                    </span>
                                    <p className="text-xs text-gray-500">
                                      Document {index + 1} of {selectedUser.documents.length}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex space-x-2">
                                  <a
                                    href={fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800 text-sm font-medium px-3 py-1 rounded border border-blue-200 hover:bg-blue-50 transition-colors"
                                  >
                                    View
                                  </a>
                                  <button
                                    onClick={() => downloadDocument(fileUrl, fileName)}
                                    className="text-green-600 hover:text-green-800 text-sm font-medium px-3 py-1 rounded border border-green-200 hover:bg-green-50 transition-colors"
                                  >
                                    Download
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        <div className="mt-3 text-xs text-gray-500">
                          Total documents: {selectedUser.documents.length}
                        </div>
                      </div>
                    ) : (
                      <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                        <div className="flex items-center space-x-2">
                          <FontAwesomeIcon icon={faFileText} className="text-yellow-500 w-4 h-4" />
                          <span className="text-sm text-yellow-700">
                            No documents uploaded yet
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
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
    </div>
  );
};

const Users = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOption, setSortOption] = useState("newest");
  const [roleFilter, setRoleFilter] = useState("member");
  const [loadingRoles, setLoadingRoles] = useState({});
  const itemsPerPage = 10;

  // Check authentication on component mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      // Redirect to login if no token
      window.location.href = '/login';
      return;
    }
    
    // Check if user data exists and is admin
    const userData = localStorage.getItem('userData');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        if (user.role !== 'admin') {
          // Redirect to login if not admin
          localStorage.removeItem('authToken');
          localStorage.removeItem('userData');
          window.location.href = '/login';
          return;
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        window.location.href = '/login';
        return;
      }
    }
    
    // If authenticated, fetch users
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      // Debug: Check if token exists
      const token = localStorage.getItem('authToken');
      console.log('Auth token:', token ? 'Token exists' : 'No token found');
      
      if (!token) {
        setError('No authentication token found. Please log in.');
        setLoading(false);
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/users/getalluser`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Check if response.data is an array or if it's nested in a property
      let usersData = response.data;
      
      // If response.data is not an array, check if it's nested in a property
      if (!Array.isArray(response.data)) {
        console.log('Response.data is not an array, checking for nested structure...');
        if (response.data && response.data.users && Array.isArray(response.data.users)) {
          usersData = response.data.users;
        } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
          usersData = response.data.data;
        } else {
          throw new Error('No users data received');
        }
      }

      // Filter out admin users - only show member, trainee, company, ngo, and donor users
      const nonAdminUsers = usersData.filter(user => user.role !== 'admin');
      
      setUsers(nonAdminUsers);
    } catch (err) {
      console.error('Fetch users error:', err);
      console.error('Error response:', err.response?.data);
      console.error('Error status:', err.response?.status);
      
      if (err.response?.status === 401) {
        setError('Authentication failed. Please log in again.');
      } else {
        setError(err.response?.data?.message || err.message || 'Failed to load users');
      }
    } finally {
      setLoading(false);
    }
  };

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

  const handleRoleFilterChange = (role) => {
    setRoleFilter(role);
    setCurrentPage(1);
  };

  const sortUsers = (users) => {
    const sorted = [...users];
    switch (sortOption) {
      case "newest":
        return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case "oldest":
        return sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      case "name-asc":
        return sorted.sort((a, b) => a.name?.localeCompare(b.name));
      case "name-desc":
        return sorted.sort((a, b) => b.name?.localeCompare(a.name));
      default:
        return sorted;
    }
  };

  const filteredUsers = users.filter(user => {
    // First apply role filter
    if (user.role !== roleFilter) {
      return false;
    }
    
    // Then apply search filter
    return user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
           user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
           user.role?.toLowerCase().includes(searchQuery.toLowerCase()) ||
           (user.phone && user.phone.toLowerCase().includes(searchQuery.toLowerCase()));
  });

  const sortedAndFilteredUsers = sortUsers(filteredUsers);
  const totalPages = Math.ceil(sortedAndFilteredUsers.length / itemsPerPage);

  // Get counts for each role
  const roleCounts = {
    member: users.filter(user => user.role === 'member').length,
    trainee: users.filter(user => user.role === 'trainee').length,
    company: users.filter(user => user.role === 'company').length,
    ngo: users.filter(user => user.role === 'ngo').length,
    donor: users.filter(user => user.role === 'donor').length,
  };

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-6">
        
        {/* Role Filter Tabs */}
        <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleRoleFilterChange("member")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                roleFilter === "member"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Members ({roleCounts.member})
            </button>
            <button
              onClick={() => handleRoleFilterChange("trainee")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                roleFilter === "trainee"
                  ? "bg-green-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Trainees ({roleCounts.trainee})
            </button>
            <button
              onClick={() => handleRoleFilterChange("company")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                roleFilter === "company"
                  ? "bg-orange-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Companies ({roleCounts.company})
            </button>
            <button
              onClick={() => handleRoleFilterChange("ngo")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                roleFilter === "ngo"
                  ? "bg-purple-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              NGOs ({roleCounts.ngo})
            </button>
            <button
              onClick={() => handleRoleFilterChange("donor")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                roleFilter === "donor"
                  ? "bg-red-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Donors ({roleCounts.donor})
            </button>
          </div>
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
                placeholder="Search users by name, email, or role..."
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
            <span className="ml-2">Loading users...</span>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
            <div className="flex items-center text-red-700">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">{error}</span>
            </div>
            <button
              onClick={fetchUsers}
              className="mt-2 bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded text-sm"
            >
              Retry
            </button>
          </div>
        ) : sortedAndFilteredUsers.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-sm border text-center">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-1">
              {searchQuery ? 'No matching users found' : 'No users available'}
            </h3>
            <p className="text-gray-500 mb-4">
              {searchQuery ? 'Try a different search term' : 'Create your first user to get started'}
            </p>
            {!searchQuery && (
              <Link
                to="/Admin/Users/New"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm"
              >
                Add New User
              </Link>
            )}
          </div>
        ) : (
          <>
            <div className="mb-4 text-sm text-gray-500">
              Showing {Math.min(itemsPerPage, sortedAndFilteredUsers.length)} of {sortedAndFilteredUsers.length} users
              <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                Filtered by: {roleFilter}
              </span>
            </div>
            
            <UserTable
              users={sortedAndFilteredUsers}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              setUsers={setUsers}
              loadingRoles={loadingRoles}
              setLoadingRoles={setLoadingRoles}
            />

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center mt-8">
                <div className="text-sm text-gray-500">
                  Page {currentPage} of {totalPages}
                </div>
                <nav className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border rounded-md bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>

                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-3 py-1 border rounded-md ${currentPage === pageNum ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

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
    </AdminLayout>
  );
};

export default Users;