// AddStoryModal.jsx

import React, { useState } from 'react';
import './AddModalStory.css';
import axios from 'axios';
import { useAuth } from '../../context/authContext';

const AddStoryModal = ({ isOpen, onClose }) => {
    const [storyForms, setStoryForms] = useState([
        { heading: '', description: '', image: '' },
        { heading: '', description: '', image: '' },
        { heading: '', description: '', image: '' }
      ]);
      const [category, setCategory] = useState('');

      const { token } = useAuth();

      const [currentForm, setCurrentForm] = useState(0);

      const handleCategoryChange = (e) => {
        setCategory(e.target.value);
      };
    
      const handleInputChange = (index, e) => {
        const { name, value } = e.target;
        const list = [...storyForms];
        list[index][name] = value;
        setStoryForms(list);
      };
    
      const handleAddForm = () => {
        setStoryForms([...storyForms, { heading: '', description: '', image: '' }]);
      };
    
      const handlePrevious = () => {
        setCurrentForm(currentForm - 1);
      };
    
      const handleNext = () => {
        setCurrentForm(currentForm + 1);
      };
    

      const handleTabClick = (index) => {
        setCurrentForm(index);
      };

      const handleCancelForm = (index) => {
        const list = [...storyForms];
        list.splice(index, 1);
        setStoryForms(list);
      };

      const handlePost = async () => {
        const incompleteFormIndex = storyForms.findIndex(
          (form) => !form.heading || !form.description || !form.image
        );
        if (incompleteFormIndex !== -1) {
          alert('Please fill all fields in the form');
          return;
        }
    
        try {
          await axios.post('https://swiptory-server-fm7r.onrender.com/api/story/add', {
            storyForms,
            category
          },{
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
           // Clear form data after successful post
           setStoryForms([
            { heading: '', description: '', image: '' },
            { heading: '', description: '', image: '' },
            { heading: '', description: '', image: '' }
          ]);
          setCategory('');
          setCurrentForm(0);
          onClose();
        } catch (error) {
          console.error('Error posting story:', error);
          alert('Error posting story');
        }
      };

  return (
    <>
      {isOpen && (
        <div className="modal">
          <div className="modal-content">
            <button className="close" onClick={() => onClose()}>
              &times;
            </button>
            <div className="add-slides-text">
                Add up to 6 slides
            </div>
            <p className='mobile-add-story-heading'>Add story to feed</p>
            <div className="story-form">

              <div className="form-tabs">
                {storyForms.map((form, index) => (
                    <div key={index} className={`form-tab ${index === currentForm ? 'active' : ''}`} onClick={() => handleTabClick(index)}>
                      Slide {index + 1}
                      {index > 2 && (
                        <button className="cancel-form-button" onClick={() => handleCancelForm(index)}>
                          &times;
                        </button>
                      )}
                    </div>
                ))}

                {storyForms.length < 6 && (
                  <div className="form-tab" onClick={handleAddForm}>
                    Add
                  </div>
                )}
              </div>


            
          <form>
            <div className="form-group">
              <label>Heading<span className='colon'>:</span></label>
              <input
                type="text"
                name="heading"
                placeholder='Your heading'
                value={storyForms[currentForm]?.heading}
                onChange={(e) => handleInputChange(currentForm, e)}
              />
            </div>
            <div className="form-group">
              <label>Description<span className='colon'>:</span></label>
              <textarea
                name="description"
                placeholder='Story Description'
                value={storyForms[currentForm]?.description}
                onChange={(e) => handleInputChange(currentForm, e)}
              ></textarea>
            </div>
            <div className="form-group">
              <label>Image<span className='colon'>:</span></label>
              <input
                type="text"
                name="image"
                placeholder='Add Image url'
                value={storyForms[currentForm]?.image}
                onChange={(e) => handleInputChange(currentForm, e)}
              />
            </div>
            <div className="category-input-container">
              <div className="form-group">
                <label>Category<span className='colon'>:</span></label>

                <select
                    name="category"
                    value={category}
                    onChange={handleCategoryChange}
                  >
                    <option value="">Select category</option>
                    <option value="Food">food</option>
                    <option value="Health and Fitness">health and fitness</option>
                    <option value="Travel">travel</option>
                    <option value="Movies">movies</option>
                    <option value="Education">education</option>
                  </select>
              
                  
                  
          
                
              </div>
              <span className="category-note">This field will be common for all slides</span>
            </div>
           
          </form>
        </div>
        <div className="button-group">
          <div className="navigation-buttons">
            {currentForm > 0 && (
              <button className="previous" onClick={handlePrevious}>
                Previous
              </button>
            )}
            {currentForm < storyForms.length - 1 && (
              <button className="next" onClick={handleNext}>
                Next
              </button>
            )}
          </div>
          <button className="post-button" onClick={handlePost}>Post</button>
        </div>

        </div>
        </div>
      )}
    </>
  );
};

export default AddStoryModal;
