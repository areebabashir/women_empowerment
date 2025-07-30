import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import AdminLayout from '../../layouts/AdminLayout';
import Domain from '../../Api/Api';
import { AuthToken } from '../../Api/Api';
import Loading from '../../layouts/Loading';

function UpdatePostForm() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: null,
    imageUrl: '',
    publicationDate: '',
    author: '',
    isPublished: false,
  });

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/blogs/getbyid/${id}`, {
          headers: {
            'Authorization': 'Bearer ' + AuthToken(),
          }
        });
        console.log('API Response:', response);
        
        setFormData({
          name: response.data.blog.name,
          description: response.data.blog.description,
          image: null,
          imageUrl: response.data.blog.image
          ? `http://localhost:8000/uploads/${response.data.blog.image}`
            : '/default-post-image.jpg',
          publicationDate: response.data.blog.publicationDate ? response.data.blog.publicationDate.slice(0, 10) : '',
          author: response.data.blog.author,
          isPublished: response.data.blog.isPublished,
        });
        console.log('Form Data:', formData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        Swal.fire('Error', 'Failed to load blog data', 'error');
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'file') {
      setFormData({
        ...formData,
        image: files[0],
        imageUrl: URL.createObjectURL(files[0]),
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value,
      });
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const result = await Swal.fire({
        icon: 'question',
        title: 'Update this blog?',
        html: `
          <b>Name:</b> ${formData.name}<br>
          <b>Description:</b> ${formData.description.substring(0, 50)}...<br>
          <b>Publication Date:</b> ${formData.publicationDate}<br>
          <b>Author:</b> ${formData.author}<br>
          <b>Published:</b> ${formData.isPublished ? 'Yes' : 'No'}
        `,
        showCancelButton: true,
        confirmButtonText: 'Update',
        confirmButtonColor: '#F53D65',
        cancelButtonText: 'Cancel',
      });

      if (result.isConfirmed) {
        const data = new FormData();
        data.append('name', formData.name);
        data.append('description', formData.description);
        if (formData.image) data.append('image', formData.image);
        data.append('publicationDate', formData.publicationDate);
        data.append('author', formData.author);
        data.append('isPublished', formData.isPublished);
        
        // Debug: Log the form data being sent
        console.log('Sending form data:');
        console.log('- name:', formData.name);
        console.log('- description:', formData.description);
        console.log('- image:', formData.image);
        console.log('- publicationDate:', formData.publicationDate);
        console.log('- author:', formData.author);
        console.log('- isPublished:', formData.isPublished);

        const response = await axios.put(`http://localhost:8000/api/blogs/update/${id}`, data, {
          headers: {
            'Authorization': 'Bearer ' + AuthToken(),
            'Content-Type': 'multipart/form-data'
          }
        });
        
        console.log('Update response:', response.data);
        
        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: 'Blog has been updated successfully.',
        }).then(() => {
          window.location.href = '/Admin/Posts';
        });
      }
    } catch (error) {
      console.error('Update error:', error);
      
      let errorMessage = 'Failed to update blog';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMessage,
      });
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div style={{ width: '900px' }} className="shadow-md flex-row px-1 mt-5 items-center pt-2 pb-2 mb-2 justify-center rounded-lg ml-10 bg-white">
      <h2 className="text-2xl font-semibold mb-4 text-center hover:text-indigo-500">Update Blog</h2>
      <form onSubmit={handleUpdate} className="space-y-4 w-full p-1" encType="multipart/form-data">
        <div className="flex flex-col">
          <label htmlFor="name" className="text-lg">Name</label>
          <input 
            type="text" 
            id="name" 
            name="name" 
            value={formData.name} 
            onChange={handleChange} 
            required 
            className="border rounded-lg p-2" 
          />
        </div>
        
        <div className="flex flex-col">
          <label htmlFor="description" className="text-lg">Description</label>
          <textarea 
            id="description" 
            name="description" 
            value={formData.description} 
            onChange={handleChange} 
            required 
            className="border rounded-lg p-2 h-32" 
          />
        </div>
        
        <div className="flex flex-col">
          <label htmlFor="image" className="text-lg">Image</label>
          <input 
            type="file" 
            id="image" 
            name="image" 
            accept="image/*" 
            onChange={handleChange} 
            className="border rounded-lg p-2" 
          />
          {formData.imageUrl && (
            <div className="mt-2">
              <p className="text-sm text-gray-500">Current Image:</p>
              <img 
                src={formData.imageUrl} 
                alt="Preview" 
                className="h-48 object-contain border rounded" 
              />
            </div>
          )}
        </div>
        
        <div className="flex flex-col">
          <label htmlFor="publicationDate" className="text-lg">Publication Date</label>
          <input 
            type="date" 
            id="publicationDate" 
            name="publicationDate" 
            value={formData.publicationDate} 
            onChange={handleChange} 
            required 
            className="border rounded-lg p-2" 
          />
        </div>
        
        <div className="flex flex-col">
          <label htmlFor="author" className="text-lg">Author</label>
          <input 
            type="text" 
            id="author" 
            name="author" 
            value={formData.author} 
            onChange={handleChange} 
            className="border rounded-lg p-2" 
          />
        </div>
        
        <div className="flex items-center">
          <input 
            type="checkbox" 
            id="isPublished" 
            name="isPublished" 
            checked={formData.isPublished} 
            onChange={handleChange} 
            className="mr-2 h-5 w-5" 
          />
          <label htmlFor="isPublished" className="text-lg">Published</label>
        </div>
        
        <div className="flex space-x-4">
          <button 
            type="submit" 
            className="bg-indigo-500 text-white py-2 px-6 rounded-lg hover:bg-indigo-600 transition duration-300"
          >
            Update
          </button>
        </div>
      </form>
    </div>
  );
}

function UpdatePost() {
  return (
    <AdminLayout Content={<UpdatePostForm />} />
  );
}

export default UpdatePost;