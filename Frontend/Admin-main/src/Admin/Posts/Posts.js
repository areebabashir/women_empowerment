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
  faUser
} from "@fortawesome/free-solid-svg-icons";
import AdminLayout from "../../layouts/AdminLayout";

const PostsData = ({ postsData, currentPage, itemsPerPage, setPostsData }) => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const postsToDisplay = postsData.slice(startIndex, endIndex);

  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  const handleViewPost = (post) => {
    setSelectedPost(post);
    setShowViewModal(true);
  };

  const handleDelete = async (postId) => {
    const result = await Swal.fire({
      icon: 'warning',
      title: 'Delete Post?',
      text: 'This action cannot be undone!',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:8000/api/blogs/delete/${postId}`);

        const updatedPosts = postsData.filter(post => post.id !== postId);
        setPostsData(updatedPosts);
        Swal.fire('Deleted!', 'The post has been deleted.', 'success');
      } catch (error) {
        Swal.fire('Error', 'Failed to delete post', 'error');
        console.error('Delete error:', error);
      }
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {postsToDisplay.map(post => (
        <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
          <div className="relative h-48 overflow-hidden">
            <img
              className="w-full h-full object-cover"
              src={post.image}
              alt={post.name}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/default-post-image.jpg';
              }}
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
              <h3 className="text-white font-semibold text-lg truncate">{post.name}</h3>
            </div>
          </div>

          <div className="p-4 flex flex-col flex-grow">
            <p className="text-gray-600 mb-4 line-clamp-3 flex-grow">
              {post.description || 'No description available'}
            </p>

            <div className="mt-auto">
              <div className="flex items-center text-sm text-gray-500 mb-2">
                <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                {new Date(post.publicationDate).toLocaleDateString()}
              </div>

              <div className="flex items-center text-sm text-gray-500 mb-4">
                <FontAwesomeIcon icon={faUser} className="mr-2" />
                {post.author || 'Unknown Author'}
              </div>

              <div className="flex justify-between items-center border-t pt-3">
                <span className={`px-3 py-1 text-xs rounded-full ${post.isPublished
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                  }`}>
                  {post.isPublished ? 'Published' : 'Draft'}
                </span>

                <div className="flex space-x-3">
                  <button
                    onClick={() => handleViewPost(post)}
                    className="text-blue-500 hover:text-blue-700 transition-colors"
                    title="View"
                  >
                    <FontAwesomeIcon icon={faEye} />
                  </button>
                  <Link
                    to={`/Admin/Posts/Update/${post.id}`}
                    className="text-yellow-500 hover:text-yellow-700 transition-colors"
                    title="Edit"
                  >
                    <FontAwesomeIcon icon={faPen} />
                  </Link>
                  <button
                    onClick={() => handleDelete(post.id)}
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

      {/* View Post Modal */}
      {showViewModal && selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-start p-6 border-b">
              <h2 className="text-xl font-bold">Post Details</h2>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-gray-400 hover:text-gray-700 text-2xl"
              >
                &times;
              </button>
            </div>

            <div className="flex-1 overflow-auto p-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Post Image */}
                <div className="space-y-4">
                  <div className="relative h-64 rounded-lg overflow-hidden">
                    <img
                      src={selectedPost.image}
                      alt={selectedPost.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/default-post-image.jpg';
                      }}
                    />
                  </div>
                  
                  {/* Post Status */}
                  <div className="flex items-center justify-between">
                    <span className={`px-4 py-2 text-sm rounded-full font-medium ${
                      selectedPost.isPublished 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {selectedPost.isPublished ? 'Published' : 'Draft'}
                    </span>
                    <span className="text-sm text-gray-500">
                      Created: {new Date(selectedPost.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Post Information */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">{selectedPost.name}</h3>
                    <p className="text-gray-600 leading-relaxed">{selectedPost.description}</p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-100 p-3 rounded-lg">
                        <FontAwesomeIcon icon={faUser} className="text-blue-600 w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 uppercase tracking-wide">Author</p>
                        <p className="font-semibold text-gray-800">{selectedPost.author || 'Unknown Author'}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="bg-green-100 p-3 rounded-lg">
                        <FontAwesomeIcon icon={faCalendarAlt} className="text-green-600 w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 uppercase tracking-wide">Publication Date</p>
                        <p className="font-semibold text-gray-800">
                          {new Date(selectedPost.publicationDate).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3 pt-4 border-t">
                    <Link
                      to={`/Admin/Posts/Update/${selectedPost.id}`}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                    >
                      <FontAwesomeIcon icon={faPen} />
                      <span>Edit Post</span>
                    </Link>
                   
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Posts = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [postsData, setPostsData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOption, setSortOption] = useState("newest");
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get('http://localhost:8000/api/blogs/getallblog');
        console.log('API Response:', response);
        console.log('Response Data:', response.data);
        console.log('Data Type:', typeof response.data);
        if (!response.data || !response.data.blogs) {
          throw new Error('No posts data received');
        }
        console.log('API Response:', response);
        const transformedData = response.data.blogs.map(post => ({
          id: post._id,
          name: post.name,
          title: post.name,
          description: post.description,
          image: post.image
            ? `http://localhost:8000/uploads/${post.image}`
            : '/default-post-image.jpg',
          isPublished: post.isPublished || false,
          publicationDate: post.publicationDate,
          author: post.author,
          createdAt: post.createdAt || new Date().toISOString()
        }));
        console.log('Transformed Data:', transformedData);

        setPostsData(transformedData);
      } catch (err) {
        console.error('Fetch posts error:', err);
        setError(err.message || 'Failed to load posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
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

  const sortPosts = (posts) => {
    const sorted = [...posts];
    switch (sortOption) {
      case "newest":
        return sorted.sort((a, b) => new Date(b.publicationDate) - new Date(a.publicationDate));
      case "oldest":
        return sorted.sort((a, b) => new Date(a.publicationDate) - new Date(b.publicationDate));
      case "published":
        return sorted.sort((a, b) => (b.isPublished === a.isPublished) ? 0 : b.isPublished ? 1 : -1);
      case "drafts":
        return sorted.sort((a, b) => (a.isPublished === b.isPublished) ? 0 : a.isPublished ? 1 : -1);
      default:
        return sorted;
    }
  };

  const filteredPosts = postsData.filter(post =>
    post.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.author?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedAndFilteredPosts = sortPosts(filteredPosts);
  const totalPages = Math.ceil(sortedAndFilteredPosts.length / itemsPerPage);

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold text-gray-800">Manage Posts</h1>
          <Link
            to="/Admin/Post/New"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            New Post
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
                placeholder="Search posts..."
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
              <option value="published">Published</option>
              <option value="drafts">Drafts</option>
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
        ) : sortedAndFilteredPosts.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-sm border text-center">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-1">
              {searchQuery ? 'No matching posts found' : 'No posts available'}
            </h3>
            <p className="text-gray-500 mb-4">
              {searchQuery ? 'Try a different search term' : 'Create your first post to get started'}
            </p>
            {!searchQuery && (
              <Link
                to="/Admin/Post/New"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm"
              >
                Create New Post
              </Link>
            )}
          </div>
        ) : (
          <>
            <PostsData
              postsData={sortedAndFilteredPosts}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              setPostsData={setPostsData}
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

export default Posts;