import React from 'react';

const ScreenshotCard = ({ screenshot, onVerify }) => {
    return (
        <div className="screenshot-card">
            <img src={screenshot.imageUrl} alt="Screenshot" />
            <button onClick={() => onVerify(screenshot._id)}>Verify</button>
        </div>
    );
};

export default ScreenshotCard;
