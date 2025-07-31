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
  faImage,
  faTag,
  faUser
} from "@fortawesome/free-solid-svg-icons";
import AdminLayout from "../../layouts/AdminLayout";

const GalleryData = ({ galleryData, currentPage, itemsPerPage, setGalleryData }) => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const itemsToDisplay = galleryData.slice(startIndex, endIndex);

  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleDelete = async (imageId) => {
    const result = await Swal.fire({
      icon: 'warning',
      title: 'Delete Image?',
      text: 'This action cannot be undone!',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:8000/api/gallery/delete/${imageId}`);

        const updatedGallery = galleryData.filter(item => item.id !== imageId);
        setGalleryData(updatedGallery);
        Swal.fire('Deleted!', 'The image has been deleted.', 'success');
      } catch (error) {
        Swal.fire('Error', 'Failed to delete image', 'error');
        console.error('Delete error:', error);
      }
    }
  };

  const handleViewImage = (image) => {
    setSelectedImage(image);
    setShowImageModal(true);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {itemsToDisplay.map(item => (
        <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
          <div className="relative h-48 overflow-hidden cursor-pointer" onClick={() => handleViewImage(item)}>
            <img
              className="w-full h-full object-cover"
              src={item.image}
              alt={item.title || 'Gallery image'}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/default-image.jpg';
              }}
            />
            <div className="absolute inset-0 bg-black/10 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
              <FontAwesomeIcon icon={faEye} className="text-white text-2xl" />
            </div>
          </div>

          <div className="p-4 flex flex-col flex-grow">
            <div className="mb-3">
              {item.title && (
                <h3 className="font-semibold text-gray-800 mb-1 truncate">
                  {item.title}
                </h3>
              )}
              {item.description && (
                <p className="text-gray-600 text-sm line-clamp-2">
                  {item.description}
                </p>
              )}
            </div>

            <div className="mt-auto">
              <div className="flex items-center text-sm text-gray-500 mb-2">
                <FontAwesomeIcon icon={faTag} className="mr-2" />
                {item.category || 'Uncategorized'}
              </div>

              <div className="flex items-center text-sm text-gray-500 mb-4">
                <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                {item.date ? new Date(item.date).toLocaleDateString() : new Date(item.createdAt).toLocaleDateString()}
              </div>

              <div className="flex justify-between items-center border-t pt-3">
                <div className="flex space-x-2">
                  {item.tags && item.tags.map((tag, index) => (
                    <span key={index} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => handleViewImage(item)}
                    className="text-blue-500 hover:text-blue-700 transition-colors"
                    title="View"
                  >
                    <FontAwesomeIcon icon={faEye} />
                  </button>
                  <Link
                    to={`/Admin/Gallery/Update/${item.id}`}
                    className="text-yellow-500 hover:text-yellow-700 transition-colors"
                    title="Edit"
                  >
                    <FontAwesomeIcon icon={faPen} />
                  </Link>
                  <button
                    onClick={() => handleDelete(item.id)}
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

      {/* Image Preview Modal */}
      {showImageModal && selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90">
          <div className="relative max-w-3xl w-full p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-white text-xl font-bold">
                {selectedImage.title || 'Gallery Preview'}
              </h2>
              <button 
                onClick={() => setShowImageModal(false)} 
                className="text-white hover:text-gray-300 text-3xl"
              >
                &times;
              </button>
            </div>
            
            <div className="bg-white rounded-lg overflow-hidden">
              {/* Main Image Display */}
              <div className="p-3">
                <img
                  src={selectedImage.image}
                  alt={selectedImage.title || 'Gallery image'}
                  className="max-h-[40vh] w-full object-contain mx-auto"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/default-image.jpg';
                  }}
                />
              </div>
              
              {/* All Images Grid */}
              {selectedImage.images && selectedImage.images.length > 1 && (
                <div className="border-t bg-gray-50 p-3">
                  <h3 className="text-base font-semibold text-gray-800 mb-2">All Images ({selectedImage.images.length})</h3>
                  <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
                    {selectedImage.images.map((imageUrl, index) => (
                      <div 
                        key={index} 
                        className={`relative cursor-pointer border-2 rounded-lg overflow-hidden transition-all ${
                          imageUrl === selectedImage.image ? 'border-blue-500' : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => {
                          setSelectedImage(prev => ({
                            ...prev,
                            image: imageUrl
                          }));
                        }}
                      >
                        <img
                          src={imageUrl}
                          alt={`${selectedImage.title} - Image ${index + 1}`}
                          className="w-full h-16 object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/default-image.jpg';
                          }}
                        />
                        {imageUrl === selectedImage.image && (
                          <div className="absolute top-1 right-1 bg-blue-500 text-white text-xs px-1 py-0.5 rounded">
                            Active
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-3 bg-white rounded-lg p-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Details</h3>
                  {selectedImage.title && (
                    <p className="text-gray-600 mb-1">
                      <span className="font-medium">Title:</span> {selectedImage.title}
                    </p>
                  )}
                  {selectedImage.description && (
                    <p className="text-gray-600 mb-1">
                      <span className="font-medium">Description:</span> {selectedImage.description}
                    </p>
                  )}
                  {selectedImage.category && (
                    <p className="text-gray-600 mb-1">
                      <span className="font-medium">Category:</span> {selectedImage.category}
                    </p>
                  )}
                  {selectedImage.date && (
                    <p className="text-gray-600 mb-1">
                      <span className="font-medium">Date:</span> {new Date(selectedImage.date).toLocaleDateString()}
                    </p>
                  )}
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Metadata</h3>
                  <p className="text-gray-600 mb-1">
                    <span className="font-medium">Uploaded:</span> {new Date(selectedImage.createdAt).toLocaleString()}
                  </p>
                  {selectedImage.images && selectedImage.images.length > 1 && (
                    <p className="text-gray-600 mb-1">
                      <span className="font-medium">Total Images:</span> {selectedImage.images.length}
                    </p>
                  )}
                  {selectedImage.tags && selectedImage.tags.length > 0 && (
                    <div className="mb-1">
                      <span className="font-medium">Tags:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedImage.tags.map((tag, index) => (
                          <span key={index} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-3">
                <Link
                  to={`/Admin/Gallery/Update/${selectedImage.id}`}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                >
                  <FontAwesomeIcon icon={faPen} />
                  <span>Edit Details</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Gallery = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [galleryData, setGalleryData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOption, setSortOption] = useState("newest");
  const [filterOption, setFilterOption] = useState("all");
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchGalleryItems = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get('http://localhost:8000/api/gallery/getallgallery');
        console.log('API Response:', response);
        
        // Handle different possible response structures
        let itemsArray = [];
        if (response.data && Array.isArray(response.data)) {
          itemsArray = response.data;
        } else if (response.data && response.data.galleries && Array.isArray(response.data.galleries)) {
          itemsArray = response.data.galleries;
        } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
          itemsArray = response.data.data;
        } else if (response.data && response.data.images && Array.isArray(response.data.images)) {
          itemsArray = response.data.images;
        } else {
          throw new Error('No gallery data received or invalid data structure');
        }

        console.log('Gallery items from API:', itemsArray);
        
        const transformedData = itemsArray.map(item => {
          console.log('Processing item:', item);
          
          // Handle multiple images per gallery item
          let images = [];
          if (item.images && Array.isArray(item.images)) {
            images = item.images.map(img => 
              img.startsWith('http') ? img : `http://localhost:8000/uploads/images/${img}`
            );
          } else if (item.imageUrl) {
            images = [item.imageUrl.startsWith('http') ? item.imageUrl : `http://localhost:8000/uploads/images/${item.imageUrl}`];
          }
          
          return {
            id: item._id || item.id,
            title: item.title,
            description: item.description,
            images: images,
            image: images[0] || '/default-image.jpg', // Use first image for main display
            category: item.category,
            date: item.date,
            tags: item.tags || [],
            createdAt: item.createdAt || item.date || new Date().toISOString()
          };
        });

        console.log('Transformed gallery data:', transformedData);
        setGalleryData(transformedData);
      } catch (err) {
        console.error('Fetch gallery error:', err);
        setError(err.message || 'Failed to load gallery items');
      } finally {
        setLoading(false);
      }
    };

    fetchGalleryItems();
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
        return sorted.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
      case "title-desc":
        return sorted.sort((a, b) => (b.title || '').localeCompare(a.title || ''));
      default:
        return sorted;
    }
  };

  const filterItems = (items) => {
    if (filterOption === "all") return items;
    return items.filter(item => 
      item.category === filterOption ||
      (item.tags && item.tags.includes(filterOption))
  )};

  const filteredItems = galleryData.filter(item =>
    item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.tags && item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  const filteredAndSortedItems = sortItems(filterItems(filteredItems));
  const totalPages = Math.ceil(filteredAndSortedItems.length / itemsPerPage);

  // Extract unique categories and tags for filter dropdown
  const categories = [...new Set(galleryData.map(item => item.category).filter(Boolean))];
  const allTags = galleryData.flatMap(item => item.tags || []);
  const uniqueTags = [...new Set(allTags)];

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold text-gray-800">Gallery Management</h1>
          <Link
            to="/Admin/Gallery/New"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Add New Image
          </Link>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search gallery..."
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
              value={filterOption}
              onChange={handleFilterChange}
              className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
              {uniqueTags.map(tag => (
                <option key={tag} value={tag}>Tag: {tag}</option>
              ))}
            </select>

            <select
              value={sortOption}
              onChange={handleSortChange}
              className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title-asc">Title (A-Z)</option>
              <option value="title-desc">Title (Z-A)</option>
            </select>
          </div>
        </div>

        {/* Content Section */}
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
        ) : filteredAndSortedItems.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-sm border text-center">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-1">
              {searchQuery ? 'No matching images found' : 'No gallery items available'}
            </h3>
            <p className="text-gray-500 mb-4">
              {searchQuery ? 'Try a different search term' : 'Upload your first image to get started'}
            </p>
            {!searchQuery && (
              <Link
                to="/Admin/Gallery/New"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm"
              >
                Upload Image
              </Link>
            )}
          </div>
        ) : (
          <>
            <GalleryData
              galleryData={filteredAndSortedItems}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              setGalleryData={setGalleryData}
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

export default Gallery;