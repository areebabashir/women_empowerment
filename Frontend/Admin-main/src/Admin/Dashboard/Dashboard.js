import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from "../../layouts/AdminLayout";
import Domain from '../../Api/Api';
import { AuthToken } from '../../Api/Api';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileAlt, faUsers, faCalendarAlt, faFolderOpen, faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import Loading from '../../layouts/Loading';
import axios from 'axios';

function StatCard({ title, value, icon, color }) {
  return (
    <div className={`rounded-xl shadow-md p-6 flex items-center space-x-4 bg-gradient-to-br ${color} transition-transform transform hover:scale-105`}>
      <FontAwesomeIcon icon={icon} className="text-4xl text-white drop-shadow" />
      <div>
        <h3 className="text-lg font-semibold text-white opacity-90">{title}</h3>
        <p className="text-3xl font-bold mt-2 text-white">{value}</p>
      </div>
    </div>
  );
}

function Dashboard() {
  const [isLoading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    blogs: 0,
    events: 0,
    programs: 0,
  });
  const [dashboardData, setDashboardData] = useState({
    MonthlyPosts: [],
    MonthlyComments: [],
  });
  const [adminName, setAdminName] = useState('');

  useEffect(() => {
    // Fetch all stats function
    const fetchStats = () => {
      axios.get(`${Domain()}/Dashboard`, {
        headers: { 'Authorization': `Bearer ${AuthToken()}` },
      })
        .then(response => {
          console.log('Dashboard:', response.data);
          setStats(prev => ({ ...prev, blogs: response.data.TotalPosts || 0 }));
          setDashboardData({
            MonthlyPosts: response.data.MonthlyPosts || [],
            MonthlyComments: response.data.MonthlyComments || [],
          });
          setLoading(true);
        })
        .catch((error) => {
          console.error('Error fetching dashboard data:', error);
          setLoading(true);
        });
      axios.get('http://localhost:8000/api/events/getallevent', {
        headers: { 'Authorization': `Bearer ${AuthToken()}` }
      })
        .then(res => {
          console.log('Events response:', res.data);
          console.log('Events data structure:', typeof res.data, Array.isArray(res.data));
          if (Array.isArray(res.data)) {
            setStats(prev => ({ ...prev, events: res.data.length }));
          } else if (res.data && Array.isArray(res.data.events)) {
            setStats(prev => ({ ...prev, events: res.data.events.length }));
          } else {
            setStats(prev => ({ ...prev, events: 0 }));
          }
        })
        .catch((error) => {
          console.error('Error fetching events:', error);
          setStats(prev => ({ ...prev, events: 0 }));
        });
      axios.get('http://localhost:8000/api/programs/getallprogram', {
        headers: { 'Authorization': `Bearer ${AuthToken()}` }
      })
        .then(res => {
          console.log('Programs response:', res.data);
          console.log('Programs data structure:', typeof res.data, Array.isArray(res.data));
          if (Array.isArray(res.data)) {
            setStats(prev => ({ ...prev, programs: res.data.length }));
          } else if (res.data && Array.isArray(res.data.programs)) {
            setStats(prev => ({ ...prev, programs: res.data.programs.length }));
          } else {
            setStats(prev => ({ ...prev, programs: 0 }));
          }
        })
        .catch((error) => {
          console.error('Error fetching programs:', error);
          setStats(prev => ({ ...prev, programs: 0 }));
        });
      
      // Also fetch blogs separately to ensure we get the correct count
      axios.get('http://localhost:8000/api/blogs/getallblog', {
        headers: { 'Authorization': `Bearer ${AuthToken()}` }
      })
        .then(res => {
          console.log('Blogs response:', res.data);
          if (res.data && res.data.blogs && Array.isArray(res.data.blogs)) {
            setStats(prev => ({ ...prev, blogs: res.data.blogs.length }));
          } else if (Array.isArray(res.data)) {
            setStats(prev => ({ ...prev, blogs: res.data.length }));
          }
        })
        .catch((error) => {
          console.error('Error fetching blogs:', error);
        });
    };
    fetchStats();
    const interval = setInterval(fetchStats, 10000); // 10 seconds
    // Optionally, fetch admin name from storage or API
    const name = sessionStorage.getItem('AdminName') || 'Admin';
    setAdminName(name);
    return () => clearInterval(interval);
  }, []);

  const dashboardContent = isLoading ? (
    <div className="container mx-auto mt-8 px-4">
      {/* Greeting/Profile */}
      <div className="flex items-center mb-8 gap-4">
        <div className="bg-gradient-to-br from-indigo-500 to-blue-400 rounded-full h-16 w-16 flex items-center justify-center shadow-lg">
          <FontAwesomeIcon icon={faUserCircle} className="text-4xl text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Welcome back, <span className="text-indigo-600">{adminName}</span>!</h2>
          <p className="text-gray-500">Here's a quick overview of your platform.</p>
        </div>
      </div>
      {/* Live Stats Section */}
      <div className="mb-10">
        <h3 className="text-xl font-bold text-gray-700 mb-4 flex items-center gap-2">
          Live Stats
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 animate-pulse">Live</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard title="Blogs" value={stats.blogs} icon={faFileAlt} color="from-indigo-500 to-blue-400" />
          <StatCard title="Events" value={stats.events} icon={faCalendarAlt} color="from-green-500 to-emerald-400" />
          <StatCard title="Programs" value={stats.programs} icon={faFolderOpen} color="from-yellow-500 to-orange-400" />
        </div>
        
        {/* Quick Actions */}
        <div className="mt-8">
          <h3 className="text-xl font-bold text-gray-700 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link to="/Admin/Events" className="block">
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-md p-6 flex items-center space-x-4 transition-transform transform hover:scale-105 cursor-pointer">
                <FontAwesomeIcon icon={faCalendarAlt} className="text-4xl text-white drop-shadow" />
                <div>
                  <h3 className="text-lg font-semibold text-white opacity-90">Manage Events</h3>
                  <p className="text-white opacity-75 text-sm">Create and manage events</p>
                </div>
              </div>
            </Link>
            <Link to="/Admin/Program" className="block">
              <div className="bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl shadow-md p-6 flex items-center space-x-4 transition-transform transform hover:scale-105 cursor-pointer">
                <FontAwesomeIcon icon={faFolderOpen} className="text-4xl text-white drop-shadow" />
                <div>
                  <h3 className="text-lg font-semibold text-white opacity-90">Manage Programs</h3>
                  <p className="text-white opacity-75 text-sm">Create and manage programs</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
      {/* Beautiful Section: Analytics */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl shadow-lg p-8 mb-10">
        <h3 className="text-xl font-bold text-gray-700 mb-4">Platform Analytics</h3>
        <Analytics
          Posts={dashboardData.MonthlyPosts}
          Comments={dashboardData.MonthlyComments}
        />
      </div>
    </div>
  ) : (
    <Loading />
  );

  return (
    <AdminLayout Content={dashboardContent} />
  );
}

function Analytics({ Posts, Comments }) {
  if (!Posts.length && !Comments.length) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 mt-5">
        <h2 className="text-2xl font-semibold mb-4">Analytics Dashboard</h2>
        <p>No data available. Please check back later.</p>
      </div>
    );
  }

  const orderedMonths = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const postCounts = new Array(12).fill(0);
  const TotalComment = new Array(12).fill(0);

  Posts.forEach(item => {
    const monthIndex = orderedMonths.indexOf(item.month);
    if (monthIndex !== -1) {
      postCounts[monthIndex] = item.post_count;
    }
  });

  Comments.forEach(item => {
    const monthIndex = orderedMonths.indexOf(item.month);
    if (monthIndex !== -1) {
      TotalComment[monthIndex] = item.comment_count;
    }
  });

  const PostsChart = {
    labels: orderedMonths,
    datasets: [
      {
        label: 'Posts',
        data: postCounts,
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 2,
        fill: false,
      },
      {
        label: 'Posts',
        type: 'bar',
        data: postCounts,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderWidth: 2,
        fill: false,
      },
    ],
  };

  const CommentsChart = {
    labels: orderedMonths,
    datasets: [
      {
        label: 'Comments',
        data: TotalComment,
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 2,
        fill: false,
      },
      {
        label: 'Comments',
        type: 'bar',
        data: TotalComment,
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderWidth: 2,
        fill: false,
      },
    ],
  };

  const chartOptions = {
    scales: {
      x: {
        type: 'category',
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          borderDash: [5, 5],
        },
      },
    },
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md my-5 p-2">
        <h2 className="text-2xl font-semibold mb-4">Posts Chart</h2>
        <Line data={PostsChart} options={chartOptions} />
      </div>
      <div className="bg-white rounded-lg shadow-md my-5 p-2">
        <h2 className="text-2xl font-semibold mb-4">Comments Chart</h2>
        <Line data={CommentsChart} options={chartOptions} />
      </div>
    </>
  );
}

export default Dashboard;
