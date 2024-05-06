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
import { GoEye, GoEyeClosed } from "react-icons/go";
import { FaBookmark } from "react-icons/fa";

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

    const [showAllUserStories, setShowAllUserStories] = useState(false); 
    const [showAllFoodStories, setShowAllFoodStories] = useState(false); 
    const [showAllHealthStories, setShowAllHealthStories] = useState(false); 
    const [showAllTravelStories, setShowAllTravelStories] = useState(false); 
    const [showAllMoviesStories, setShowAllMoviesStories] = useState(false); 
    const [showAllEducationStories, setShowAllEducationStories] = useState(false); 

    const [showPassword, setShowPassword] = useState(false);

    // State to track whether the menu is open or closed
    const [menuOpen, setMenuOpen] = useState(false);
    const [isOpen, setOpen] = useState(false)

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
      
            if (response.status === 200) {
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
              setRegistrationError(response.data.message)
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
              login(data.user, data.token);
              // Reset the form fields
              setUsername('');
              setPassword('');
              // Close the modal
              handleLoginCloseModal();
            } else {
              // Login failed
              setLoginError(response.data.message)
              console.error('Login failed');
            }
        } catch (error) {
          console.error('Error logging in:', error);
        }
    };

    const handleRegisterClick = () => {
        closeSideBar();
        setShowRegistrationModal(true);

    };

    const handleRegistrationCloseModal = () => {
        setShowRegistrationModal(false);
        setRegistrationError('');
        setUsername('');
        setPassword('');
    };

    const handleLoginClick = () => {
        closeSideBar();
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
      closeSideBar();
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

    const handleShowMoreClick = (sectionId) => {
        switch (sectionId) {
          case 'userStories':
              setShowAllUserStories(true);
              break;
          case 'foodStories':
              setShowAllFoodStories(true);
              break;
          case 'healthStories':
              setShowAllHealthStories(true);
              break;
          case 'travelStories':
              setShowAllTravelStories(true);
              break;
          case 'moviesStories':
              setShowAllMoviesStories(true);
              break;
          case 'educationStories':
              setShowAllEducationStories(true);
              break;
          default:
              break;
      }
    };



    const handleIsOpen = () => {
      setOpen(!isOpen)
    }
  
    const closeSideBar = () => {
      setOpen(false)
    }

    const redirectToHome = () =>{
      navigate('/')
    }
  
    const redirectToYourStory = ()=>{
      navigate('/your-stories')
    }


  return (
    <div className="home">
      {/* Header */}
      <header className="header">
        <div onClick={redirectToHome} className="logo">
          <h1>SwipTory</h1>
        </div>
        {isLoggedIn?(
          <>
           <div className="user-profile">
            <button className="profile-button" onClick={redirectToBookmarks}>
              <FaBookmark size={15} style={{ marginRight: '5px' }}  />
              Bookmarks
            </button>
            <button className="profile-button" onClick={handleAddStoryClick}>Add Story</button>
            <img src={user.profilePic} alt="Profile" className="profile-picture" />
            <Menu isOpen={false} width={ '300px' } right>
              <p className="username">{user.username}</p>
              <button className="menu-button" onClick={handleLogout}>Logout</button>
            </Menu>
          </div>
          <div className="mobile-user-profile">
            {/* <Menu 
              isOpen={isOpen}
              // onOpen={handleIsOpen}
              // onClose={handleIsOpen}
              width={'100%'} 
              height={'50%'} 
              right
            >
              <button className="close-menu-button" onClick={()=>closeSideBar()}>X</button>
              <div className="user-info">
                <img src={user.profilePic} alt="Profile" className="profile-picture" />
                <p className="username">{user.username}</p>
              </div>
              <button className="your-story-button" onClick={handleLogout}>Your Story</button> 
              <button className="profile-button" onClick={redirectToBookmarks}>
                <FaBookmark size={15} style={{ marginRight: '5px' }}  />
                Bookmarks
              </button>
              <button className="profile-button" onClick={handleAddStoryClick}>Add Story</button>
             
              <button className="menu-button" onClick={handleLogout}>Logout</button>

            </Menu> */}

           

            <Menu 
              isOpen={isOpen}
              onOpen={handleIsOpen}
              onClose={handleIsOpen}
              width={'100%'} 
              right>
              {/* <button className="close-menu-button" onClick={()=>closeSideBar()}>X</button> */}
              <div className="user-info">
                <img src={user.profilePic} alt="Profile" className="profile-picture" />
                <p className="username">{user.username}</p>
              </div>
              <button className="your-story-button" onClick={redirectToYourStory}>Your Story</button> 
              <button className="profile-button" onClick={redirectToBookmarks}>
                <FaBookmark size={15} style={{ marginRight: '5px' }}  />
                Bookmarks
              </button>
              <button className="profile-button" onClick={handleAddStoryClick}>Add Story</button>
             
              <button className="menu-button" onClick={handleLogout}>Logout</button>

            </Menu>
           

          </div>
          </>
         
        ):(
          <>
             <div className="auth-buttons">
              <button className="register-button" onClick={handleRegisterClick}>Register Now</button>
              <button className="login-button" onClick={handleLoginClick}>Sign In</button>
            </div>
            <div className="mobile-auth-buttons">
              <Menu isOpen={isOpen}
                onOpen={handleIsOpen}
                onClose={handleIsOpen}
                width={'100%'} height={'50%'} right>
                {/* <button className="close-menu-button" onClick={handleCloseMenuClick}>X</button> */}
                <button onClick={handleLoginClick}>Login</button>
                <button onClick={handleRegisterClick}>Register</button>
                

              </Menu>
            </div>
          
          </>

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
                <label htmlFor="username">Username</label>
                <input type="text" id="username" name="username" placeholder="Enter username" value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="password-input">
                  <input type={showPassword ? "text" : "password"} id="password" name="password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} />
                  <span className="password-toggle" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <GoEye /> : <GoEyeClosed />}</span>
                </div>

                </div>
                {registrationError && <p className="error-message">{registrationError}</p>}

                <button className='register-submit' type="submit">Register</button>
                
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
                <label htmlFor="username">Username</label>
                <input type="text" id="username" name="username" placeholder="Enter username" value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div className="form-group">
                <label htmlFor="password">Password</label>

                <div className="password-input">
                  <input type={showPassword ? "text" : "password"} id="password" name="password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} />
                  <span className="password-toggle" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <GoEye /> : <GoEyeClosed />}</span>
                </div>
               
                </div>
                {loginError && <p className="error-message">{loginError}</p>}
                
                <button className='register-submit' type="submit">Login</button>
                
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
      {isLoggedIn && selectedCategory === 'All' && (
          <section id="user-stories" className="user-stories">
              <h2>Your Stories</h2>
              {userStories.length > 0?(
                <div className="stories-list">
                  {showAllUserStories?
                    (userStories.map((story, index) => (
                      <div key={index} className="story" onClick={() => handleStoryClick(story)}>
                        
                        <div className="story-content">
                          <img src={story.forms[0].image} alt={story.forms[0].heading} />
                          <h3>{story.forms[0].heading}</h3>
                          <p>{story.forms[0].description}</p>
                         
                        </div>
                        {isLoggedIn && story.user === user._id && (
                          <button className="edit-button" onClick={(e) => { e.stopPropagation(); handleEditStory(story); }}><FaRegEdit /> Edit</button>
                        )}
                      </div>
                  ))):(
                    userStories
                    .slice(0,4)
                    .map((story, index) => (
                      <div key={index} className="story" onClick={() => handleStoryClick(story)}>
                        
                        <div className="story-content">
                          <img src={story.forms[0].image} alt={story.forms[0].heading} />
                          <h3>{story.forms[0].heading}</h3>
                          <p>{story.forms[0].description}</p>
                         
                        </div>
                        {isLoggedIn && story.user === user._id && (
                          <button className="edit-button" onClick={(e) => { e.stopPropagation(); handleEditStory(story); }}><FaRegEdit /> Edit</button>
                        )}
                      </div>
                  ))

                )}

                </div> 
                ):(
                    <h3 className='no-stories'>No stories available</h3>
                  )
                }

                {(userStories.length > 4 && !showAllUserStories) && ( // Show "Show More" button if all stories are not shown
                    <button className="show-more-button" onClick={()=>handleShowMoreClick('userStories')}>Show More</button>
                )}

                
          </section>
      )}


      {/* Stories by Category */}

      <section id="categories" className="categories">
        {(selectedCategory === 'All' || selectedCategory === 'Food') && (
            <div className="category">
              <h2>Top Stories About Food</h2>
              {categoryStories.filter((story) => story.category === 'Food').length > 0 ? (
              <div className="stories-list">
                {showAllFoodStories?
                  (categoryStories
                  .filter((story) => story.category === 'Food')
                  .map((story, index) => (
                    <div key={index} className="story" onClick={() => handleStoryClick(story)}>
                      
                      <div className="story-content">
                        <img src={story.forms[0].image} alt={story.forms[0].heading} />
                        <h3>{story.forms[0].heading}</h3>
                        <p>{story.forms[0].description}</p>        

                      </div>
                      {isLoggedIn && story.user === user._id && (
                        <button className="edit-button" onClick={(e) => { 
                          e.preventDefault();
                          e.stopPropagation(); 
                          handleEditStory(story); 
                        }}
                      ><FaRegEdit /> Edit</button>
                      )}
                    </div>
                  ))):(
                    categoryStories
                      .filter((story) => story.category === 'Food')
                      .slice(0, 4)
                      .map((story, index) => (
                        <div key={index} className="story" onClick={() => handleStoryClick(story)}>
                          
                          <div className="story-content">
                            <img src={story.forms[0].image} alt={story.forms[0].heading} />
                            <h3>{story.forms[0].heading}</h3>
                            <p>{story.forms[0].description}</p>

                          </div>
                          {isLoggedIn && story.user === user._id && (
                          <button className="edit-button" onClick={(e) => { 
                              e.preventDefault();
                              e.stopPropagation(); 
                              handleEditStory(story); 
                          }}
                          ><FaRegEdit /> Edit</button>
                          )}
                        </div>
                      ))
                  )
                }
              </div>
              ) : (
                <h3 className='no-stories'>No stories available</h3>
              )}
              {
                (categoryStories.filter((story) => story.category === 'Food').length > 4 && !showAllFoodStories)
                    && ( // Show "Show More" button if all stories are not shown
                  <button className="show-more-button" onClick={()=>handleShowMoreClick('foodStories')}>Show More</button>
              )}
            </div>
        )}
        {(selectedCategory === 'All' || selectedCategory === 'Health and Fitness') && (
            <div className="category">
            <h2>Top Stories About Health and Fitness</h2>
            {
            categoryStories.filter((story) => story.category === 'Health and Fitness').length > 0 ? (
              <div className="stories-list">
                {showAllHealthStories? 
                  (categoryStories
                  .filter((story) => story.category === 'Health and Fitness')
                  .map((story, index) => (
                    <div key={index} className="story" onClick={() => handleStoryClick(story)}>
                      
                      <div className="story-content">
                        <img src={story.forms[0].image} alt={story.forms[0].heading} />
                        <h3>{story.forms[0].heading}</h3>
                        <p>{story.forms[0].description}</p>
                        
  
                      </div>
                      {isLoggedIn && story.user === user._id && (
                        <button className="edit-button" onClick={(e) => { 
                            e.preventDefault();
                            e.stopPropagation(); 
                            handleEditStory(story); 
                        }}
                        ><FaRegEdit /> Edit</button>
                      )}
                    </div>
                  ))
                ):(
                  categoryStories
                  .filter((story) => story.category === 'Health and Fitness')
                  .slice(0,4)
                  .map((story, index) => (
                    <div key={index} className="story" onClick={() => handleStoryClick(story)}>
                      
                      <div className="story-content">
                        <img src={story.forms[0].image} alt={story.forms[0].heading} />
                        <h3>{story.forms[0].heading}</h3>
                        <p>{story.forms[0].description}</p>
                        
  
                      </div>
                      {isLoggedIn && story.user === user._id && (
                        <button className="edit-button" onClick={(e) => { 
                            e.preventDefault();
                            e.stopPropagation(); 
                            handleEditStory(story); 
                        }}
                        ><FaRegEdit /> Edit</button>
                        )}
                    </div>
                  ))
                )}

               
              </div>
              ) : (
                <h3 className='no-stories'>No stories available</h3>
              )}
              {
              (categoryStories.filter((story) => story.category === 'Health and Fitness').length > 4 && !showAllHealthStories)
                && ( // Show "Show More" button if all stories are not shown
                <button className="show-more-button" onClick={()=>handleShowMoreClick('healthStories')}>Show More</button>
              )}
            </div>
        )}
        {(selectedCategory === 'All' || selectedCategory === 'Travel') && (
            <div className="category">
            <h2>Top Stories About Travel</h2>
            {categoryStories.filter((story) => story.category === 'Travel').length > 0 ? (
              <div className="stories-list">
                {showAllTravelStories?
                  (categoryStories
                  .filter((story) => story.category === 'Travel')
                  .map((story, index) => (
                    <div key={index} className="story" onClick={() => handleStoryClick(story)}>
                      
                      <div className="story-content">
                        <img src={story.forms[0].image} alt={story.forms[0].heading} />
                        <h3>{story.forms[0].heading}</h3>
                        <p>{story.forms[0].description}</p>
                        
                        
                      </div>
                      {isLoggedIn && story.user === user._id && (
                        <button className="edit-button" onClick={(e) => { 
                            e.preventDefault();
                            e.stopPropagation(); 
                            handleEditStory(story); 
                        }}
                        ><FaRegEdit /> Edit</button>
                        )}
                    </div>
                  ))
                ):(
                  categoryStories
                  .filter((story) => story.category === 'Travel')
                  .slice(0,4)
                  .map((story, index) => (
                    <div key={index} className="story" onClick={() => handleStoryClick(story)}>
                      
                      <div className="story-content">
                        <img src={story.forms[0].image} alt={story.forms[0].heading} />
                        <h3>{story.forms[0].heading}</h3>
                        <p>{story.forms[0].description}</p>
                        
                        
                      </div>
                      {isLoggedIn && story.user === user._id && (
                        <button className="edit-button" onClick={(e) => { 
                            e.preventDefault();
                            e.stopPropagation(); 
                            handleEditStory(story); 
                        }}
                        ><FaRegEdit /> Edit</button>
                        )}
                    </div>
                  ))
                )}
                 
              </div>
              ) : (
                <h3 className='no-stories'>No stories available</h3>
              )}
              {
                (categoryStories.filter((story) => story.category === 'Travel').length > 4 && !showAllTravelStories)
                    && ( // Show "Show More" button if all stories are not shown
                  <button className="show-more-button" onClick={()=>handleShowMoreClick('travelStories')}>Show More</button>
              )}
            </div>
        )}
        {(selectedCategory === 'All' || selectedCategory === 'Movies') && (
            <div className="category">
            <h2>Top Stories About Movies</h2>
            {categoryStories.filter((story) => story.category === 'Movies').length > 0 ? (
              <div className="stories-list">
                {showAllMoviesStories?
                  (categoryStories
                  .filter((story) => story.category === 'Movies')
                  .map((story, index) => (
                    <div key={index} className="story" onClick={() => handleStoryClick(story)}>
                      
                      <div className="story-content">
                        <img src={story.forms[0].image} alt={story.forms[0].heading} />
                        <h3>{story.forms[0].heading}</h3>
                        <p>{story.forms[0].description}</p>
                        
                       
                      </div>
                      {isLoggedIn && story.user === user._id && (
                        <button className="edit-button" onClick={(e) => { 
                            e.preventDefault();
                            e.stopPropagation(); 
                            handleEditStory(story); 
                        }}
                        ><FaRegEdit /> Edit</button>
                        )}
                    </div>
                  ))
                ):(
                  categoryStories
                  .filter((story) => story.category === 'Movies')
                  .slice(0,4)
                  .map((story, index) => (
                    <div key={index} className="story" onClick={() => handleStoryClick(story)}>
                      
                      <div className="story-content">
                        <img src={story.forms[0].image} alt={story.forms[0].heading} />
                        <h3>{story.forms[0].heading}</h3>
                        <p>{story.forms[0].description}</p>
                        
                       
                      </div>
                      {isLoggedIn && story.user === user._id && (
                        <button className="edit-button" onClick={(e) => { 
                            e.preventDefault();
                            e.stopPropagation(); 
                            handleEditStory(story); 
                        }}
                        ><FaRegEdit /> Edit</button>
                        )}
                    </div>
                  ))
                )}
                 
              </div>
              ) : (
                <h3 className='no-stories'>No stories available</h3>
              )}
              {
                (categoryStories.filter((story) => story.category === 'Movies').length > 4 && !showAllMoviesStories)
                  && ( // Show "Show More" button if all stories are not shown
                  <button className="show-more-button" onClick={()=>handleShowMoreClick('moviesStories')}>Show More</button>
              )}
            </div>
        )}
        {(selectedCategory === 'All' || selectedCategory === 'Education') && (
            <div className="category">
            <h2>Top Stories About Education</h2>
            {categoryStories.filter((story) => story.category === 'Education').length > 0 ? (
              <div className="stories-list">
                {showAllEducationStories?
                  (categoryStories
                  .filter((story) => story.category === 'Education')
                  .map((story, index) => (
                    <div key={index} className="story" onClick={() => handleStoryClick(story)}>
                      
                      <div className="story-content">
                        <img src={story.forms[0].image} alt={story.forms[0].heading} />
                      
                        <h3>{story.forms[0].heading}</h3>
                        <p>{story.forms[0].description}</p>
                        
                      
                      </div>
                      {isLoggedIn && story.user === user._id && (
                        <button className="edit-button" onClick={(e) => { 
                            e.preventDefault();
                            e.stopPropagation(); 
                            handleEditStory(story); 
                        }}
                        ><FaRegEdit /> Edit</button>
                        )}
                    </div>
                  ))
                ):(
                  categoryStories
                  .filter((story) => story.category === 'Education')
                  .slice(0,4)
                  .map((story, index) => (
                    <div key={index} className="story" onClick={() => handleStoryClick(story)}>
                      
                      <div className="story-content">
                        <img src={story.forms[0].image} alt={story.forms[0].heading} />
                      
                        <h3>{story.forms[0].heading}</h3>
                        <p>{story.forms[0].description}</p>
                        
                      
                      </div>
                      {isLoggedIn && story.user === user._id && (
                        <button className="edit-button" onClick={(e) => { 
                            e.preventDefault();
                            e.stopPropagation(); 
                            handleEditStory(story); 
                        }}
                        ><FaRegEdit /> Edit</button>
                        )}
                    </div>
                  ))
                )}
                 
              </div>
              ) : (
                <h3 className='no-stories'>No stories available</h3>
              )}
              {
                (categoryStories.filter((story) => story.category === 'Education').length > 4 && !showAllEducationStories)
                    && ( // Show "Show More" button if all stories are not shown
                  <button className="show-more-button" onClick={()=>handleShowMoreClick('educationStories')}>Show More</button>
              )}
            </div>
        )}
     
      </section>
      
    </div>
  );
};

export default Home;
