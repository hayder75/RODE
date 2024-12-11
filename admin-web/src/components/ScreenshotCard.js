import React from 'react';
import { verifyUser } from '../api/index'; // Import your API function

const ScreenshotCard = ({ screenshot }) => {
  const handleVerify = async () => {
    try {
      await verifyUser(screenshot._id); // Call API to verify user
      alert('User verified successfully!');
      // Optionally, you can refresh the dashboard or update state here
    } catch (error) {
      alert('Error verifying user!');
    }
  };

  const handleDecline = async () => {
    try {
      // Implement decline logic here (e.g., remove user's screenshot)
      alert('User declined!');
    } catch (error) {
      alert('Error declining user!');
    }
  };

  return (
    <div className="screenshot-card">
      <img
        src={screenshot.paymentScreenshotUrl}
        alt="Payment Screenshot"
        className="small-image"
      />
      <div className="button-container">
        <button onClick={handleVerify}>Verify</button>
        <button onClick={handleDecline}>Decline</button>
      </div>
    </div>
  );
};

export default ScreenshotCard;
