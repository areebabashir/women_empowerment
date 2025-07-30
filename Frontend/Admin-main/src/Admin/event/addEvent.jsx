import React, { useState } from 'react';
import axios from 'axios';
import AdminLayout from '../../layouts/AdminLayout';
import Domain from '../../Api/Api';
import { AuthToken } from '../../Api/Api';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faEye } from '@fortawesome/free-solid-svg-icons';

function AddEvent() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    day: '',
    time: '',
    image: null,
    isPublished: false
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
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('date', formData.date);
    data.append('day', formData.day);
    data.append('time', formData.time);
    if (formData.image) data.append('image', formData.image);
    data.append('isPublished', formData.isPublished);
    
    fetch('http://localhost:8000/api/events/create/event', {
      method: 'POST',
      body: data,
    })
      .then(async response => {
        if (!response.ok) throw new Error(await response.text());
        Swal.fire({
          icon: 'success',
          title: 'Event Created',
          html: `
            Title: ${formData.title}<br>
            Description: ${formData.description}<br>
            Date: ${formData.date}<br>
            Day: ${formData.day}<br>
            Time: ${formData.time}<br>
            Published: ${formData.isPublished ? 'Yes' : 'No'}
          `,
        });
      })
      .catch(error => {
        Swal.fire({
          icon: 'error',
          title: 'Event Creation failed',
          html: `${error}`,
        });
      });
  };

  const handleClear = () => {
    setFormData({
      title: '',
      description: '',
      date: '',
      day: '',
      time: '',
      image: null,
      isPublished: false
    });
  };

  return (
    <div style={{ width: '900px' }} className="shadow-md flex-row px-1 mt-5 items-center pt-2 pb-2 mb-2 justify-center rounded-lg ml-10 bg-white">
      <h2 className="text-2xl font-semibold mb-4 text-center hover:text-indigo-500">Add New Event</h2>
      <form onSubmit={handleSubmit} className="space-y-4 w-full p-1" encType="multipart/form-data">
        <div className="flex flex-col">
          <label htmlFor="title" className="text-lg">Title</label>
          <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} required className="border rounded-lg p-2" />
        </div>
        <div className="flex flex-col">
          <label htmlFor="description" className="text-lg">Description</label>
          <textarea id="description" name="description" value={formData.description} onChange={handleChange} required className="border rounded-lg p-2" />
        </div>
        <div className="flex flex-col">
          <label htmlFor="date" className="text-lg">Date</label>
          <input type="date" id="date" name="date" value={formData.date} onChange={handleChange} required className="border rounded-lg p-2" />
        </div>
        <div className="flex flex-col">
          <label htmlFor="day" className="text-lg">Day</label>
          <select
            id="day"
            name="day"
            value={formData.day}
            onChange={handleChange}
            required
            className="border rounded-lg p-2"
          >
            <option value="">Select a day</option>
            <option value="Monday">Monday</option>
            <option value="Tuesday">Tuesday</option>
            <option value="Wednesday">Wednesday</option>
            <option value="Thursday">Thursday</option>
            <option value="Friday">Friday</option>
            <option value="Saturday">Saturday</option>
            <option value="Sunday">Sunday</option>
          </select>
        </div>
        <div className="flex flex-col">
          <label htmlFor="time" className="text-lg">Time</label>
          <input type="time" id="time" name="time" value={formData.time} onChange={handleChange} required className="border rounded-lg p-2" />
        </div>
        <div className="flex flex-col">
          <label htmlFor="image" className="text-lg">Image</label>
          <input type="file" id="image" name="image" accept="image/*" onChange={handleChange} className="border rounded-lg p-2" />
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

function AddEventPage() {
  return (
    <AdminLayout Content={<AddEvent />} />
  );
}

export default AddEventPage;