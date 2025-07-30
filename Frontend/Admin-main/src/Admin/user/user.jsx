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
  faPlus
} from "@fortawesome/free-solid-svg-icons";
import AdminLayout from "../../layouts/AdminLayout";

const API_BASE_URL = 'http://localhost:8000/api/users';

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
      case 'volunteer':
        return 'border-blue-500';
      case 'donor':
        return 'border-green-500';
      default:
        return 'border-gray-500';
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin':
        return <FontAwesomeIcon icon={faUserShield} className="text-purple-500" />;
      case 'volunteer':
        return <FontAwesomeIcon icon={faUserTie} className="text-blue-500" />;
      case 'donor':
        return <FontAwesomeIcon icon={faHandHoldingHeart} className="text-green-500" />;
      default:
        return <FontAwesomeIcon icon={faUser} className="text-gray-500" />;
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
        await axios.delete(`${API_BASE_URL}/delete/${userId}`, {
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

  const handleRoleChange = async (userId, newRole) => {
    try {
      setLoadingRoles(prev => ({ ...prev, [userId]: true }));
      
      await axios.put(
        `${API_BASE_URL}/update/${userId}/role`, 
        { role: newRole },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        }
      );
      
      setUsers(users.map(user => 
        user._id === userId ? { ...user, role: newRole } : user
      ));
    } catch (error) {
      Swal.fire('Error', error.response?.data?.message || 'Failed to update role', 'error');
    } finally {
      setLoadingRoles(prev => ({ ...prev, [userId]: false }));
    }
  };

  const handleView = (user) => {
    setSelectedUser(user);
    setShowViewModal(true);
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
                          src={(user.image || user.profileImage || user.avatar).startsWith('http') ? 
                            (user.image || user.profileImage || user.avatar) : 
                            `http://localhost:8000/uploads/${user.image || user.profileImage || user.avatar}`}
                          alt={user.name}
                          className="w-full h-full object-cover rounded-full"
                          onError={(e) => {
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
                      <div className={`text-xs px-2 py-1 rounded-full inline-block mt-1 ${
                        user.role === 'volunteer' ? 'bg-blue-100 text-blue-800' :
                        user.role === 'donor' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
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
                  <div className="relative">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user._id, e.target.value)}
                      disabled={loadingRoles[user._id]}
                      className="block appearance-none bg-white border border-gray-300 rounded-md px-3 py-1 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="member">Member</option>
                      <option value="volunteer">Volunteer</option>
                      <option value="donor">Donor</option>
                    </select>
                    {loadingRoles[user._id] && (
                      <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                        <FontAwesomeIcon icon={faSpinner} spin className="text-blue-500" />
                      </div>
                    )}
                  </div>
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
                          src={(selectedUser.image || selectedUser.profileImage || selectedUser.avatar).startsWith('http') ? 
                            (selectedUser.image || selectedUser.profileImage || selectedUser.avatar) : 
                            `http://localhost:8000/uploads/${selectedUser.image || selectedUser.profileImage || selectedUser.avatar}`}
                          alt={selectedUser.name}
                          className="w-full h-full object-cover rounded-full"
                          onError={(e) => {
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
                      <div className={`text-sm px-3 py-1 rounded-full inline-block mt-1 ${
                        selectedUser.role === 'volunteer' ? 'bg-blue-100 text-blue-800' :
                        selectedUser.role === 'donor' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
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
  const [roleFilter, setRoleFilter] = useState("all");
  const [loadingRoles, setLoadingRoles] = useState({});
  const itemsPerPage = 10;

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(`${API_BASE_URL}/getalluser`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      
      // Log the raw response to see the exact structure
     
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

      // Debug: Log all users and their roles
      

      // Filter out admin users - only show member, volunteer, and donor users
      const nonAdminUsers = usersData.filter(user => user.role !== 'admin');
      
      setUsers(nonAdminUsers);
    } catch (err) {
      console.error('Fetch users error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
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
    if (roleFilter !== "all" && user.role !== roleFilter) {
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

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-6">
        

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
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="all">All Roles</option>
              <option value="volunteer">Volunteer</option>
              <option value="donor">Donor</option>
              <option value="member">Member</option>
            </select>

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
              {roleFilter !== "all" && (
                <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                  Filtered by: {roleFilter}
                </span>
              )}
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