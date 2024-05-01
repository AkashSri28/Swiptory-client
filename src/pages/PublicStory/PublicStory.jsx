import React from 'react'

function PublicStory() {

    const { storyId } = useParams(); // Get the storyId parameter from the URL
    const [story, setStory] = useState(null); // State to store the fetched story data

    useEffect(() => {
        const fetchStory = async () => {
            try {
                const response = await axios.get(`https://swiptory-client-tau.vercel.app/api/stories/${storyId}`); // Fetch story data from backend
                setStory(response.data); // Update state with fetched story data
                console.log(response.data)
            } catch (error) {
                console.error('Error fetchin story:', error);
            }
        };

        fetchStory(); // Call fetchStory when the component mounts or storyId changes
    }, [storyId]);



  return (
    <div className="modal">
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
  )
}

export default PublicStory