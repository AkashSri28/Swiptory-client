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
    
      const handleAddStory = () => {
        // Here you can send the story data to your backend
        console.log('Adding story...', storyForms[currentForm]);
        // Clear the current form fields
        setStoryForms([
          ...storyForms.slice(0, currentForm),
          { heading: '', description: '', image: '', category: '' },
          ...storyForms.slice(currentForm + 1),
        ]);
        // If you want to close the modal after adding a story, you can call onClose here
        // onClose();
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
          console.log(storyForms)
          await axios.post('http://localhost:4000/api/story/add', {
            storyForms
          },{
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          alert('Story posted successfully!');
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
            <div className="story-form">

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
          <form>
            <div className="form-group">
              <label>Heading:</label>
              <input
                type="text"
                name="heading"
                value={storyForms[currentForm]?.heading}
                onChange={(e) => handleInputChange(currentForm, e)}
              />
            </div>
            <div className="form-group">
              <label>Description:</label>
              <textarea
                name="description"
                value={storyForms[currentForm]?.description}
                onChange={(e) => handleInputChange(currentForm, e)}
              ></textarea>
            </div>
            <div className="form-group">
              <label>Image (URL):</label>
              <input
                type="text"
                name="image"
                value={storyForms[currentForm]?.image}
                onChange={(e) => handleInputChange(currentForm, e)}
              />
            </div>
            <div className="form-group">
              <label>Category:</label>
              <select
                name="category"
                value={category}
                onChange={handleCategoryChange}
              >
                <option value="">Select category</option>
                <option value="Food">Food</option>
                <option value="Health and Fitness">Health and Fitness</option>
                <option value="Travel">Travel</option>
                <option value="Movies">Movies</option>
                <option value="Education">Education</option>
              </select>
            </div>
          </form>
        </div>
        <div className="button-group">
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
      )}
    </>
  );
};

export default AddStoryModal;
