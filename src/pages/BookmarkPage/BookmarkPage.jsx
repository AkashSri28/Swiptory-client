import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/authContext';
import { useNavigate } from 'react-router-dom';
import { slide as Menu } from 'react-burger-menu';
import AddStoryModal from '../../components/AddModalStory/AddStoryModal';
import { FaRegEdit } from "react-icons/fa";
import EditStoryModal from '../../components/EditStoryModal/EditStoryModal';
import ViewStoryModal from '../../components/ViewStoryModal/ViewStoryModal';

function BookmarkPage() {
    const [bookmarkedStories, setBookmarkedStories] = useState([]);
    const { isLoggedIn, logout, login, user, token } = useAuth(); 
    const navigate = useNavigate();

    const [selectedStory, setSelectedStory] = useState(null);

    const [showAddStoryModal, setShowAddStoryModal] = useState(false);
    const [showEditStoryModal, setShowEditStoryModal] = useState(false);
    const [showViewStoryModal, setShowViewStoryModal] = useState(false);

    const [showRegistrationModal, setShowRegistrationModal] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);

    // Fetch bookmarked stories from the backend when the component mounts
    const fetchBookmarkedStories = async () => {
        try {
            const response = await axios.get('https://swiptory-server-fm7r.onrender.com/api/user/bookmarkedStories',{
                headers: {
                  'Authorization': `Bearer ${token}`
                }
              });
            setBookmarkedStories(response.data.bookmarks);
            console.log(response.data.bookmarks)
        } catch (error) {
            console.error('Error fetching bookmarked stories:', error);
        }
    };

    useEffect(() => {
        fetchBookmarkedStories();
    }, [bookmarkedStories]);

    const redirectToBookmarks = () => {
        navigate('/bookmarks');
    };

    const handleStoryClick = (story) => {
        setSelectedStory(story);
        setShowViewStoryModal(true);
      }

      const handleAddStoryClick = () => {
        setShowAddStoryModal(true);
      };

    // Function to handle logout
    const handleLogout = () => {
        logout(); 
    };

    const handleRegisterClick = () => {
        setShowRegistrationModal(true);
    };

    const handleLoginClick = () => {
        setShowLoginModal(true);
    };

    const handleAddStoryCloseModal = () => {
        setShowAddStoryModal(false);
    };

    const handleEditStoryCloseModal = () => {
        setShowEditStoryModal(false);
        setSelectedStory(null);
    };

    const handleCloseViewStoryModal = () => {
        setShowViewStoryModal(false);
        setSelectedStory(null);
    };

    // Function to open the EditStoryModal
    const handleEditStory = (story) => {
        console.log(story)
        setSelectedStory(story);
        setShowEditStoryModal(true);
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
                <button className="login-button" onClick={handleLoginClick}>Login</button>
            </div>
            )}
        </header>

        <AddStoryModal isOpen={showAddStoryModal} onClose={handleAddStoryCloseModal} />
        <EditStoryModal isOpen={showEditStoryModal} onClose={handleEditStoryCloseModal} story={selectedStory} />

        <ViewStoryModal
            isOpen={showViewStoryModal}
            onClose={handleCloseViewStoryModal}
            story={selectedStory}
        />

        <h2>Your Bookmarks</h2>
        {/* Your Stories */}
        {isLoggedIn && (
            <section id="user-stories" className="user-stories">
                <div className="stories-list">
                    {bookmarkedStories.map((story, index) => (
                        <div key={index} className="story" onClick={() => handleStoryClick(story)}>
                            
                            <div className="story-content">
                            
                            <h3>{story.forms[0].heading}</h3>
                            <p>{story.forms[0].description}</p>
                            <img src={story.forms[0].image} alt={story.forms[0].heading} />
                            {/* <p>Category: {story.forms[0].category}</p> */}
                            </div>
                            {isLoggedIn && story.user === user._id && (
                            <button className="edit-button" onClick={(e) => { e.stopPropagation(); handleEditStory(story); }}><FaRegEdit /> Edit</button>
                            )}
                            
                        </div>
                    ))}
                </div>
            </section>
        )}
    </div>
  )
}

export default BookmarkPage