// Home.jsx

import React, { useState } from 'react';
import './Home.css'; // Import CSS file for styling
import axios from 'axios';

const Home = () => {

    const [selectedCategory, setSelectedCategory] = useState('All');

    const [showRegistrationModal, setShowRegistrationModal] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [registrationError, setRegistrationError] = useState('');
    const [loginError, setLoginError] = useState('');

    const handleRegistrationSubmit = async (e) => {
        e.preventDefault();
        if (!username || !password) {
            setRegistrationError('Please fill all inputs');
            return;
        }
        
        try {
            const response = await axios.post('http://localhost:4000/api/user/register', {
                username,
                password,
            });
      
            if (response.status === 201) {
              // Registration successful
              const data = response.data;
              console.log('Registration successful');
              console.log('Token:', data.token); // Store this token in local storage
              console.log('User:', data.user);
              // Reset the form fields
              setUsername('');
              setPassword('');
              // Close the modal
              handleRegistrationCloseModal();
              localStorage.setItem('token', data.token);
              localStorage.setItem('user', JSON.stringify(data.user));
            } else {
              // Registration failed
              console.error('Registration failed');
            }
        } catch (error) {
        console.error('Error registering user:', error);
        }
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();

        if (!username || !password) {
            setLoginError('Please fill all inputs');
            return;
        }
        
        try {
            const response = await axios.post('http://localhost:4000/api/user/login', {
                username,
                password,
            });
      
            if (response.status === 200) {
              // Login successful
              const data = response.data;
              console.log('Login successful');
              console.log('Token:', data.token); // Store this token in local storage
              console.log('User:', data.user);
              // Reset the form fields
              setUsername('');
              setPassword('');
              // Close the modal
              handleLoginCloseModal();
              localStorage.setItem('token', data.token);
              localStorage.setItem('user', JSON.stringify(data.user));
            } else {
              // Login failed
              console.error('Login failed');
            }
        } catch (error) {
        console.error('Error logging in:', error);
        }
    };

    const handleRegisterClick = () => {
        setShowRegistrationModal(true);
    };

    const handleRegistrationCloseModal = () => {
        setShowRegistrationModal(false);
        setRegistrationError('');
        setUsername('');
        setPassword('');
    };

    const handleLoginClick = () => {
        setShowLoginModal(true);
    };

    const handleLoginCloseModal = () => {
        setShowLoginModal(false);
        setLoginError('');
        setUsername('');
        setPassword('');
    };

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
    };

  return (
    <div className="home">
      {/* Header */}
      <header className="header">
        <div className="logo">
          <h1>SwipTory</h1>
        </div>
        <div className="auth-buttons">
            <button className="register-button" onClick={handleRegisterClick}>Register Now</button>
            <button className="login-button" onClick={handleLoginClick}>Login</button>
        </div>
      </header>

      {/* Registration Modal */}
      {showRegistrationModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleRegistrationCloseModal}>&times;</span>
            <h2>Register to SwipTory</h2>
            <form onSubmit={handleRegistrationSubmit}>
                <div className="form-group">
                <label htmlFor="username">Username:</label>
                <input type="text" id="username" name="username" value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div className="form-group">
                <label htmlFor="password">Password:</label>
                <input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                {registrationError && <p className="error-message">{registrationError}</p>}
                <button type="submit">Register</button>
                
            </form>
          </div>
        </div>
      )}

      {/* Login Modal */}
      {showLoginModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleLoginCloseModal}>&times;</span>
            <h2>Login to SwipTory</h2>
            <form onSubmit={handleLoginSubmit}>
                <div className="form-group">
                <label htmlFor="username">Username:</label>
                <input type="text" id="username" name="username" value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div className="form-group">
                <label htmlFor="password">Password:</label>
                <input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                {loginError && <p className="error-message">{loginError}</p>}
                
                <button type="submit">Login</button>
                
            </form>
          </div>
        </div>
      )}

      {/* Story Cards */}
      <section id="stories" className="story-cards">
        <div 
            className="story-card"
            onClick={() => handleCategoryClick('All')}
        >
            All
        </div>
        <div 
            className="story-card"
            onClick={() => handleCategoryClick('Food')}
        >
            Food
        </div>
        <div 
            className="story-card"
            onClick={() => handleCategoryClick('Health and Fitness')}
        >
            Health and Fitness
        </div>
        <div 
            className="story-card"
            onClick={() => handleCategoryClick('Travel')}
        >
            Travel
        </div>
        <div 
            className="story-card"
            onClick={() => handleCategoryClick('Movies')}
        >
            Movies
        </div>
        <div 
            className="story-card"
            onClick={() => handleCategoryClick('Education')}
        >
            Education
        </div>
      </section>

      {/* Stories by Category */}

      <section id="categories" className="categories">
        {(selectedCategory === 'All' || selectedCategory === 'Food') && (
            <div className="category">
            <h2>Food</h2>
            <h3>No stories available</h3>
            {/* Stories for Food category */}
            </div>
        )}
        {(selectedCategory === 'All' || selectedCategory === 'Health and Fitness') && (
            <div className="category">
            <h2>Health and Fitness</h2>
            <h3>No stories available</h3>
            {/* Stories for Health and Fitness category */}
            </div>
        )}
        {(selectedCategory === 'All' || selectedCategory === 'Travel') && (
            <div className="category">
            <h2>Travel</h2>
            <h3>No stories available</h3>
            {/* Stories for Travel category */}
            </div>
        )}
        {(selectedCategory === 'All' || selectedCategory === 'Movies') && (
            <div className="category">
            <h2>Movies</h2>
            <h3>No stories available</h3>
            {/* Stories for Movies category */}
            </div>
        )}
        {(selectedCategory === 'All' || selectedCategory === 'Education') && (
            <div className="category">
            <h2>Education</h2>
            <h3>No stories available</h3>
            {/* Stories for Education category */}
            </div>
        )}
     
      </section>
      
    </div>
  );
};

export default Home;
