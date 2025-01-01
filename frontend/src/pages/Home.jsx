import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home-container">
      <h1>Welcome to MRS!</h1>
      <p>
        This is a movie application where you can explore movies, add to your watchlist, and rate movies. Get started by logging in or registering!
      </p>

      <div className="auth-links">
        <Link to="/login" className="auth-button">Login</Link>
        <span> </span>
        <Link to="/register" className="auth-button">Register</Link>
      </div>

      <div className="about-project">
        <h2>About the Project</h2>
        <p>This project allows users to explore movies, add them to a personal watchlist, and write reviews.</p>

        <div className="group-members">
          <h3>Group Members</h3>
          <div className="members-list">
            <div className="member-card">
              <h4>S. M. Ammar Jilani</h4>
              <p>Backend & Lead Developer</p>
            </div>
            <div className="member-card">
              <h4>Muhammad Muzammil Moosani</h4>
              <p>Frontend Developer</p>
            </div>
          </div>
        </div>

        <div className="technologies">
          <h3>Technologies Used</h3>
          <ul>
            <li>React</li>
            <li>Node.js</li>
            <li>Express</li>
            <li>MongoDB</li>
            <li>Axios</li>
            <li>CSS</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Home;
