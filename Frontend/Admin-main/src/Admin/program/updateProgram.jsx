import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import AdminLayout from '../../layouts/AdminLayout';
import Domain from '../../Api/Api';
import { AuthToken } from '../../Api/Api';
import Loading from '../../layouts/Loading';

function UpdateProgramForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: null,
    imageUrl: '',
    startingDate: '',
    endingDate: '',
    day: '',
    time: '',
  });

  useEffect(() => {
    const fetchProgram = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/programs/getprogram/${id}`, {
          headers: {
            'Authorization': 'Bearer ' + AuthToken(),
          }
        });
        const program = response.data.program || response.data;
        setFormData({
          title: program.title,
          description: program.description,
          image: null,
          imageUrl: program.image ? `http://localhost:8000/uploads/images/${program.image}` : '/default-program-image.jpg',
          startingDate: program.startingDate ? program.startingDate.slice(0, 10) : '',
          endingDate: program.endingDate ? program.endingDate.slice(0, 10) : '',
          day: program.day || '',
          time: program.time || '',
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching program:", error);
        Swal.fire('Error', 'Failed to load program data', 'error');
        navigate('/Admin/Program');
        setLoading(false);
      }
    };
    fetchProgram();
  }, [id, navigate]);

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
        title: 'Update this program?',
        html: `
          <b>Title:</b> ${formData.title}<br>
          <b>Description:</b> ${formData.description.substring(0, 50)}...<br>
          <b>Starting Date:</b> ${formData.startingDate}<br>
          <b>Ending Date:</b> ${formData.endingDate}<br>
          <b>Day:</b> ${formData.day}<br>
          <b>Time:</b> ${formData.time}<br>
        `,
        showCancelButton: true,
        confirmButtonText: 'Update',
        confirmButtonColor: '#4F46E5',
        cancelButtonText: 'Cancel',
      });
      if (result.isConfirmed) {
        const data = new FormData();
        data.append('title', formData.title);
        data.append('description', formData.description);
        if (formData.image) data.append('image', formData.image);
        data.append('startingDate', formData.startingDate);
        data.append('endingDate', formData.endingDate);
        data.append('day', formData.day);
        data.append('time', formData.time);
        
        // Debug: Log the form data being sent
        console.log('Sending program form data:');
        console.log('- title:', formData.title);
        console.log('- description:', formData.description);
        console.log('- image:', formData.image);
        console.log('- startingDate:', formData.startingDate);
        console.log('- endingDate:', formData.endingDate);
        console.log('- day:', formData.day);
        console.log('- time:', formData.time);
        
        const response = await axios.put(`http://localhost:8000/api/programs/update/${id}`, data, {
          headers: {
            'Authorization': 'Bearer ' + AuthToken(),
            'Content-Type': 'multipart/form-data'
          }
        });
        
        console.log('Update response:', response.data);
        
        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: 'Program has been updated successfully.',
        }).then(() => {
          navigate('/Admin/Program');
        });
      }
    } catch (error) {
      console.error('Update error:', error);
      
      let errorMessage = 'Failed to update program';
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
      <h2 className="text-2xl font-semibold mb-4 text-center hover:text-indigo-500">Update Program</h2>
      <form onSubmit={handleUpdate} className="space-y-4 w-full p-1" encType="multipart/form-data">
        <div className="flex flex-col">
          <label htmlFor="title" className="text-lg">Title</label>
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
        
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col">
            <label htmlFor="startingDate" className="text-lg">Starting Date</label>
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
            <label htmlFor="endingDate" className="text-lg">Ending Date</label>
            <input 
              type="date" 
              id="endingDate" 
              name="endingDate" 
              value={formData.endingDate} 
              onChange={handleChange} 
              required 
              className="border rounded-lg p-2" 
            />
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
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col">
            <label htmlFor="time" className="text-lg">Time</label>
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
          {formData.imageUrl && (
            <div className="mt-2">
              <p className="text-sm text-gray-500">Current Image:</p>
              <img 
                src={formData.imageUrl} 
                alt="Program Preview" 
                className="h-48 object-contain border rounded" 
              />
            </div>
          )}
        </div>
        
        <div className="flex space-x-4 pt-4">
          <button 
            type="submit" 
            className="bg-indigo-500 text-white py-2 px-6 rounded-lg hover:bg-indigo-600 transition duration-300"
          >
            Update Program
          </button>
          <button 
            type="button" 
            onClick={() => navigate('/Admin/Program')} 
            className="bg-gray-500 text-white py-2 px-6 rounded-lg hover:bg-gray-600 transition duration-300"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

function UpdateProgram() {
  return (
    <AdminLayout Content={<UpdateProgramForm />} />
  );
}

export default UpdateProgram;