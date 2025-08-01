// src/services/api.js

// Function to fetch all teams
export async function getAllTeams() {
  try {
    const response = await fetch('http://localhost:8000/api/teams/getallteams');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching teams:', error);
    throw error;
  }
}

// Function to fetch gallery items with pagination
export async function getAllGallery(page = 1, limit = 5) {
  try {
    const response = await fetch(`http://localhost:8000/api/gallery/getallgallery?page=${page}&limit=${limit}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching gallery:', error);
    throw error;
  }
}

// Function to fetch all blogs
export async function getAllBlogs() {
  try {
    const response = await fetch('http://localhost:8000/api/blogs/getallblog');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching blogs:', error);
    throw error;
  }
}

// Function to fetch all programs
export async function getAllPrograms() {
  try {
    const response = await fetch('http://localhost:8000/api/programs/getallprogram');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching programs:', error);
    throw error;
  }
}

// Function to fetch all events
export async function getAllEvents() {
  try {
    const response = await fetch('http://localhost:8000/api/events/getallevent');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
}

// Function to fetch all success stories
export async function getAllSuccessStories() {
  try {
    const response = await fetch('http://localhost:8000/api/successstories/getallstories');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching success stories:', error);
    throw error;
  }
}

// Function to fetch all podcasts
export async function getAllPodcasts() {
  try {
    const response = await fetch('http://localhost:8000/api/podcasts/getallpodcasts');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching podcasts:', error);
    throw error;
  }
}

// Function to submit contact form
export async function submitContactForm(contactData) {
  try {
    const response = await fetch('http://localhost:8000/api/contactus/addcontact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contactData),
    });
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error submitting contact form:', error);
    throw error;
  }
} 

// Function to fetch all awareness items
export async function getAllAwareness() {
  try {
    const response = await fetch('http://localhost:8000/api/awareness/getallawareness');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching awareness:', error);
    throw error;
  }
}

// Function to fetch awareness item by ID
export async function getAwarenessById(id) {
  try {
    const response = await fetch(`http://localhost:8000/api/awareness/getawareness/${id}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching awareness by ID:', error);
    throw error;
  }
} 