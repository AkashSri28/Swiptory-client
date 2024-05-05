import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ViewStoryModal from '../../components/ViewStoryModal/ViewStoryModal';

function PublicStory() {

    const { id } = useParams(); // Get the storyId parameter from the URL
    const [story, setStory] = useState(null); // State to store the fetched story data

    const [showViewStoryModal, setShowViewStoryModal] = useState(true);
    const [showLoginModal, setShowLoginModal] = useState(false);


    useEffect(() => {
        const fetchStory = async () => {
            try {
                const response = await axios.get(`https://swiptory-server-fm7r.onrender.com/api/story/${id}`); // Fetch story data from backend
                setStory(response.data); // Update state with fetched story data
                console.log(response.data)
            } catch (error) {
                console.error('Error fetchin story:', error);
            }
        };
        console.log(id)

        fetchStory(); // Call fetchStory when the component mounts or storyId changes
    }, [id]);

    const handleCloseViewStoryModal = () => {
        setShowViewStoryModal(false);
        setStory(null);
      };

      const handleLoginClick = () => {
        setShowLoginModal(true);
    };
  

    



  return (
    <>
     <ViewStoryModal
        isOpen={showViewStoryModal}
        onClose={handleCloseViewStoryModal}
        story={story}
        handleLoginClick={handleLoginClick}
      />
    </>
   
  )
}

export default PublicStory