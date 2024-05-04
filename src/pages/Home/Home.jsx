// Home.jsx

import React, { useEffect, useState } from 'react';
import './Home.css'; // Import CSS file for styling
import axios from 'axios';
import { useAuth } from '../../context/authContext';
import { slide as Menu } from 'react-burger-menu';
import AddStoryModal from '../../components/AddModalStory/AddStoryModal';
import { FaRegEdit } from "react-icons/fa";
import EditStoryModal from '../../components/EditStoryModal/EditStoryModal';
import ViewStoryModal from '../../components/ViewStoryModal/ViewStoryModal';
import { useNavigate } from 'react-router-dom';

const Home = () => {

    const [selectedCategory, setSelectedCategory] = useState('All');
    const [categoryStories, setCategoryStories] = useState([]);

    const [showRegistrationModal, setShowRegistrationModal] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [registrationError, setRegistrationError] = useState('');
    const [loginError, setLoginError] = useState('');

    const { isLoggedIn, logout, login, user, token } = useAuth(); 

    const [showAddStoryModal, setShowAddStoryModal] = useState(false);
    const [showEditStoryModal, setShowEditStoryModal] = useState(false);
    const [showViewStoryModal, setShowViewStoryModal] = useState(false);

    const [userStories, setUserStories] = useState([]);

    const [selectedStory, setSelectedStory] = useState(null);

    const navigate = useNavigate();
  
    useEffect(() => {
      fetchAllStories();
    },[]);

    const fetchAllStories = async () => {
      try {
        const response = await axios.get('https://swiptory-server-fm7r.onrender.com/api/story/category/All');
        if (response.status === 200) {
          setCategoryStories(response.data);
        }
      } catch (error) {
        console.error('Error fetching all stories:', error);
      }
    };

    useEffect(() => {
      if (isLoggedIn) {
          fetchUserStories();
      }
  }, [isLoggedIn]);

    const fetchUserStories = async () => {
        try {
            const response = await axios.get('https://swiptory-server-fm7r.onrender.com/api/story/user',{
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            setUserStories(response.data.stories);
        } catch (error) {
            console.error('Error fetching user stories:', error);
        }
    };

    const handleRegistrationSubmit = async (e) => {
        e.preventDefault();
        if (!username || !password) {
            setRegistrationError('Please fill all inputs');
            return;
        }
        
        try {
            const response = await axios.post('https://swiptory-server-fm7r.onrender.com/api/user/register', {
                username,
                password,
            });
      
            if (response.status === 201) {
              // Registration successful
              const data = response.data;
              console.log('Registration successful');
              login(data.user, data.token);
              // Reset the form fields
              setUsername('');
              setPassword('');
              // Close the modal
              handleRegistrationCloseModal();
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
            const response = await axios.post('https://swiptory-server-fm7r.onrender.com/api/user/login', {
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

    const handleCategoryClick = async (category) => {
        setSelectedCategory(category);
        // try {
        //   const response = await axios.get(`https://swiptory-server-fm7r.onrender.com/api/story/category/${category}`);
        //   setCategoryStories(response.data);
        // } catch (error) {
        //   console.error('Error fetching stories by category:', error);
        // }
    };

    // Function to handle logout
    const handleLogout = () => {
      logout(); 
    };

    const handleAddStoryClick = () => {
      setShowAddStoryModal(true);
    };

    const handleAddStoryCloseModal = () => {
      fetchAllStories();
      fetchUserStories();
      setShowAddStoryModal(false);
      setSelectedStory(null);
    };

    const handleStoryClick = (story) => {
      setSelectedStory(story);
      setShowViewStoryModal(true);
    }

     // Function to open the EditStoryModal
     const handleEditStory = (story) => {
      console.log(story)
      setSelectedStory(story);
      setShowEditStoryModal(true);
    };

    const handleEditStoryCloseModal = () => {
      fetchAllStories();
      fetchUserStories();
      setShowEditStoryModal(false);
      setSelectedStory(null);
    };

    const handleCloseViewStoryModal = () => {
      setShowViewStoryModal(false);
      setSelectedStory(null);
    };

    const redirectToBookmarks = () => {
        navigate('/bookmarks');
    };


  return (
    <div className="home">
      {/* Header */}
      <header className="header">
        <div className="logo">
          <h1>SwipTory</h1>
        </div>
        {isLoggedIn?(
          <div className="user-profile">
            <button className="profile-button" onClick={redirectToBookmarks}>Bookmarks</button>
            <button className="profile-button" onClick={handleAddStoryClick}>Add Story</button>
            <img src={user.profilePic} alt="Profile" className="profile-picture" />
            <Menu isOpen={false} width={ '300px' } right>
              <p className="username">{user.username}</p>
              <button className="menu-button" onClick={handleLogout}>Logout</button>
            </Menu>
          </div>
        ):(
          <div className="auth-buttons">
            <button className="register-button" onClick={handleRegisterClick}>Register Now</button>
            <button className="login-button" onClick={handleLoginClick}>Sign In</button>
          </div>
        )}
      </header>

      <AddStoryModal isOpen={showAddStoryModal} onClose={handleAddStoryCloseModal} />
      <EditStoryModal isOpen={showEditStoryModal} onClose={handleEditStoryCloseModal} story={selectedStory} />

      <ViewStoryModal
        isOpen={showViewStoryModal}
        onClose={handleCloseViewStoryModal}
        story={selectedStory}
        handleLoginClick={handleLoginClick}
      />



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
            style={{ backgroundImage: `url('all.jpeg')` }} 
            onClick={() => handleCategoryClick('All')}
        >
            All
        </div>
        <div 
            className="story-card"
            style={{ backgroundImage: `url('food.jpeg')` }} 
            onClick={() => handleCategoryClick('Food')}
        >
            Food
        </div>
        <div 
            className="story-card"
            style={{ backgroundImage: `url('health.webp')` }} 
            onClick={() => handleCategoryClick('Health and Fitness')}
        >
            Health and Fitness
        </div>
        <div 
            className="story-card"
            style={{ backgroundImage: `url('travel.jpeg')` }} 
            onClick={() => handleCategoryClick('Travel')}
        >
            Travel
        </div>
        <div 
            className="story-card"
            style={{ backgroundImage: `url('movie.jpeg')` }} 
            onClick={() => handleCategoryClick('Movies')}
        >
            Movies
        </div>
        <div 
            className="story-card"
            style={{ backgroundImage: `url('education.jpeg')` }} 
            onClick={() => handleCategoryClick('Education')}
        >
            Education
        </div>
      </section>

      {/* Your Stories */}
      {isLoggedIn && (
          <section id="user-stories" className="user-stories">
              <h2>Your Stories</h2>
              {userStories.length > 0?(
                <div className="stories-list">
                  {userStories.map((story, index) => (
                      <div key={index} className="story" onClick={() => handleStoryClick(story)}>
                        
                        <div className="story-content">
                          <img src={story.forms[0].image} alt={story.forms[0].heading} />
                          <h3>{story.forms[0].heading}</h3>
                          <p>{story.forms[0].description}</p>
                         
                          {/* <p>Category: {story.forms[0].category}</p> */}
                        </div>
                        {isLoggedIn && story.user === user._id && (
                          <button className="edit-button" onClick={(e) => { e.stopPropagation(); handleEditStory(story); }}><FaRegEdit /> Edit</button>
                        )}
                          
                      </div>
                  ))}
                </div> 
                ):(
                    <h3 className='no-stories'>No stories available</h3>
                  )
                }
          </section>
      )}


      {/* Stories by Category */}

      <section id="categories" className="categories">
        {(selectedCategory === 'All' || selectedCategory === 'Food') && (
            <div className="category">
              <h2>Food</h2>
              {categoryStories.filter((story) => story.category === 'Food').length > 0 ? (
              <div className="stories-list">
                {categoryStories
                  .filter((story) => story.category === 'Food')
                  .map((story, index) => (
                    <div key={index} className="story" onClick={() => handleStoryClick(story)}>
                      
                      <div className="story-content">
                        <img src={story.forms[0].image} alt={story.forms[0].heading} />
                        <h3>{story.forms[0].heading}</h3>
                        <p>{story.forms[0].description}</p>
                        

                      </div>
                      {isLoggedIn && story.user === user._id && (
                          <button className="edit-button"><FaRegEdit /> Edit</button>
                        )}
                    </div>
                  ))}
              </div>
              ) : (
                <h3 className='no-stories'>No stories available</h3>
              )}
            </div>
        )}
        {(selectedCategory === 'All' || selectedCategory === 'Health and Fitness') && (
            <div className="category">
            <h2>Health and Fitness</h2>
            {categoryStories.filter((story) => story.category === 'Health and Fitness').length > 0 ? (
              <div className="stories-list">
                {categoryStories
                  .filter((story) => story.category === 'Health and Fitness')
                  .map((story, index) => (
                    <div key={index} className="story" onClick={() => handleStoryClick(story)}>
                      
                      <div className="story-content">
                        <img src={story.forms[0].image} alt={story.forms[0].heading} />
                        <h3>{story.forms[0].heading}</h3>
                        <p>{story.forms[0].description}</p>
                        
  
                      </div>
                      {isLoggedIn && story.user === user._id && (
                          <button className="edit-button"><FaRegEdit /> Edit</button>
                        )}
                    </div>
                  ))}
              </div>
              ) : (
                <h3 className='no-stories'>No stories available</h3>
              )}
            </div>
        )}
        {(selectedCategory === 'All' || selectedCategory === 'Travel') && (
            <div className="category">
            <h2>Travel</h2>
            {categoryStories.filter((story) => story.category === 'Travel').length > 0 ? (
              <div className="stories-list">
                {categoryStories
                  .filter((story) => story.category === 'Travel')
                  .map((story, index) => (
                    <div key={index} className="story" onClick={() => handleStoryClick(story)}>
                      
                      <div className="story-content">
                        <img src={story.forms[0].image} alt={story.forms[0].heading} />
                        <h3>{story.forms[0].heading}</h3>
                        <p>{story.forms[0].description}</p>
                        
                        
                      </div>
                      {isLoggedIn && story.user === user._id && (
                          <button className="edit-button"><FaRegEdit /> Edit</button>
                        )}
                    </div>
                  ))}
              </div>
              ) : (
                <h3 className='no-stories'>No stories available</h3>
              )}
            </div>
        )}
        {(selectedCategory === 'All' || selectedCategory === 'Movies') && (
            <div className="category">
            <h2>Movies</h2>
            {categoryStories.filter((story) => story.category === 'Movies').length > 0 ? (
              <div className="stories-list">
                {categoryStories
                  .filter((story) => story.category === 'Movies')
                  .map((story, index) => (
                    <div key={index} className="story" onClick={() => handleStoryClick(story)}>
                      
                      <div className="story-content">
                        <img src={story.forms[0].image} alt={story.forms[0].heading} />
                        <h3>{story.forms[0].heading}</h3>
                        <p>{story.forms[0].description}</p>
                        
                       
                      </div>
                      {isLoggedIn && story.user === user._id && (
                          <button className="edit-button"><FaRegEdit /> Edit</button>
                        )}
                    </div>
                  ))}
              </div>
              ) : (
                <h3 className='no-stories'>No stories available</h3>
              )}
            </div>
        )}
        {(selectedCategory === 'All' || selectedCategory === 'Education') && (
            <div className="category">
            <h2>Education</h2>
            {categoryStories.filter((story) => story.category === 'Education').length > 0 ? (
              <div className="stories-list">
                {categoryStories
                  .filter((story) => story.category === 'Education')
                  .map((story, index) => (
                    <div key={index} className="story" onClick={() => handleStoryClick(story)}>
                      
                      <div className="story-content">
                        <img src={story.forms[0].image} alt={story.forms[0].heading} />
                      
                        <h3>{story.forms[0].heading}</h3>
                        <p>{story.forms[0].description}</p>
                        
                      
                      </div>
                      {isLoggedIn && story.user === user._id && (
                          <button className="edit-button"><FaRegEdit /> Edit</button>
                        )}
                    </div>
                  ))}
              </div>
              ) : (
                <h3 className='no-stories'>No stories available</h3>
              )}
            </div>
        )}
     
      </section>
      
    </div>
  );
};

export default Home;
