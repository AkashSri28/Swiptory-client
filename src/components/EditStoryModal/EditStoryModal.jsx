// EditStoryModal.jsx

import React, { useEffect, useState } from 'react';
import './EditStoryModal.css'; // Import CSS file for styling
import axios from 'axios';
import { useAuth } from '../../context/authContext';

const EditStoryModal = ({ isOpen, onClose, story }) => {
  const [storyForms, setStoryForms] = useState([]);
  const [category, setCategory] = useState('');
  const [storyId, setStoryId] = useState('')

  const {token} = useAuth();

  useEffect(() => {
    console.log(story);
    if (story && story.forms) {
      setStoryForms(story.forms);
      setCategory(story.category);
      setStoryId(story._id);
    }
  }, [story]);


  const [currentForm, setCurrentForm] = useState(0);

  const handlePrevious = () => {
    setCurrentForm(currentForm - 1);
  };

  const handleNext = () => {
    setCurrentForm(currentForm + 1);
  };

  const handleTabClick = (index) => {
    setCurrentForm(index);
  };

  const handleFormChange = (e, formIndex) => {
    const { name, value } = e.target;
    const updatedForms = [...storyForms];
    updatedForms[formIndex][name] = value;
    setStoryForms(updatedForms);
  };

  const handleCategoryChange = (e) => {
    const { value } = e.target;
    const updatedForms = storyForms.map((form) => ({
      ...form,
      category: value,
    }));
    setStoryForms(updatedForms);
  };

  const handleAddForm = () => {
    const newForm = {
      heading: '',
      description: '',
      image: ''
    };
    setStoryForms([...storyForms, newForm]);
  };

  const handleRemoveForm = (index) => {
    const updatedForms = [...storyForms];
    updatedForms.splice(index, 1);
    setStoryForms(updatedForms);
  };

  const handlePost = async () => {
    try {
      const response = await axios.post('https://swiptory-server-fm7r.onrender.com/api/story/edit', {
        storyId,
        storyForms,
        category
      },{
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.status === 200) {
        console.log('Story updated successfully');
        onClose(); // Close the modal
      } else {
        console.error('Failed to update story');
      }
    } catch (error) {
      console.error('Error updating story:', error);
    }
  };

  return (
    <>
      {isOpen && (
        <div className="modal">
          <div className="modal-content">
            <div className="close" onClick={onClose}>
              &times;
            </div>
            <div className="add-slides-text">
                Add up to 6 slides
            </div>
            <div className="form-tabs">
              {storyForms.map((form, index) => (
                <div
                  key={index}
                  className={`form-tab ${index === currentForm ? 'active' : ''}`}
                  onClick={() => handleTabClick(index)}
                >
                  Slide {index + 1}
                  {index > 2 && (
                    <button className="cancel-form-button" onClick={() => handleRemoveForm(index)}>
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
              {storyForms.map((form, index) => (
                <div key={index} className={`form ${index === currentForm ? 'active' : ''}`}>
                  <div className="form-group">
                    <label>Heading:</label>
                    <input
                      type="text"
                      name="heading"
                      value={form.heading}
                      onChange={(e) => handleFormChange(e, index)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Description:</label>
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={(e) => handleFormChange(e, index)}
                    ></textarea>
                  </div>
                  <div className="form-group">
                    <label>Image (URL):</label>
                    <input
                      type="text"
                      name="image"
                      value={form.image}
                      onChange={(e) => handleFormChange(e, index)}
                    />
                  </div>
                </div>
              ))}
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

              <button type="button" className="post-button" onClick={handlePost}>
                Post
              </button>

          </div>
        </div>
      )}
    </>
  );
};

export default EditStoryModal;
