// ViewStoryModal.jsx

import React, { useEffect, useState } from 'react';
import './ViewStoryModal.css';
import { FiSend } from "react-icons/fi";
import { FaBookmark, FaHeart } from "react-icons/fa";
import { GrNext, GrPrevious } from "react-icons/gr";
import { IoMdClose } from "react-icons/io";
import axios from 'axios';
import { useAuth } from '../../context/authContext';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Stories from 'react-insta-stories';


const ViewStoryModal = ({ isOpen, onClose, story, handleLoginClick }) => {
    const [currentForm, setCurrentForm] = useState(0);
    const [progress, setProgress] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [storyProgress, setStoryProgress] = useState([]);

    const [likeCount, setLikeCount] = useState(0);

    const {token, isLoggedIn} = useAuth();

    useEffect(() => {
        if (token) {
            // Check if story is liked by the user
            checkStoryLiked();
            // Check if story is bookmarked by the user
            checkStoryBookmarked();
            setLikeCount(story?.likes);
        }
    }, [token, story]);

    useEffect(() => {
        const timer = setTimeout(() => {
            handleNext();
        }, 5000);
        return () => clearTimeout(timer);
    }, [currentForm, story]);


    useEffect(() => {
        if (story && story.forms && story.forms.length > 0) {
            const progressArray = story.forms.map(() => 0);
            setStoryProgress(progressArray);

            const timer = setInterval(() => {
                setProgress((prevProgress) => {
                    if (prevProgress >= 100) {
                        return 0;
                    }
                    return prevProgress + (100 / 50);
                });

                setStoryProgress((prevStoryProgress) => {
                    const updatedProgress = [...prevStoryProgress];
                    updatedProgress[currentForm] += (100 / 50);
                    return updatedProgress;
                });
            }, 100);
            return () => clearInterval(timer);
        }
    }, [currentForm, story]);

    const checkStoryLiked = async () => {
        if(!story){
            return
        }
        try {
            const response = await axios.get(`https://swiptory-server-fm7r.onrender.com/api/story/checkLike/${story._id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log('Like',response.data)
            if (response.data.isLiked) {
                setIsLiked(true);
            } else {
                setIsLiked(false);
            }
        } catch (error) {
            console.error('Error checking if story is liked:', error);
        }
    };

    const checkStoryBookmarked = async () => {
        if(!story){
            return;
        }
        try {
            const response = await axios.get(`https://swiptory-server-fm7r.onrender.com/api/user/checkBookmark/${story._id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log('Bookmark',response.data.success)
            if (response.data.isBookmarked) {
                setIsBookmarked(true);
            } else {
                setIsBookmarked(false);
            }
        } catch (error) {
            console.error('Error checking if story is bookmarked:', error);
        }
    };

    const handleNext = () => {
        if (story && story.forms && story.forms.length > 0) {
            setCurrentForm((prevForm) => (prevForm === story.forms.length - 1 ? 0 : prevForm + 1));
            setProgress(0);
        }
    };
  
    const handlePrevious = () => {
        if (story && story.forms && story.forms.length > 0) {
            setCurrentForm((prevForm) => (prevForm === 0 ? story.forms.length - 1 : prevForm - 1));
            setProgress(0);
        }
    };

    const handleLike = async (story) => {
        console.log("handle like function")
        if(!token){
            onClose();
            handleLoginClick();
        }
        const storyId = story._id;
        try {
            const response = await axios.post('https://swiptory-server-fm7r.onrender.com/api/story/like', {
                storyId
            },{
                headers: {
                'Authorization': `Bearer ${token}`
                }
            }
            );
            if (response.data.success) {
                console.log("Success", response.data.message)
                setLikeCount(response.data.likeCount);
                console.log(response.data.likeCount)
                checkStoryLiked();
            }
            else{
                console.log("Failed", response.data.message)
            }
        } catch (error) {
            console.error('Error liking story:', error);
            // Handle error (e.g., display an error message to the user)
        }
    };

    const handleBookmark = async (story) => {
        if(!token){
            onClose();
            handleLoginClick();
        }
        // setIsBookmarked(!isBookmarked);
        console.log("handle bookmark function")
        const storyId = story._id;
        try{
            const response = await axios.post('https://swiptory-server-fm7r.onrender.com/api/user/bookmark', {
                storyId
              },{
                headers: {
                  'Authorization': `Bearer ${token}`
                }
              }
            );
            if (response.data.success) {
                console.log("Success", response.data.message)
                checkStoryBookmarked();
            }
            else{
                console.log("Failed", response.data.message)
            }
        } catch (error) {
            console.error('Error bookmarking story:', error);
        }
    };

    const generatePublicLink = (storyId) => {
        const publicLink = `https://swiptory-client-tau.vercel.app/story/${storyId}`; // Example URL, replace with your actual URL logic
        return publicLink;
    };

    const handleSendButtonClick = (storyId) => {
        const publicLink = generatePublicLink(storyId);
        navigator.clipboard.writeText(publicLink)
            .then(() => {
                toast("Link copied to clipboard");
                console.log('uRL copied')
            })
            .catch(error => {
                console.error('Error copying public link to clipboard:', error);
            });
    };

    const handleTap = (e) => {
        const containerWidth = e.currentTarget.offsetWidth; // Width of the container
        const tapX = e.clientX - e.currentTarget.getBoundingClientRect().left; // X coordinate of the tap relative to the container
    
        // Calculate the threshold for left and right sides (you can adjust this threshold as needed)
        const threshold = 0.3; // For example, 30% of the container width
    
        if (tapX < containerWidth * threshold) {
            // Tapped on the left side
            handlePrevious();
        } else if (tapX > containerWidth * (1 - threshold)) {
            // Tapped on the right side
            handleNext();
        }
    };

  return (
    <>
        {isOpen && (<div className="view-modal">
            <div className="view-story-modal">

                <div className="progress-bar-container" style={{ display: 'flex' }}>
                    {story && story.forms && story.forms.length > 0 && (
                        story.forms.map((form, index) => (
                            <div key={index} className="progress-bar" style={{width: '100%'}}>
                                <div key={index} className="progress-bar-fill" style={{ width: `${storyProgress[index]}%`, flex: '1', marginRight: '5px' }}></div>

                            </div>
                        ))
                    )}

                </div>


                <div className="close-send-buttons">
                    <span className="close-button" onClick={onClose}><IoMdClose size={20}/></span>
                    <span className="send-button" onClick={()=>handleSendButtonClick(story._id)}><FiSend size={20}/></span>
                   
                </div>


                {story && story.forms && story.forms.length > 0 && (
                    <div>
                        <img src={story.forms[currentForm].image} alt={story.forms[currentForm].heading} />
                        <h3>{story.forms[currentForm].heading}</h3>
                        <p>{story.forms[currentForm].description}</p>
                        
                    </div>
                )}

                <div className="interactions">
                    <button className='bookmark-btn' onClick={()=>handleBookmark(story)}>
                        <FaBookmark size={20} style={{color: isBookmarked? 'blue': 'inherit'}} />
                    </button>
                    <button className='like-btn' onClick={()=>handleLike(story)}>
                        <FaHeart size={20} style={{color: isLiked? 'red': 'inherit'}} />
                        <span> {likeCount}</span>
                    </button>
                </div>

               
            </div>
            <div className="navigation">
                <button onClick={handlePrevious}><GrPrevious size={100}/></button>
                <button onClick={handleNext}><GrNext size={100}/></button>
            </div>
            <ToastContainer position="top-center" autoClose={2000} hideProgressBar={true} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
        </div>
    )}
    {isOpen && (<div className="mobile-view-modal">
            <div className="mobile-view-story-modal">
                <div className="progress-bar-container" style={{ display: 'flex' }}>
                    {story && story.forms && story.forms.length > 0 && (
                        story.forms.map((form, index) => (
                            <div key={index} className="progress-bar" style={{width: '100%'}}>
                                <div key={index} className="progress-bar-fill" style={{ width: `${storyProgress[index]}%`, flex: '1', marginRight: '5px' }}></div>

                            </div>
                        ))
                    )}

                </div>

                <div className="close-send-buttons">
                    <span className="close-button" onClick={onClose}><IoMdClose size={20} /></span>
                    <span className="send-button" onClick={()=>handleSendButtonClick(story._id)}><FiSend size={20} /></span>
                   
                </div>


                {story && story.forms && story.forms.length > 0 && (
                    <div onClick={handleTap}>
                        <img src={story.forms[currentForm].image} alt={story.forms[currentForm].heading} />
                        <h3>{story.forms[currentForm].heading}</h3>
                        <p>{story.forms[currentForm].description}</p>
                        
                    </div>
                )}

                <div className="interactions">
                    <button className='bookmark-btn' onClick={()=>handleBookmark(story)}>
                        <FaBookmark size={20} style={{color: isBookmarked? 'blue': 'inherit'}} />
                    </button>
                    <button className='like-btn' onClick={()=>handleLike(story)}>
                        <FaHeart size={20} style={{color: isLiked? 'red': 'inherit'}} />
                        <span> {likeCount}</span>
                    </button>
                </div>

               
            </div>
            <ToastContainer
                position="top-center" // Position the toast container at the top center
                autoClose={2000} // Automatically close after 2000 milliseconds (2 seconds)
                hideProgressBar={true} // Hide the progress bar
                newestOnTop={false} // Display newer notifications below older ones
                closeOnClick={true} // Close the toast when clicked
                rtl={false} // Set to true for right-to-left languages
                pauseOnFocusLoss={true} // Pause the toast when the window loses focus
                draggable={true} // Allow dragging to dismiss the toast
                pauseOnHover={true} // Pause the toast when hovered
                
            />
        </div>
    )}
    </>
  );
};

export default ViewStoryModal;
