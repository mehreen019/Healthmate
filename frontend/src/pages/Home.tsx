import React from 'react';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <h1 className="title">Welcome to HealthMate</h1>
      <h2 className="subtitle">Your personal health assistant</h2>
      <p className="description">
        HealthMate helps you track your health, get personalized tips, and chat with our AI assistant.
      </p>
      <div className="images-container">
        <img className="image" src="img1.png" alt="Health 1" />
        <img className="image" src="img7.png" alt="Health 2" />
        <img className="image" src="img3.png" alt="Health 3" />
      </div>
    </div>
  );
};

export default Home;
