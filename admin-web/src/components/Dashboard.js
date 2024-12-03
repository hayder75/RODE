import React, { useEffect, useState } from 'react';
import { fetchDashboard, verifyScreenshot } from '../api';
import ScreenshotCard from './ScreenshotCard';

const Dashboard = () => {
    const [userCount, setUserCount] = useState(0);
    const [screenshots, setScreenshots] = useState([]);

    useEffect(() => {
        const loadDashboard = async () => {
            const { data } = await fetchDashboard();
            setUserCount(data.userCount);
            setScreenshots(data.screenshots);
        };
        loadDashboard();
    }, []);

    const handleVerify = async (id) => {
        await verifyScreenshot(id);
        setScreenshots(screenshots.filter((s) => s._id !== id));
    };

    return (
        <div className="dashboard">
            <h1>Admin Dashboard</h1>
            <p>Total Users: {userCount}</p>
            <div className="screenshots">
                {screenshots.map((s) => (
                    <ScreenshotCard key={s._id} screenshot={s} onVerify={handleVerify} />
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
