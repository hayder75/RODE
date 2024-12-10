import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserVerification = () => {
  const [pendingUsers, setPendingUsers] = useState([]);

  useEffect(() => {
    const fetchPendingUsers = async () => {
      const response = await axios.get('/api/pending-verifications');
      setPendingUsers(response.data);
    };
    fetchPendingUsers();
  }, []);

  const handleVerifyUser = async (userId) => {
    // Implement verification logic here
  };

  return (
    <div>
      <h2>Pending User Verifications</h2>
      {pendingUsers.map(user => (
        <div key={user._id}>
          <img src={user.paymentScreenshotUrl} alt="Payment Screenshot" />
          <button onClick={() => handleVerifyUser(user._id)}>Accept</button>
          <button onClick={() => handleDeclineUser(user._id)}>Decline</button>
        </div>
      ))}
    </div>
  );
};

export default UserVerification;
