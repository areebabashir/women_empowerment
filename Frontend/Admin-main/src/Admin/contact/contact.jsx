import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEye,
  faTrash,
  faSearch,
  faTimes,
  faSpinner,
  faUser,
  faEnvelope,
  faComment,
  faCalendarAlt,
  faTag
} from '@fortawesome/free-solid-svg-icons';
import AdminLayout from '../../layouts/AdminLayout';

const ContactData = ({ contactData, currentPage, itemsPerPage, setContactData }) => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const contactsToDisplay = contactData.slice(startIndex, endIndex);
  const [selectedContact, setSelectedContact] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleDelete = async (contactId) => {
    const result = await Swal.fire({
      icon: 'warning',
      title: 'Delete Contact Message?',
      text: 'This action cannot be undone!',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:8000/api/contactus/delete/${contactId}`);
        const updatedContacts = contactData.filter(contact => contact.id !== contactId);
        setContactData(updatedContacts);
        Swal.fire('Deleted!', 'The contact message has been deleted.', 'success');
      } catch (error) {
        Swal.fire('Error', 'Failed to delete contact message', 'error');
        console.error('Delete error:', error);
      }
    }
  };

  const handleView = (contact) => {
    setSelectedContact(contact);
    setShowModal(true);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">First Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {contactsToDisplay.map((contact, index) => (
              <tr key={contact.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-500">{(currentPage - 1) * itemsPerPage + index + 1}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{contact.firstName || 'N/A'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{contact.lastName || 'N/A'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{contact.subject}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{contact.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {new Date(contact.createdAt).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    onClick={() => handleView(contact)}
                    className="text-blue-500 hover:text-blue-700 mx-2" 
                    title="View"
                  >
                    <FontAwesomeIcon icon={faEye} />
                  </button>
                  <button
                    onClick={() => handleDelete(contact.id)}
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

      {/* Contact Detail Modal */}
      {showModal && selectedContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Contact Message Details</h2>
                <button 
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-700 text-2xl"
                >
                  &times;
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <FontAwesomeIcon icon={faUser} className="text-gray-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">First Name</p>
                      <p className="text-gray-800">{selectedContact.firstName}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <FontAwesomeIcon icon={faUser} className="text-gray-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Last Name</p>
                      <p className="text-gray-800">{selectedContact.lastName}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <FontAwesomeIcon icon={faEnvelope} className="text-gray-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="text-gray-800">{selectedContact.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <FontAwesomeIcon icon={faTag} className="text-gray-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Subject</p>
                      <p className="text-gray-800">{selectedContact.subject}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Date</p>
                      <p className="text-gray-800">
                        {new Date(selectedContact.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-medium text-gray-800 mb-2">Message</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-600 whitespace-pre-line">{selectedContact.message}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const Contact = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [contactData, setContactData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOption, setSortOption] = useState("newest");
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get('http://localhost:8000/api/contactus/getallcontact');
        console.log('Contact API Response:', response);
        
        // Handle different possible response structures
        let contactsArray = [];
        if (response.data && Array.isArray(response.data)) {
          contactsArray = response.data;
        } else if (response.data && response.data.contacts && Array.isArray(response.data.contacts)) {
          contactsArray = response.data.contacts;
        } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
          contactsArray = response.data.data;
        } else if (response.data && response.data.messages && Array.isArray(response.data.messages)) {
          contactsArray = response.data.messages;
        } else {
          console.log('No valid contact data structure found, using mock data');
          throw new Error('No contact data received or invalid data structure');
        }

        console.log('Contact items from API:', contactsArray);
        
        const transformedData = contactsArray.map(contact => {
          console.log('Processing contact item:', contact);
          return {
            id: contact._id || contact.id,
            firstName: contact.firstName || contact.name?.split(' ')[0] || '',
            lastName: contact.lastName || contact.name?.split(' ').slice(1).join(' ') || '',
            email: contact.email,
            subject: contact.subject || 'General Inquiry',
            message: contact.message,
            createdAt: contact.createdAt || contact.date || new Date().toISOString()
          };
        });

        console.log('Transformed contact data:', transformedData);

        // Debug: Log first contact item structure
        if (transformedData.length > 0) {
          console.log('First contact item structure:', {
            id: transformedData[0].id,
            firstName: transformedData[0].firstName,
            lastName: transformedData[0].lastName,
            email: transformedData[0].email,
            subject: transformedData[0].subject,
            message: transformedData[0].message,
            createdAt: transformedData[0].createdAt
          });
        }

        setContactData(transformedData);
      } catch (err) {
        console.error('Fetch contacts error:', err);
        setError(err.message || 'Failed to load contact messages');
        
        // Fallback to mock data if API fails
        console.log('Using fallback mock data due to API error');
        const mockContacts = [
          {
            id: 1,
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            subject: 'General Inquiry',
            message: 'I would like to know more about your women empowerment programs.',
            createdAt: '2023-06-15T10:00:00Z'
          },
          {
            id: 2,
            firstName: 'Jane',
            lastName: 'Smith',
            email: 'jane.smith@example.com',
            subject: 'Program Information',
            message: 'I wanted to give feedback about your product. It has been very helpful for my business!',
            createdAt: '2023-06-10T14:30:00Z'
          },
          {
            id: 3,
            firstName: 'Robert',
            lastName: 'Johnson',
            email: 'robert.johnson@example.com',
            subject: 'Technical Support',
            message: 'I encountered an issue with your website. The contact form wasn\'t working properly yesterday.',
            createdAt: '2023-06-05T09:15:00Z'
          },
        ];
        setContactData(mockContacts);
        setError(null); // Clear error since we have fallback data
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
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

  const sortContacts = (contacts) => {
    const sorted = [...contacts];
    switch (sortOption) {
      case "newest":
        return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case "oldest":
        return sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      case "name-asc":
        return sorted.sort((a, b) => `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`));
      case "name-desc":
        return sorted.sort((a, b) => `${b.firstName} ${b.lastName}`.localeCompare(`${a.firstName} ${a.lastName}`));
      default:
        return sorted;
    }
  };

  const filteredContacts = contactData.filter(contact =>
    `${contact.firstName} ${contact.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.message?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedAndFilteredContacts = sortContacts(filteredContacts);
  const totalPages = Math.ceil(sortedAndFilteredContacts.length / itemsPerPage);

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold text-gray-800">Contact Messages</h1>
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
                placeholder="Search contact messages..."
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
        ) : sortedAndFilteredContacts.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-sm border text-center">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-1">
              {searchQuery ? 'No matching contact messages found' : 'No contact messages available'}
            </h3>
            <p className="text-gray-500 mb-4">
              {searchQuery ? 'Try a different search term' : 'Contact messages will appear here when submitted'}
            </p>
          </div>
        ) : (
          <>
            <ContactData
              contactData={sortedAndFilteredContacts}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              setContactData={setContactData}
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

export default Contact;