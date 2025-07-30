import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import AdminLayout from '../../layouts/AdminLayout';

const AddSuccessStory = () => {
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [story, setStory] = useState('');
  const [img, setImg] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
      navigate('/Admin/SuccessStories');
    } catch (err) {
      Swal.fire('Error', err.response?.data?.message || 'Failed to add story', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-6 max-w-xl">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Add Success Story</h1>
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-5 border">
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
    </AdminLayout>
  );
};

export default AddSuccessStory; 