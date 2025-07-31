import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faSpinner,
  faCalendarAlt,
  faUser,
  faMapMarkerAlt,
  faClock,
  faUsers,
  faArrowLeft,
  faDownload,
  faTimes
} from "@fortawesome/free-solid-svg-icons";
import AdminLayout from "../../layouts/AdminLayout";

const EventParticipants = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [participantsLoading, setParticipantsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);

  const itemsPerPage = 10;

  // Fetch event details
  const fetchEvent = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/events/getevent/${eventId}`);
      setEvent(response.data.event || response.data);
    } catch (error) {
      console.error('Error fetching event:', error);
      setError('Failed to load event details');
    }
  };

  // Fetch participants for the event
  const fetchParticipants = async () => {
    try {
      setParticipantsLoading(true);
      const response = await axios.get(`http://localhost:8000/api/events/${eventId}/getallparticipants`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      setParticipants(response.data.participants || []);
    } catch (error) {
      console.error('Error fetching participants:', error);
      setParticipants([]);
    } finally {
      setParticipantsLoading(false);
    }
  };



  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      await Promise.all([
        fetchEvent(),
        fetchParticipants()
      ]);
      setLoading(false);
    };

    if (eventId) {
      initializeData();
    }
  }, [eventId]);





  // Download participants as CSV
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
    a.download = `event_participants_${event?.name || 'event'}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Filter participants based on search
  const filteredParticipants = participants.filter(participant =>
    participant.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    participant.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    participant.phone?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const participantsToDisplay = filteredParticipants.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredParticipants.length / itemsPerPage);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <FontAwesomeIcon icon={faSpinner} spin size="2x" className="text-blue-500" />
          <span className="ml-2">Loading event details...</span>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex items-center text-red-700">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">{error}</span>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="flex items-center space-x-4">
          <Link
              to="/Admin/Events"
              className="text-blue-600 hover:text-blue-700 transition-colors"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Event Participants</h1>
              {event && (
                <p className="text-gray-600">{event.name}</p>
              )}
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={downloadCSV}
              disabled={participants.length === 0}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
            >
              <FontAwesomeIcon icon={faDownload} className="mr-2" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Event Details Card */}
        {event && (
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-center space-x-4">
                <img
                  src={event.image ? (event.image.startsWith('http') ? event.image : `http://localhost:8000/uploads/images/${event.image}`) : '/default-event-image.jpg'}
                  alt={event.name}
                  className="w-16 h-16 object-cover rounded-lg"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/default-event-image.jpg';
                  }}
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{event.name}</h3>
                  <p className="text-gray-600 text-sm">{event.description}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-500" />
                  <span>{new Date(event.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FontAwesomeIcon icon={faClock} className="text-gray-500" />
                  <span>{event.time || 'TBD'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="text-gray-500" />
                  <span>{event.location || 'Location not specified'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FontAwesomeIcon icon={faUsers} className="text-gray-500" />
                  <span>{participants.length} participants</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search and Stats */}
        <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="relative flex-grow max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search participants..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600"
                >
                  <FontAwesomeIcon icon={faTimes} className="text-gray-400" />
                </button>
              )}
            </div>
            
            <div className="text-sm text-gray-600">
              {filteredParticipants.length} of {participants.length} participants
            </div>
          </div>
        </div>

        {/* Participants Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          {participantsLoading ? (
            <div className="flex justify-center items-center h-32">
              <FontAwesomeIcon icon={faSpinner} spin className="text-blue-500 text-xl" />
              <span className="ml-2">Loading participants...</span>
            </div>
          ) : participants.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FontAwesomeIcon icon={faUsers} className="text-4xl mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-700 mb-1">No participants yet</h3>
              <p className="text-gray-500 mb-4">No participants have enrolled in this event yet</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Participant</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined Date</th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {participantsToDisplay.map((participant) => (
                      <tr key={participant._id || participant.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <FontAwesomeIcon icon={faUser} className="text-gray-500" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{participant.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{participant.email || 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{participant.phone || 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full capitalize ${
                            participant.role === 'volunteer' ? 'bg-blue-100 text-blue-800' :
                            participant.role === 'donor' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {participant.role || 'member'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {participant.enrollmentDate ? new Date(participant.enrollmentDate).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {/* View participant details - no remove option */}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                      Showing {startIndex + 1} to {Math.min(endIndex, filteredParticipants.length)} of {filteredParticipants.length} results
                    </div>
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
                </div>
              )}
            </>
          )}
        </div>


      </div>
    </AdminLayout>
  );
};

export default EventParticipants; 