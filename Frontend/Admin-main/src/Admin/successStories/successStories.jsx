import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
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
  faQuoteLeft,
  faCalendarDay
} from '@fortawesome/free-solid-svg-icons';
import AdminLayout from '../../layouts/AdminLayout';

const StoryData = ({ storyData, currentPage, itemsPerPage, setStoryData, onAddSuccess }) => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const storiesToDisplay = storyData.slice(startIndex, endIndex);
  const navigate = useNavigate();
  const [selectedStory, setSelectedStory] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleDelete = async (storyId) => {
    const result = await Swal.fire({
      icon: 'warning',
      title: 'Delete Success Story?',
      text: 'This action cannot be undone!',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:8000/api/successstories/deletestory/${storyId}`);
        const updatedStories = storyData.filter(story => story.id !== storyId);
        setStoryData(updatedStories);
        Swal.fire('Deleted!', 'The success story has been deleted.', 'success');
      } catch (error) {
        Swal.fire('Error', 'Failed to delete success story', 'error');
        console.error('Delete error:', error);
      }
    }
  };

  const handleView = async (storyId) => {
    console.log('👁️ View button clicked for story ID:', storyId);
    try {
      console.log('🌐 Making API call to:', `http://localhost:8000/api/successstories/getstory/${storyId}`);
      const response = await axios.get(`http://localhost:8000/api/successstories/getstory/${storyId}`);
      console.log('📡 API Response:', response.data);
      
      if (response.data.success && response.data.story) {
        console.log('✅ Setting selected story:', response.data.story);
        setSelectedStory(response.data.story);
        setShowModal(true);
      } else {
        console.error('❌ Invalid response format:', response.data);
        // Fallback to local data
        const story = storyData.find(s => s.id === storyId);
        console.log('🔄 Using fallback story data:', story);
        setSelectedStory(story);
        setShowModal(true);
      }
    } catch (error) {
      console.error('❌ Error fetching story details:', error);
      // Fallback to local data
      const story = storyData.find(s => s.id === storyId);
      console.log('🔄 Using fallback story data due to error:', story);
      setSelectedStory(story);
      setShowModal(true);
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Story Preview</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {storiesToDisplay.map(story => (
              <tr key={story.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <img 
                    src={story.img} 
                    alt={story.name} 
                    className="h-10 w-10 rounded-full object-cover border"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/default-profile.jpg';
                    }}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{story.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{story.position}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-500 line-clamp-2">
                    {story.story.substring(0, 100)}...
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    onClick={() => handleView(story.id)}
                    className="text-blue-500 hover:text-blue-700 mx-2" 
                    title="View"
                  >
                    <FontAwesomeIcon icon={faEye} />
                  </button>
                  <button
                    onClick={() => handleDelete(story.id)}
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

      {/* Story Detail Modal */}
      {console.log('🎭 Modal state - showModal:', showModal, 'selectedStory:', selectedStory)}
      {showModal && selectedStory && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              console.log('❌ Closing modal from backdrop click');
              setShowModal(false);
              setSelectedStory(null);
            }
          }}
        >
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Success Story Details</h2>
                <button 
                  onClick={() => {
                    console.log('❌ Closing modal');
                    setShowModal(false);
                    setSelectedStory(null);
                  }}
                  className="text-gray-400 hover:text-gray-700 text-2xl"
                >
                  &times;
                </button>
              </div>

              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0">
                  <img
                    src={
                      selectedStory.img
                        ? (selectedStory.img.startsWith('http') ? selectedStory.img : `http://localhost:8000/${selectedStory.img}`)
                        : '/default-profile.jpg'
                    }
                    alt={selectedStory.name}
                    className="h-32 w-32 rounded-full object-cover border-4 border-indigo-100 mx-auto"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/default-profile.jpg';
                    }}
                  />
                </div>

                <div className="flex-grow">
                  {console.log('📋 Rendering story details:', selectedStory)}
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-gray-800">{selectedStory.name}</h3>
                    <p className="text-indigo-600 font-medium">{selectedStory.position}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center">
                      <FontAwesomeIcon icon={faUserTie} className="text-gray-500 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Position</p>
                        <p className="text-gray-800">{selectedStory.position}</p>
                      </div>
                    </div>

                    {selectedStory.createdAt && (
                      <div className="flex items-center">
                        <FontAwesomeIcon icon={faCalendarDay} className="text-gray-500 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">Added On</p>
                          <p className="text-gray-800">
                            {new Date(selectedStory.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-lg font-medium text-gray-800 mb-2 flex items-center">
                      <FontAwesomeIcon icon={faQuoteLeft} className="text-indigo-500 mr-2" />
                      Their Story
                    </h4>
                    <p className="text-gray-600 whitespace-pre-line">{selectedStory.story}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => {
                    console.log('❌ Closing modal from bottom button');
                    setShowModal(false);
                    setSelectedStory(null);
                  }}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
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

const AddStoryModal = ({ show, onClose, onAddSuccess }) => {
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [story, setStory] = useState('');
  const [img, setImg] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !position || !story) {
      Swal.fire('Error', 'Please fill all fields', 'error');
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append('name', name);
    formData.append('position', position);
    formData.append('story', story);
    if (img) formData.append('img', img);
    try {
      await axios.post('http://localhost:8000/api/successstories/addstory', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      Swal.fire('Success', 'Success story added!', 'success');
      setName(''); setPosition(''); setStory(''); setImg(null);
      onAddSuccess && onAddSuccess();
      onClose();
    } catch (err) {
      Swal.fire('Error', err.response?.data?.message || 'Failed to add story', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-4 text-gray-400 hover:text-gray-700 text-2xl"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Add Success Story</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Name</label>
            <input type="text" className="w-full border rounded-lg px-3 py-2" value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Position</label>
            <input type="text" className="w-full border rounded-lg px-3 py-2" value={position} onChange={e => setPosition(e.target.value)} required />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Story</label>
            <textarea className="w-full border rounded-lg px-3 py-2" value={story} onChange={e => setStory(e.target.value)} rows={5} required />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Image</label>
            <input type="file" accept="image/*" className="w-full" onChange={e => setImg(e.target.files[0])} />
          </div>
          <div className="flex justify-end">
            <button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg disabled:opacity-50">
              {loading ? 'Adding...' : 'Add Story'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const SuccessStories = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [storyData, setStoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOption, setSortOption] = useState("newest");
  const itemsPerPage = 10;
  const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchStories = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('http://localhost:8000/api/successstories/getallstories');
      const storiesArray = Array.isArray(response.data) ? response.data : response.data.stories;
      if (!Array.isArray(storiesArray)) throw new Error('No stories data received');
      const transformedData = storiesArray.map(story => ({
        id: story._id,
        name: story.name,
        position: story.position,
        story: story.story,
        img: story.img 
          ? (story.img.startsWith('http') ? story.img : `http://localhost:8000/${story.img}`)
          : 'https://randomuser.me/api/portraits/lego/1.jpg',
        createdAt: story.createdAt || new Date().toISOString()
      }));
      setStoryData(transformedData);
    } catch (err) {
      setError(err.message || 'Failed to load success stories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const sortStories = (stories) => {
    const sorted = [...stories];
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

  const sortedStories = sortStories(storyData);
  const totalPages = Math.ceil(sortedStories.length / itemsPerPage);

  const handleAdd = () => {
    setShowAddModal(true);
  };

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold text-gray-800">Success Stories</h1>
          <button
            onClick={handleAdd}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Add Story
          </button>
        </div>
        <AddStoryModal show={showAddModal} onClose={() => setShowAddModal(false)} onAddSuccess={fetchStories} />
        
        {/* Sort Filter */}
        <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <select
              value={sortOption}
              onChange={handleSortChange}
              className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
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
            <FontAwesomeIcon icon={faSpinner} spin size="2x" className="text-indigo-500" />
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
        ) : sortedStories.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-sm border text-center">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-1">
              No success stories available
            </h3>
            <p className="text-gray-500 mb-4">
              Add your first success story to get started
            </p>
            <button
              onClick={handleAdd}
              className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg text-sm"
            >
              Add Success Story
            </button>
          </div>
        ) : (
          <>
            <StoryData
              storyData={sortedStories}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              setStoryData={setStoryData}
              onAddSuccess={fetchStories}
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
                      className={`px-3 py-1 border rounded-md ${currentPage === page ? 'bg-indigo-500 text-white border-indigo-500' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
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

export default SuccessStories;