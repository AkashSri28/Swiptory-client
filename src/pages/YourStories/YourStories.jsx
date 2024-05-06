import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import { FaBookmark } from "react-icons/fa";
import { slide as Menu } from 'react-burger-menu';
import AddStoryModal from '../../components/AddModalStory/AddStoryModal';
import EditStoryModal from '../../components/EditStoryModal/EditStoryModal';
import ViewStoryModal from '../../components/ViewStoryModal/ViewStoryModal';
import axios from 'axios';
import { FaRegEdit } from "react-icons/fa";



function YourStories() {
    const navigate = useNavigate();

    const { isLoggedIn, logout, login, user, token } = useAuth(); 

    const [showAddStoryModal, setShowAddStoryModal] = useState(false);
    const [showEditStoryModal, setShowEditStoryModal] = useState(false);
    const [showViewStoryModal, setShowViewStoryModal] = useState(false);

    const [isOpen, setOpen] = useState(false);


    const [showRegistrationModal, setShowRegistrationModal] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);

    const [userStories, setUserStories] = useState([]);

    const [selectedStory, setSelectedStory] = useState(null);


    useEffect(() => {
        console.log('fetch')
        if (token) {
            console.log('fetch stories')
            fetchUserStories();
        }
    }, [token]);

    
    
  
      const fetchUserStories = async () => {
          try {
              const response = await axios.get('https://swiptory-server-fm7r.onrender.com/api/story/user',{
                headers: {
                  'Authorization': `Bearer ${token}`
                }
              });
              setUserStories(response.data.stories);
              console.log(response.data.stories);
          } catch (error) {
              console.error('Error fetching user stories:', error);
          }
      };
    

    const redirectToHome = () =>{
        navigate('/')
      }

    const redirectToBookmarks = () => {
        navigate('/bookmarks');
    };

    const handleAddStoryClick = () => {
        console.log(isOpen)
        closeSideBar();
        console.log(isOpen)
        setShowAddStoryModal(true);
      };

    const handleLogout = () => {
        logout(); 
    };

    const redirectToYourStory = ()=>{
        navigate('/your-stories')
      }

      const handleRegisterClick = () => {
        closeSideBar();
        setShowRegistrationModal(true);

    };

    const handleLoginClick = () => {
        closeSideBar();
        setShowLoginModal(true);
    };

    

      const handleAddStoryCloseModal = () => {
        fetchUserStories();
        setShowAddStoryModal(false);
        setSelectedStory(null);
      };

      const handleEditStoryCloseModal = () => {
        fetchUserStories();
        setShowEditStoryModal(false);
        setSelectedStory(null);
      };

      const handleCloseViewStoryModal = () => {
        setShowViewStoryModal(false);
        setSelectedStory(null);
      };

      const handleStoryClick = (story) => {
        setSelectedStory(story);
        setShowViewStoryModal(true);
      }

          // Function to open the EditStoryModal
    const handleEditStory = (story) => {
        setSelectedStory(story);
        setShowEditStoryModal(true);
    };

    const handleIsOpen = () => {
        setOpen(!isOpen)
      }
    
      const closeSideBar = () => {
        setOpen(false)
      }

  


  return (
    <div className='home'>
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
        />

        <h2>Your Stories</h2>
            {/* Your Stories */}
            {token && (
                <section className="user-stories">
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
                                <button className="edit-button" onClick={(e) => { 
                                    e.preventDefault();
                                    e.stopPropagation(); 
                                    handleEditStory(story); 
                                }}
                                ><FaRegEdit /> Edit</button>
                                )}
                                
                            </div>
                        ))}
                    </div>
                </section>
        )}

        


    </div>

  )
}

export default YourStories