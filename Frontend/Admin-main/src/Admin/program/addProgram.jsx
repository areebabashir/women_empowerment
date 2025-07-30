import React, { useState } from 'react';
import axios from 'axios';
import AdminLayout from '../../layouts/AdminLayout';
import Domain from '../../Api/Api';
import { AuthToken } from '../../Api/Api';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faCalendarAlt, faClock, faInfoCircle } from '@fortawesome/free-solid-svg-icons';

function AddProgram() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startingDate: '',
    endingDate: '',
    day: '',
    time: '',
    image: null,
    participants: []
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('startingDate', formData.startingDate);
    data.append('endingDate', formData.endingDate);
    data.append('day', formData.day);
    data.append('time', formData.time);
    if (formData.image) data.append('image', formData.image);
    
    try {
      const response = await axios.post(`http://localhost:8000/api/programs/create/program`, data, {
        headers: {
          'Authorization': `Bearer ${AuthToken()}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      Swal.fire({
        icon: 'success',
        title: 'Program Created',
        html: `
          <div class="text-left">
            <p><strong>Title:</strong> ${formData.title}</p>
            <p><strong>Description:</strong> ${formData.description}</p>
            <p><strong>Duration:</strong> ${new Date(formData.startingDate).toLocaleDateString()} to ${new Date(formData.endingDate).toLocaleDateString()}</p>
            <p><strong>Day:</strong> ${formData.day}</p>
            <p><strong>Time:</strong> ${formData.time}</p>
          </div>
        `,
      });
      
      handleClear();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Program Creation failed',
        text: error.response?.data?.message || error.message,
      });
    }
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      Swal.fire('Error', 'Program title is required', 'error');
      return false;
    }
    if (!formData.description.trim()) {
      Swal.fire('Error', 'Description is required', 'error');
      return false;
    }
    if (!formData.startingDate) {
      Swal.fire('Error', 'Starting date is required', 'error');
      return false;
    }
    if (!formData.endingDate) {
      Swal.fire('Error', 'Ending date is required', 'error');
      return false;
    }
    if (new Date(formData.endingDate) < new Date(formData.startingDate)) {
      Swal.fire('Error', 'Ending date cannot be before starting date', 'error');
      return false;
    }
    if (!formData.day) {
      Swal.fire('Error', 'Day is required', 'error');
      return false;
    }
    if (!formData.time) {
      Swal.fire('Error', 'Time is required', 'error');
      return false;
    }
    return true;
  };

  const handleClear = () => {
    setFormData({
      title: '',
      description: '',
      startingDate: '',
      endingDate: '',
      day: '',
      time: '',
      image: null,
      participants: []
    });
  };

  return (
    <div style={{ width: '900px' }} className="shadow-md flex-row px-1 mt-5 items-center pt-2 pb-2 mb-2 justify-center rounded-lg ml-10 bg-white">
      <h2 className="text-2xl font-semibold mb-4 text-center hover:text-indigo-500">
        <FontAwesomeIcon icon={faBook} className="mr-2" />
        Add New Program
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4 w-full p-1" encType="multipart/form-data">
        <div className="flex flex-col">
          <label htmlFor="title" className="text-lg">
            <FontAwesomeIcon icon={faBook} className="mr-2" />
            Title
          </label>
          <input 
            type="text" 
            id="title" 
            name="title" 
            value={formData.title} 
            onChange={handleChange} 
            required 
            className="border rounded-lg p-2" 
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="description" className="text-lg">
            <FontAwesomeIcon icon={faInfoCircle} className="mr-2" />
            Description
          </label>
          <textarea 
            id="description" 
            name="description" 
            value={formData.description} 
            onChange={handleChange} 
            required 
            className="border rounded-lg p-2" 
            rows={4}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label htmlFor="startingDate" className="text-lg">
              <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
              Starting Date
            </label>
            <input 
              type="date" 
              id="startingDate" 
              name="startingDate" 
              value={formData.startingDate} 
              onChange={handleChange} 
              required 
              className="border rounded-lg p-2" 
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="endingDate" className="text-lg">
              <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
              Ending Date
            </label>
            <input 
              type="date" 
              id="endingDate" 
              name="endingDate" 
              value={formData.endingDate} 
              onChange={handleChange} 
              required 
              min={formData.startingDate}
              className="border rounded-lg p-2" 
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <label htmlFor="time" className="text-lg">
              <FontAwesomeIcon icon={faClock} className="mr-2" />
              Time
            </label>
            <input 
              type="time" 
              id="time" 
              name="time" 
              value={formData.time} 
              onChange={handleChange} 
              required 
              className="border rounded-lg p-2" 
            />
          </div>
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
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <button 
            type="button" 
            onClick={handleClear} 
            className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition duration-300"
          >
            Clear
          </button>
          <button 
            type="submit" 
            className="bg-indigo-500 text-white py-2 px-4 rounded-lg hover:bg-indigo-600 transition duration-300"
          >
            Create Program
          </button>
        </div>
      </form>
    </div>
  );
}

function addProgram() {
  return (
    <AdminLayout Content={<AddProgram />} />
  );
}

export default addProgram;