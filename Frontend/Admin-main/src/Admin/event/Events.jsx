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
  faUser,
  faMapMarkerAlt,
  faClock,
  faUsers
} from "@fortawesome/free-solid-svg-icons";
import AdminLayout from "../../layouts/AdminLayout";

const EventsData = ({ eventsData, currentPage, itemsPerPage, setEventsData }) => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const eventsToDisplay = eventsData.slice(startIndex, endIndex);

  const [showParticipantsModal, setShowParticipantsModal] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [participantsLoading, setParticipantsLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventDetailsModal, setShowEventDetailsModal] = useState(false);
  const [selectedEventDetails, setSelectedEventDetails] = useState(null);

  const handleDelete = async (eventId) => {
    const result = await Swal.fire({
      icon: 'warning',
      title: 'Delete Event?',
      text: 'This action cannot be undone!',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:8000/api/events/delete/${eventId}`);

        const updatedEvents = eventsData.filter(event => event.id !== eventId);
        setEventsData(updatedEvents);
        Swal.fire('Deleted!', 'The event has been deleted.', 'success');
      } catch (error) {
        Swal.fire('Error', 'Failed to delete event', 'error');
        console.error('Delete error:', error);
      }
    }
  };

  const handleViewParticipants = async (eventId) => {
    setShowParticipantsModal(true);
    setParticipantsLoading(true);
    setSelectedEvent(eventId);
    try {
      const response = await axios.get(`http://localhost:8000/api/events/${eventId}/getallparticipants`);
      setParticipants(response.data.participants || []);
    } catch (error) {
      setParticipants([]);
    }
    setParticipantsLoading(false);
  };

  const handleViewEventDetails = (event) => {
    setSelectedEventDetails(event);
    setShowEventDetailsModal(true);
  };

  const [deletingId, setDeletingId] = useState(null);
  const handleDeleteParticipant = async (participantId) => {
    if (!selectedEvent) return;
    setDeletingId(participantId);
    try {
      await axios.delete(`http://localhost:8000/api/events/${selectedEvent}/participants`, {
        data: { participantId }
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
    a.download = 'participants.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {eventsToDisplay.map(event => (
        <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
          <div className="relative h-48 overflow-hidden">
            <img
              className="w-full h-full object-cover"
              src={event.image}
              alt={event.name}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/default-event-image.jpg';
              }}
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
              <h3 className="text-white font-semibold text-lg truncate">{event.name}</h3>
            </div>
          </div>

          <div className="p-4 flex flex-col flex-grow">
            <p className="text-gray-600 mb-4 line-clamp-3 flex-grow">
              {event.description || 'No description available'}
            </p>

            <div className="mt-auto">
              <div className="flex items-center text-sm text-gray-500 mb-2">
                <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                {new Date(event.date).toLocaleDateString()}
              </div>

              <div className="flex items-center text-sm text-gray-500 mb-2">
                <FontAwesomeIcon icon={faClock} className="mr-2" />
                {event.time || 'TBD'}
              </div>

              <div className="flex items-center text-sm text-gray-500 mb-4">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
                {event.location || 'Location not specified'}
              </div>

              <div className="flex justify-between items-center border-t pt-3">
                <span className={`px-3 py-1 text-xs rounded-full ${
                  new Date(event.date) > new Date() 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {new Date(event.date) > new Date() ? 'Upcoming' : 'Past Event'}
                </span>

                <div className="flex space-x-3">
                  <button
                    onClick={() => handleViewEventDetails(event)}
                    className="text-blue-500 hover:text-blue-700 transition-colors"
                    title="View Details"
                  >
                    <FontAwesomeIcon icon={faEye} />
                  </button>
                  <Link
                    to={`/Admin/Event/Update/${event.id}`}
                    className="text-yellow-500 hover:text-yellow-700 transition-colors"
                    title="Edit"
                  >
                    <FontAwesomeIcon icon={faPen} />
                  </Link>
                                   <Link
                    to={`/Admin/Event/Participants/${event.id}`}
                    className="text-indigo-500 hover:text-indigo-700 transition-colors"
                    title="Manage Participants"
                  >
                    <FontAwesomeIcon icon={faUsers} />
                  </Link>
                  <button
                    onClick={() => handleDelete(event.id)}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full relative">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold">Participants</h2>
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
            {participantsLoading ? (
              <div>Loading...</div>
            ) : participants.length === 0 ? (
              <div>No participants found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                      {/* Render other keys dynamically if present */}
                      {participants[0] && Object.keys(participants[0]).filter(key => !['name','email','phone','id','_id'].includes(key)).map(key => (
                        <th key={key} className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">{key}</th>
                      ))}
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {participants.map((p, idx) => (
                      <tr key={p.id || p._id || idx}>
                        <td className="px-4 py-2">{p.name}</td>
                        <td className="px-4 py-2">{p.email || 'N/A'}</td>
                        <td className="px-4 py-2">{p.phone || 'N/A'}</td>
                        {/* Render other keys dynamically if present */}
                        {participants[0] && Object.keys(participants[0]).filter(key => !['name','email','phone','id','_id'].includes(key)).map(key => (
                          <td key={key} className="px-4 py-2 text-xs text-gray-600">{p[key]}</td>
                        ))}
                        <td className="px-4 py-2 text-right">
                          <button
                            onClick={() => handleDeleteParticipant(p._id || p.id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
                            disabled={deletingId === (p._id || p.id)}
                          >
                            {deletingId === (p._id || p.id) ? 'Deleting...' : 'Delete'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Event Details Modal */}
      {showEventDetailsModal && selectedEventDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Event Details</h2>
              <button 
                onClick={() => setShowEventDetailsModal(false)} 
                className="text-gray-400 hover:text-gray-700 text-2xl"
              >
                &times;
              </button>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Event Image */}
              <div className="space-y-4">
                <div className="relative h-64 rounded-lg overflow-hidden">
                  <img
                    src={selectedEventDetails.image}
                    alt={selectedEventDetails.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/default-event-image.jpg';
                    }}
                  />
                </div>
                
                {/* Event Status */}
                <div className="flex items-center justify-between">
                  <span className={`px-4 py-2 text-sm rounded-full font-medium ${
                    new Date(selectedEventDetails.date) > new Date() 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {new Date(selectedEventDetails.date) > new Date() ? 'Upcoming Event' : 'Past Event'}
                  </span>
                  <span className="text-sm text-gray-500">
                    Created: {new Date(selectedEventDetails.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Event Information */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{selectedEventDetails.name}</h3>
                  <p className="text-gray-600 leading-relaxed">{selectedEventDetails.description}</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <FontAwesomeIcon icon={faCalendarAlt} className="text-blue-600 w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 uppercase tracking-wide">Date</p>
                      <p className="font-semibold text-gray-800">
                        {new Date(selectedEventDetails.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="bg-green-100 p-3 rounded-lg">
                      <FontAwesomeIcon icon={faClock} className="text-green-600 w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 uppercase tracking-wide">Time</p>
                      <p className="font-semibold text-gray-800">{selectedEventDetails.time || 'TBD'}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="bg-purple-100 p-3 rounded-lg">
                      <FontAwesomeIcon icon={faMapMarkerAlt} className="text-purple-600 w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 uppercase tracking-wide">Location</p>
                      <p className="font-semibold text-gray-800">{selectedEventDetails.location || 'Location not specified'}</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3 pt-4 border-t">
                  <Link
                    to={`/Admin/Event/Update/${selectedEventDetails.id}`}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                  >
                    <FontAwesomeIcon icon={faPen} />
                    <span>Edit Event</span>
                  </Link>
                  <button
                    onClick={() => {
                      setShowEventDetailsModal(false);
                      handleViewParticipants(selectedEventDetails.id);
                    }}
                    className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                  >
                    <FontAwesomeIcon icon={faUsers} />
                    <span>View Participants</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Events = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [eventsData, setEventsData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOption, setSortOption] = useState("upcoming");
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get('http://localhost:8000/api/events/getallevent');
        console.log('API Response:', response);
        
        // Handle different possible response structures
        let eventsArray = [];
        if (response.data && Array.isArray(response.data)) {
          // Direct array response
          eventsArray = response.data;
        } else if (response.data && response.data.events && Array.isArray(response.data.events)) {
          // Nested events array
          eventsArray = response.data.events;
        } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
          // Nested data array
          eventsArray = response.data.data;
        } else {
          throw new Error('No events data received or invalid data structure');
        }

        console.log('Events array from API:', eventsArray);
        
        const transformedData = eventsArray.map(event => {
          console.log('Processing event:', event);
          return {
            id: event._id || event.id,
            name: event.name,
            description: event.description,
            image: event.image
              ? (event.image.startsWith('http') ? event.image : `http://localhost:8000/uploads/${event.image}`)
              : '/default-event-image.jpg',
            date: event.date,
            time: event.time,
            location: event.location,
            createdAt: event.createdAt || new Date().toISOString()
          };
        });

        console.log('Transformed events data:', transformedData);
        setEventsData(transformedData);
      } catch (err) {
        console.error('Fetch events error:', err);
        setError(err.message || 'Failed to load events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
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

  const sortEvents = (events) => {
    const sorted = [...events];
    switch (sortOption) {
      case "upcoming":
        return sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
      case "past":
        return sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
      case "newest":
        return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case "oldest":
        return sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      default:
        return sorted;
    }
  };

  const filteredEvents = eventsData.filter(event =>
    event.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.location?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedAndFilteredEvents = sortEvents(filteredEvents);
  const totalPages = Math.ceil(sortedAndFilteredEvents.length / itemsPerPage);

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold text-gray-800">Manage Events</h1>
          <Link
            to="/Admin/Event/New"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            New Event
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
                placeholder="Search events..."
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
              <option value="upcoming">Upcoming First</option>
              <option value="past">Past First</option>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
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
        ) : sortedAndFilteredEvents.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-sm border text-center">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-1">
              {searchQuery ? 'No matching events found' : 'No events available'}
            </h3>
            <p className="text-gray-500 mb-4">
              {searchQuery ? 'Try a different search term' : 'Create your first event to get started'}
            </p>
            {!searchQuery && (
              <Link
                to="/Admin/Event/New"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm"
              >
                Create New Event
              </Link>
            )}
          </div>
        ) : (
          <>
            <EventsData
              eventsData={sortedAndFilteredEvents}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              setEventsData={setEventsData}
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

export default Events;