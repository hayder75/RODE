import React, { useEffect, useState } from 'react';
import { getPendingVerifications } from '../api/index';
import ScreenshotCard from './ScreenshotCard';
import { Link } from 'react-router-dom'; // Import Link for navigation
import './Dashboard.css';

const Dashboard = () => {
  const [screenshots, setScreenshots] = useState([]);

  useEffect(() => {
    const loadPendingUsers = async () => {
      try {
        const { data } = await getPendingVerifications();
        setScreenshots(data);
      } catch (error) {
        console.error(
          'Error fetching pending verifications:',
          error.response ? error.response.data : error.message
        );
        alert('Failed to fetch pending verifications.');
      }
    };

    loadPendingUsers();
  }, []);

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <h2>Pending User Verifications</h2>
      </header>
      
      {/* Navigation to User Management */}
      <nav>
        <Link to="/users">
          <button className="user-management-button">Manage Users</button>
        </Link>
      </nav>

      {screenshots.length === 0 ? (
        <p className="no-verifications">No users to be verified.</p>
      ) : (
        <div className="screenshots-container">
          {screenshots.map((screenshot) => (
            <ScreenshotCard key={screenshot._id} screenshot={screenshot} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
