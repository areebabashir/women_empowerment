import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faSearch,
  faEye,
  faTrash,
  faPen,
  faTimes,
  faSpinner,
  faCalendarAlt,
  
  faMapMarkerAlt,
  faClock,
  faUsers,
  faBookOpen
} from "@fortawesome/free-solid-svg-icons";
import AdminLayout from "../../layouts/AdminLayout";
import { AuthToken } from '../../Api/Api';

const ProgramsData = ({ programsData, currentPage, itemsPerPage, setProgramsData }) => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const programsToDisplay = programsData.slice(startIndex, endIndex);

  const [showParticipantsModal, setShowParticipantsModal] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [participantsLoading, setParticipantsLoading] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);

  const [showViewModal, setShowViewModal] = useState(false);
  const [viewProgram, setViewProgram] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);

  const handleDelete = async (programId) => {
    const result = await Swal.fire({
      icon: 'warning',
      title: 'Delete Program?',
      text: 'This action cannot be undone!',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:8000/api/programs/delete/${programId}`, {
          headers: { 'Authorization': `Bearer ${AuthToken()}` }
        });

        const updatedPrograms = programsData.filter(program => program.id !== programId);
        setProgramsData(updatedPrograms);
        Swal.fire('Deleted!', 'The program has been deleted.', 'success');
      } catch (error) {
        Swal.fire('Error', 'Failed to delete program', 'error');
        console.error('Delete error:', error);
      }
    }
  };

  const handleViewParticipants = async (programId) => {
    setShowParticipantsModal(true);
    setParticipantsLoading(true);
    setSelectedProgram(programId);
    try {
      const response = await axios.get(`http://localhost:8000/api/programs/${programId}/participants`, {
        headers: { 'Authorization': `Bearer ${AuthToken()}` }
      });
      setParticipants(response.data.participants || []);
    } catch (error) {
      setParticipants([]);
    }
    setParticipantsLoading(false);
  };

  const handleView = async (programId) => {
    setShowViewModal(true);
    setViewLoading(true);
    try {
      const response = await axios.get(`http://localhost:8000/api/programs/getprogram/${programId}`, {
        headers: { 'Authorization': `Bearer ${AuthToken()}` }
      });
      setViewProgram(response.data.program || response.data);
    } catch (error) {
      setViewProgram(null);
    }
    setViewLoading(false);
  };

  const [deletingId, setDeletingId] = useState(null);
  const handleDeleteParticipant = async (participantId) => {
    if (!selectedProgram) return;
    setDeletingId(participantId);
    try {
      await axios.delete(`http://localhost:8000/api/programs/${selectedProgram}/deleteparticipants`, {
        data: { participantId },
        headers: { 'Authorization': `Bearer ${AuthToken()}` }
      });
      setParticipants(prev => prev.filter(p => p._id !== participantId && p.id !== participantId));
    } catch (error) {
      alert('Failed to delete participant');
    }
    setDeletingId(null);
  };

  // CSV download helper
  const downloadCSV = () => {
    if (!participants || participants.length === 0) return;
    const keys = Object.keys(participants[0]);
    const csvRows = [
      keys.join(','),
      ...participants.map(row => keys.map(k => '"' + (row[k] ? String(row[k]).replace(/"/g, '""') : '') + '"').join(','))
    ];
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'program_participants.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {programsToDisplay.map(program => (
        <div key={program.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
          <div className="relative h-48 overflow-hidden">
            <img
              className="w-full h-full object-cover"
              src={program.image}
              alt={program.name}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/default-program-image.jpg';
              }}
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
              <h3 className="text-white font-semibold text-lg truncate">{program.name}</h3>
              <p className="text-white/80 text-sm">{program.category}</p>
              {program.companyName && (
                <p className="text-white/60 text-xs mt-1">By: {program.companyName}</p>
              )}
            </div>
          </div>

          <div className="p-4 flex flex-col flex-grow">
            <p className="text-gray-600 mb-4 line-clamp-3 flex-grow">
              {program.description || 'No description available'}
            </p>

            <div className="mt-auto">
              <div className="flex items-center text-sm text-gray-500 mb-2">
                <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                {new Date(program.startDate).toLocaleDateString()} - {program.endDate ? new Date(program.endDate).toLocaleDateString() : 'Ongoing'}
              </div>

              <div className="flex items-center text-sm text-gray-500 mb-2">
                <FontAwesomeIcon icon={faClock} className="mr-2" />
                {program.schedule || 'Schedule varies'}
              </div>

              <div className="flex items-center text-sm text-gray-500 mb-4">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
                {program.location || 'Multiple locations'}
              </div>

              <div className="flex justify-between items-center border-t pt-3">
                <span className={`px-3 py-1 text-xs rounded-full ${
                  program.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : program.status === 'upcoming'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                }`}>
                  {program.status ? program.status.charAt(0).toUpperCase() + program.status.slice(1) : 'Inactive'}
                </span>

                <div className="flex space-x-3">
                  <button
                    onClick={() => handleView(program.id)}
                    className="text-blue-500 hover:text-blue-700 transition-colors"
                    title="View"
                  >
                    <FontAwesomeIcon icon={faEye} />
                  </button>
                  <Link
                    to={`/Admin/Program/Update/${program.id}`}
                    className="text-yellow-500 hover:text-yellow-700 transition-colors"
                    title="Edit"
                  >
                    <FontAwesomeIcon icon={faPen} />
                  </Link>
                  <Link
                    to={`/Admin/Program/Participants/${program.id}`}
                    className="text-indigo-500 hover:text-indigo-700 transition-colors"
                    title="Manage Participants"
                  >
                    <FontAwesomeIcon icon={faUsers} />
                  </Link>
                  <button
                    onClick={() => handleDelete(program.id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                    title="Delete"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Participants Modal */}
      {showParticipantsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-start p-6 border-b">
              <h2 className="text-xl font-bold">Program Participants</h2>
              <div className="flex gap-2">
                <button
                  onClick={downloadCSV}
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs"
                  disabled={!participants || participants.length === 0}
                  title="Download as CSV"
                >
                  Download CSV
                </button>
                <button onClick={() => setShowParticipantsModal(false)} className="text-gray-400 hover:text-gray-700 text-2xl">&times;</button>
              </div>
            </div>

            {/* Content with Scroll */}
            <div className="flex-1 overflow-hidden">
              {participantsLoading ? (
                <div className="flex justify-center items-center h-32">
                  <FontAwesomeIcon icon={faSpinner} spin className="text-blue-500 text-xl" />
                </div>
              ) : participants.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No participants enrolled in this program yet.
                </div>
              ) : (
                <div className="h-full overflow-auto">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50 sticky top-0 z-10">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Name</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Email</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Phone</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Enrollment Date</th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {participants.map((p, idx) => (
                          <tr key={p.id || p._id || idx} className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{p.name}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{p.email || 'N/A'}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{p.phone || 'N/A'}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                              {p.enrollmentDate ? new Date(p.enrollmentDate).toLocaleDateString() : 'N/A'}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-right text-sm">
                              <button
                                onClick={() => handleDeleteParticipant(p._id || p.id)}
                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs transition-colors"
                                disabled={deletingId === (p._id || p.id)}
                              >
                                {deletingId === (p._id || p.id) ? 'Removing...' : 'Remove'}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Footer with participant count */}
            {participants.length > 0 && (
              <div className="p-4 border-t bg-gray-50">
                <p className="text-sm text-gray-600 text-center">
                  Total Participants: <span className="font-semibold">{participants.length}</span>
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* View Program Modal */}
      {showViewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl"
              onClick={() => setShowViewModal(false)}
            >
              &times;
            </button>
            {viewLoading ? (
              <div className="flex justify-center items-center h-32">
                <FontAwesomeIcon icon={faSpinner} spin size="2x" className="text-blue-500" />
              </div>
            ) : viewProgram ? (
              <div>
                <h2 className="text-2xl font-bold mb-4 text-gray-800">{viewProgram.name || viewProgram.title}</h2>
                <img
                  src={viewProgram.image ? `http://localhost:8000/uploads/images/${viewProgram.image}` : '/default-program-image.jpg'}
                  alt={viewProgram.name || viewProgram.title}
                  className="h-48 w-full object-cover rounded mb-4"
                  onError={e => { e.target.onerror = null; e.target.src = '/default-program-image.jpg'; }}
                />
                <p className="mb-2"><strong>Description:</strong> {viewProgram.description}</p>
                <p className="mb-2"><strong>Category:</strong> {viewProgram.category || 'General Program'}</p>
                <p className="mb-2"><strong>Start Date:</strong> {viewProgram.startDate ? new Date(viewProgram.startDate).toLocaleDateString() : 'N/A'}</p>
                <p className="mb-2"><strong>End Date:</strong> {viewProgram.endDate ? new Date(viewProgram.endDate).toLocaleDateString() : 'Ongoing'}</p>
                <p className="mb-2"><strong>Schedule:</strong> {viewProgram.schedule || 'Schedule varies'}</p>
                <p className="mb-2"><strong>Location:</strong> {viewProgram.location || 'Multiple locations'}</p>
                <p className="mb-2"><strong>Status:</strong> {viewProgram.status ? viewProgram.status.charAt(0).toUpperCase() + viewProgram.status.slice(1) : 'Inactive'}</p>
              </div>
            ) : (
              <div className="text-center text-gray-500">Failed to load program details.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const Programs = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [programsData, setProgramsData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOption, setSortOption] = useState("active");
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        setLoading(true);
        setError(null);

        // Debug: Check if token exists
        const token = AuthToken();
        console.log('AuthToken value:', token);
        console.log('Token type:', typeof token);
        console.log('Token length:', token ? token.length : 0);

        if (!token) {
          throw new Error('No authentication token found. Please log in again.');
        }

        const response = await axios.get('http://localhost:8000/api/programs/admin/getallprograms', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!response.data || !response.data.programs) {
          throw new Error('No programs data received');
        }

        const transformedData = response.data.programs.map(program => ({
          id: program._id,
          name: program.title,
          description: program.description,
          category: program.category,
          companyName: program.companyId ? program.companyId.name : 'Admin Created',
          image: program.image
            ? `http://localhost:8000/uploads/images/${program.image}`
            : '/default-program-image.jpg',
          startDate: program.startingDate,
          endDate: program.endingDate,
          schedule: program.schedule,
          location: program.location,
          status: program.status || 'active',
          createdAt: program.createdAt || new Date().toISOString()
        }));

        setProgramsData(transformedData);
      } catch (err) {
        console.error('Fetch programs error:', err);
        setError(err.message || 'Failed to load programs');
        
        // Fallback to mock data if API fails (for demo purposes)
        const mockPrograms = [
          {
            id: 1,
            name: 'Youth Leadership Program',
            description: 'A comprehensive leadership development program for young adults',
            category: 'Leadership',
            image: '/default-program-image.jpg',
            startDate: '2023-09-01',
            endDate: '2023-12-15',
            schedule: 'Every Saturday 10am-2pm',
            location: 'Community Center',
            status: 'active',
            createdAt: '2023-06-15T10:00:00Z'
          },
          {
            id: 2,
            name: 'Coding Bootcamp',
            description: 'Intensive 12-week web development training program',
            category: 'Technology',
            image: '/default-program-image.jpg',
            startDate: '2023-10-01',
            endDate: '2023-12-31',
            schedule: 'Mon-Fri 9am-5pm',
            location: 'Tech Hub',
            status: 'upcoming',
            createdAt: '2023-07-20T10:00:00Z'
          },
          {
            id: 3,
            name: 'Women Entrepreneurship',
            description: 'Supporting women in starting and growing their businesses',
            category: 'Business',
            image: '/default-program-image.jpg',
            startDate: '2023-01-15',
            endDate: null,
            schedule: 'Bi-weekly workshops',
            location: 'Various locations',
            status: 'active',
            createdAt: '2022-11-10T10:00:00Z'
          },
        ];
        setProgramsData(mockPrograms);
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
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

  const sortPrograms = (programs) => {
    const sorted = [...programs];
    switch (sortOption) {
      case "active":
        return sorted.sort((a, b) => (a.status === 'active' && b.status !== 'active') ? -1 : 
          (a.status !== 'active' && b.status === 'active') ? 1 : 0);
      case "upcoming":
        return sorted.sort((a, b) => (a.status === 'upcoming' && b.status !== 'upcoming') ? -1 : 
          (a.status !== 'upcoming' && b.status === 'upcoming') ? 1 : 0);
      case "newest":
        return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case "oldest":
        return sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      case "name-asc":
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case "name-desc":
        return sorted.sort((a, b) => b.name.localeCompare(a.name));
      case "company-asc":
        return sorted.sort((a, b) => (a.companyName || '').localeCompare(b.companyName || ''));
      case "company-desc":
        return sorted.sort((a, b) => (b.companyName || '').localeCompare(a.companyName || ''));
      default:
        return sorted;
    }
  };

  const filteredPrograms = programsData.filter(program =>
    program.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    program.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    program.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    program.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    program.companyName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedAndFilteredPrograms = sortPrograms(filteredPrograms);
  const totalPages = Math.ceil(sortedAndFilteredPrograms.length / itemsPerPage);

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold text-gray-800">Manage Programs</h1>
          <Link
            to="/Admin/Program/New"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            New Program
          </Link>
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
                placeholder="Search programs..."
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
              <option value="active">Active First</option>
              <option value="upcoming">Upcoming First</option>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="company-asc">Company (A-Z)</option>
              <option value="company-desc">Company (Z-A)</option>
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
        ) : sortedAndFilteredPrograms.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-sm border text-center">
            <div className="text-gray-400 mb-4">
              <FontAwesomeIcon icon={faBookOpen} className="text-4xl" />
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-1">
              {searchQuery ? 'No matching programs found' : 'No programs available'}
            </h3>
            <p className="text-gray-500 mb-4">
              {searchQuery ? 'Try a different search term' : 'Create your first program to get started'}
            </p>
            {!searchQuery && (
              <Link
                to="/Admin/Program/New"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm"
              >
                Create New Program
              </Link>
            )}
          </div>
        ) : (
          <>
            <ProgramsData
              programsData={sortedAndFilteredPrograms}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              setProgramsData={setProgramsData}
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
    </AdminLayout>
  );
};

export default Programs;