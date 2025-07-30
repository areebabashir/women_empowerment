import React, { useState, useEffect } from 'react';
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
  faPlay,
  faPause,
  faUser,
  faClock
} from "@fortawesome/free-solid-svg-icons";
import AdminLayout from "../../layouts/AdminLayout";

const getVideoUrl = (video) => {
  if (!video) return '';
  if (video.startsWith('http')) return video;
  return `http://localhost:8000/uploads/${video}`;
};

const PodcastData = ({ podcastData, currentPage, itemsPerPage, setPodcastData }) => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const itemsToDisplay = podcastData.slice(startIndex, endIndex);

  const [showPodcastModal, setShowPodcastModal] = useState(false);
  const [selectedPodcast, setSelectedPodcast] = useState(null);

  const handleDelete = async (podcastId) => {
    const result = await Swal.fire({
      icon: 'warning',
      title: 'Delete Podcast?',
      text: 'This action cannot be undone!',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:8000/api/podcasts/delete/${podcastId}`);

        const updatedPodcasts = podcastData.filter(item => item.id !== podcastId);
        setPodcastData(updatedPodcasts);
        Swal.fire('Deleted!', 'The podcast has been deleted.', 'success');
      } catch (error) {
        Swal.fire('Error', 'Failed to delete podcast', 'error');
        console.error('Delete error:', error);
      }
    }
  };

  const handleTogglePublish = async (podcastId, currentStatus) => {
    try {
      const response = await axios.patch(`http://localhost:8000/api/podcasts/toggle-publish/${podcastId}`);
      
      if (response.status === 200) {
        const updatedPodcasts = podcastData.map(item => 
          item.id === podcastId 
            ? { ...item, isPublished: !currentStatus }
            : item
        );
        setPodcastData(updatedPodcasts);
        
        Swal.fire(
          'Success!', 
          `Podcast ${!currentStatus ? 'published' : 'unpublished'} successfully.`, 
          'success'
        );
      }
    } catch (error) {
      Swal.fire('Error', 'Failed to update publish status', 'error');
      console.error('Toggle publish error:', error);
    }
  };

  const handleViewPodcast = (podcast) => {
    setSelectedPodcast(podcast);
    setShowPodcastModal(true);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {itemsToDisplay.map(episode => (
        <div key={episode.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col">
          {episode.video && (
            <video controls className="w-full h-48 object-cover bg-black" src={getVideoUrl(episode.video)} />
          )}
          <div className="p-6 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-semibold text-gray-800 flex-1">{episode.name}</h3>
                <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">Ep. {episode.episodeNumber}</span>
              </div>
              <p className="text-gray-600 mb-2 line-clamp-2">{episode.description}</p>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-2">
                <span>Guest: <span className="font-medium text-gray-700">{episode.guest}</span></span>
                <span>Duration: {episode.duration}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              <button
                onClick={() => handleViewPodcast(episode)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg flex items-center transition-colors"
              >
                <FontAwesomeIcon icon={faEye} className="mr-2" />
                View
              </button>
              <button
                onClick={() => handleTogglePublish(episode.id, episode.isPublished)}
                className={`px-3 py-2 rounded-lg flex items-center transition-colors ${
                  episode.isPublished 
                    ? 'bg-orange-500 hover:bg-orange-600 text-white' 
                    : 'bg-green-500 hover:bg-green-600 text-white'
                }`}
              >
                <FontAwesomeIcon icon={episode.isPublished ? faPause : faPlay} className="mr-2" />
                {episode.isPublished ? 'Unpublish' : 'Publish'}
              </button>
              <Link
                to={`/Admin/Podcast/Update/${episode.id}`}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded-lg flex items-center transition-colors"
              >
                <FontAwesomeIcon icon={faPen} className="mr-2" />
                Edit
              </Link>
              <button
                onClick={() => handleDelete(episode.id)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg flex items-center transition-colors"
              >
                <FontAwesomeIcon icon={faTrash} className="mr-2" />
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
      
      {/* Podcast Details Modal */}
      {showPodcastModal && selectedPodcast && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-800">Podcast Details</h2>
              <button
                onClick={() => setShowPodcastModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FontAwesomeIcon icon={faTimes} size="lg" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{selectedPodcast.name}</h3>
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                  <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">Episode {selectedPodcast.episodeNumber}</span>
                  <span className="flex items-center">
                    <FontAwesomeIcon icon={faUser} className="mr-1" />
                    {selectedPodcast.guest}
                  </span>
                  <span className="flex items-center">
                    <FontAwesomeIcon icon={faClock} className="mr-1" />
                    {selectedPodcast.duration}
                  </span>
                </div>
                <p className="text-gray-700 mb-4">{selectedPodcast.description}</p>
              </div>
              
              <div className="mb-6">
                <h4 className="font-semibold text-gray-800 mb-2">Video</h4>
                {selectedPodcast.video ? (
                  <video controls className="w-full max-h-64 rounded" src={getVideoUrl(selectedPodcast.video)}>
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <p className="text-sm text-gray-600 break-all">No video available</p>
                )}
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Status: 
                  <span className={`ml-1 px-2 py-1 rounded text-xs ${
                    selectedPodcast.isPublished 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {selectedPodcast.isPublished ? 'Published' : 'Unpublished'}
                  </span>
                </span>
                <span>Created: {new Date(selectedPodcast.date).toLocaleDateString()}</span>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 p-6 border-t">
              <button
                onClick={() => setShowPodcastModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Close
              </button>
              <Link
                to={`/Admin/Podcast/Update/${selectedPodcast.id}`}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
              >
                <FontAwesomeIcon icon={faPen} className="mr-2" />
                Edit
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Podcast = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [podcastData, setPodcastData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOption, setSortOption] = useState("newest");
  const [filterOption, setFilterOption] = useState("all");
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchPodcasts = async () => {
      try {
        setLoading(true);
        setError(null);

        let url = 'http://localhost:8000/api/podcasts/getallpodcasts';
        
        const response = await axios.get(url);
        
        console.log('API Response:', response);
        
        // Handle different possible response structures
        let itemsArray = [];
        if (response.data && Array.isArray(response.data)) {
          itemsArray = response.data;
        } else if (response.data && response.data.podcasts && Array.isArray(response.data.podcasts)) {
          itemsArray = response.data.podcasts;
        } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
          itemsArray = response.data.data;
        } else {
          throw new Error('No podcast data received or invalid data structure');
        }

        console.log('Podcast items from API:', itemsArray);
        
        const transformedData = itemsArray.map(item => {
          console.log('Processing item:', item);
          return {
            id: item._id || item.id,
            name: item.name,
            description: item.description,
            video: item.video,
            category: item.category,
            guest: item.guest,
            duration: item.duration,
            episodeNumber: item.episodeNumber,
            isPublished: item.isPublished || false,
            date: item.date || item.createdAt || new Date().toISOString()
          };
        });

        console.log('Transformed podcast data:', transformedData);
        setPodcastData(transformedData);
      } catch (err) {
        console.error('Fetch podcasts error:', err);
        setError(err.message || 'Failed to load podcast episodes');
      } finally {
        setLoading(false);
      }
    };

    fetchPodcasts();
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

  const handleFilterChange = (e) => {
    setFilterOption(e.target.value);
    setCurrentPage(1);
  };

  const sortItems = (items) => {
    const sorted = [...items];
    switch (sortOption) {
      case "newest":
        return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case "oldest":
        return sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      case "title-asc":
        return sorted.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
      case "title-desc":
        return sorted.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
      default:
        return sorted;
    }
  };

  const filterItems = (items) => {
    if (filterOption === "all") return items;
    if (filterOption === "published") return items.filter(item => item.isPublished);
    if (filterOption === "unpublished") return items.filter(item => !item.isPublished);
    return items;
  };

  const filteredItems = podcastData.filter(item =>
    item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.guest?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAndSortedItems = sortItems(filterItems(filteredItems));
  const totalPages = Math.ceil(filteredAndSortedItems.length / itemsPerPage);

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold text-gray-800">Podcast Management</h1>
          <Link
            to="/Admin/Podcast/New"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Add New Episode
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
                placeholder="Search podcasts..."
                value={searchQuery}
                onChange={handleSearch}
                className="pl-10 pr-10 py-2 w-full border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
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
              value={filterOption}
              onChange={handleFilterChange}
              className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="unpublished">Unpublished</option>
            </select>

            <select
              value={sortOption}
              onChange={handleSortChange}
              className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title-asc">Title (A-Z)</option>
              <option value="title-desc">Title (Z-A)</option>
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
        ) : filteredAndSortedItems.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-sm border text-center">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-1">
              {searchQuery ? 'No matching podcasts found' : 'No podcast episodes available'}
            </h3>
            <p className="text-gray-500 mb-4">
              {searchQuery ? 'Try a different search term' : 'Add your first podcast episode to get started'}
            </p>
            {!searchQuery && (
              <Link
                to="/Admin/Podcast/New"
                className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg text-sm"
              >
                Add Podcast
              </Link>
            )}
          </div>
        ) : (
          <>
            <PodcastData
              podcastData={filteredAndSortedItems}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              setPodcastData={setPodcastData}
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

export default Podcast;