import React, { useState } from 'react';

const mockMember = {
  id: 1,
  name: 'Alice Johnson',
  position: 'Project Manager',
  pic: 'https://randomuser.me/api/portraits/women/44.jpg',
  bio: 'Alice is an experienced project manager with a passion for agile methodologies.'
};

const UpdateTeam = () => {
  const [form, setForm] = useState({ ...mockMember });
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess(true);
    // Normally, you would send the updated data to the backend here
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">Update Team Member</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">Name</label>
            <input type="text" name="name" value={form.name} onChange={handleChange} required className="border rounded-lg p-2 w-full" />
          </div>
          <div>
            <label className="block text-gray-700">Position</label>
            <input type="text" name="position" value={form.position} onChange={handleChange} required className="border rounded-lg p-2 w-full" />
          </div>
          <div>
            <label className="block text-gray-700">Picture URL</label>
            <input type="text" name="pic" value={form.pic} onChange={handleChange} required className="border rounded-lg p-2 w-full" />
          </div>
          <div>
            <label className="block text-gray-700">Bio</label>
            <textarea name="bio" value={form.bio} onChange={handleChange} className="border rounded-lg p-2 w-full" />
          </div>
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg w-full transition-colors">Update</button>
        </form>
        {success && (
          <div className="mt-4 text-green-600 text-center font-semibold">Team member updated successfully!</div>
        )}
      </div>
    </div>
  );
};

export default UpdateTeam; 