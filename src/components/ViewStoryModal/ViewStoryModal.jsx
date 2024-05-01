// ViewStoryModal.jsx

import React, { useEffect, useState } from 'react';
import './ViewStoryModal.css';
import { FiSend, FiBookmark, FiHeart } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";
import axios from 'axios';
import { useAuth } from '../../context/authContext';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const ViewStoryModal = ({ isOpen, onClose, story, handleLoginClick }) => {
    const [currentForm, setCurrentForm] = useState(0);
    const [progress, setProgress] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [storyProgress, setStoryProgress] = useState([]);

    const {token, isLoggedIn} = useAuth();

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
        if(isLoggedIn){
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
                }
                else{
                    console.log("Failed", response.data.message)
                }
            } catch (error) {
                console.error('Error liking story:', error);
                // Handle error (e.g., display an error message to the user)
            }
        }else{
            onClose();
            handleLoginClick();
        }
    };

    const handleBookmark = async (story) => {
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
            }
            else{
                console.log("Failed", response.data.message)
            }
        } catch (error) {
            console.error('Error bookmarking story:', error);
        }
    };

    const generatePublicLink = (storyId) => {
        const publicLink = `https://localhost:3000/story/${storyId}`; // Example URL, replace with your actual URL logic
        return publicLink;
    };

    const handleSendButtonClick = (storyId) => {
        const publicLink = generatePublicLink(storyId);
        navigator.clipboard.writeText(publicLink)
            .then(() => {
                toast("URL copied!", {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
                console.log('uRL copied')
            })
            .catch(error => {
                console.error('Error copying public link to clipboard:', error);
            });
    };

  return (
    <>
        {isOpen && (<div className="modal">
            <div className="view-story-modal">
                <div className="progress-bar-container" style={{ display: 'flex' }}>
                    {story && story.forms && story.forms.length > 0 && (
                        story.forms.map((form, index) => (
                            <div key={index} className="progress-bar" style={{ width: `${storyProgress[index]}%`, flex: '1', marginRight: '5px' }}></div>
                        ))
                    )}

                </div>

                <div className="close-send-buttons">
                    <span className="close-button" onClick={onClose}><IoMdClose /></span>
                    <span className="send-button" onClick={()=>handleSendButtonClick(story._id)}><FiSend /></span>
                   
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
                        <FiBookmark className={isBookmarked ? 'bookmarked' : ''} />
                    </button>
                    <button className='like-btn' onClick={()=>handleLike(story)}>
                        <FiHeart className={isLiked ? 'liked' : ''} />
                        <span> {story.likes}</span>
                    </button>
                </div>

               
            </div>
            <div className="navigation">
                <button onClick={handlePrevious}>Previous</button>
                <button onClick={handleNext}>Next</button>
            </div>
            <ToastContainer position="top-center" autoClose={2000} hideProgressBar={true} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
        </div>
    )}
    </>
  );
};

export default ViewStoryModal;
