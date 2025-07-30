import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '../../layouts/AdminLayout';
import Domain from '../../Api/Api';
import { AuthToken } from '../../Api/Api';
import Swal from 'sweetalert2';

function AddPost() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: null,
    publicationDate: '',
    author: '',
    isPublished: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'file') {
      setFormData({
        ...formData,
        [name]: files[0],
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    if (formData.image) data.append('image', formData.image);
    data.append('publicationDate', formData.publicationDate);
    data.append('author', formData.author);
    data.append('isPublished', formData.isPublished);
    
    fetch('http://localhost:8000/api/blogs/createblog', {
      method: 'POST',
      body: data,
    })
      .then(async response => {
        if (!response.ok) throw new Error(await response.text());
        Swal.fire({
          icon: 'success',
          title: 'Blog Created',
          html: `
            Name: ${formData.name}<br>
            Description: ${formData.description}<br>
            Publication Date: ${formData.publicationDate}<br>
            Author: ${formData.author}<br>
            Published: ${formData.isPublished ? 'Yes' : 'No'}
          `,
        });
      })
      .catch(error => {
        Swal.fire({
          icon: 'error',
          title: 'Blog Creation failed',
          html: `${error}`,
        });
      });
  };

  const handleClear = () => {
    setFormData({
      name: '',
      description: '',
      image: null,
      publicationDate: '',
      author: '',
      isPublished: false,
    });
  };

  return (
    <div style={{ width: '900px' }} className="shadow-md flex-row px-1 mt-5 items-center pt-2 pb-2 mb-2 justify-center rounded-lg ml-10 bg-white">
      <h2 className="text-2xl font-semibold mb-4 text-center hover:text-indigo-500">Add New Blog</h2>
      <form onSubmit={handleSubmit} className="space-y-4 w-full p-1" encType="multipart/form-data">
        <div className="flex flex-col">
          <label htmlFor="name" className="text-lg">Name</label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="border rounded-lg p-2" />
        </div>
        <div className="flex flex-col">
          <label htmlFor="description" className="text-lg">Description</label>
          <textarea id="description" name="description" value={formData.description} onChange={handleChange} required className="border rounded-lg p-2" />
        </div>
        <div className="flex flex-col">
          <label htmlFor="image" className="text-lg">Image</label>
          <input type="file" id="image" name="image" accept="image/*" onChange={handleChange} className="border rounded-lg p-2" />
        </div>
        <div className="flex flex-col">
          <label htmlFor="publicationDate" className="text-lg">Publication Date</label>
          <input type="date" id="publicationDate" name="publicationDate" value={formData.publicationDate} onChange={handleChange} required className="border rounded-lg p-2" />
        </div>
        <div className="flex flex-col">
          <label htmlFor="author" className="text-lg">Author</label>
          <input type="text" id="author" name="author" value={formData.author} onChange={handleChange} className="border rounded-lg p-2" />
        </div>
        <div className="flex flex-row items-center">
          <input type="checkbox" id="isPublished" name="isPublished" checked={formData.isPublished} onChange={handleChange} className="mr-2" />
          <label htmlFor="isPublished" className="text-lg">Published</label>
        </div>
        <button type="submit" className="bg-indigo-500 text-white py-2 px-4 rounded-lg hover:bg-indigo-600 transition duration-300">Submit</button>
        <button type="button" onClick={handleClear} className="bg-indigo-500 text-white py-2 px-4 rounded-lg ml-3 hover:bg-indigo-600 transition duration-300">Clear</button>
      </form>
    </div>
  );
}

function Add() {
  return (
    <AdminLayout Content={<AddPost />} />
  );
}

export default Add;
