// EditStoryModal.jsx

import React, { useEffect, useState } from 'react';
import './EditStoryModal.css'; // Import CSS file for styling
import axios from 'axios';

const EditStoryModal = ({ isOpen, onClose, story }) => {
  const [storyForms, setStoryForms] = useState([]);
  const [category, setCategory] = useState('');

  useEffect(() => {
    console.log(story);
    if (story && story.forms) {
      setStoryForms(story.forms);
      setCategory(story.category)
    }
  }, [story]);


  const [currentForm, setCurrentForm] = useState(0);

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
      image: '',
      category: storyForms[0].category,
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
      const response = await axios.post('http://localhost:4000/api/story/edit', {
        storyForms,
      });
      if (response.status === 201) {
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
            <span className="close" onClick={onClose}>
              &times;
            </span>
            <h2>Edit Story</h2>
            <div className="form-tabs">
              {storyForms.map((form, index) => (
                <div
                  key={index}
                  className={`form-tab ${index === currentForm ? 'active' : ''}`}
                  onClick={() => handleTabClick(index)}
                >
                  {index + 1}
                  {storyForms.length > 1 && (
                    <button className="cancel-button" onClick={() => handleRemoveForm(index)}>
                      Cancel
                    </button>
                  )}
                </div>
              ))}
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
                    <input
                      type="text"
                      name="description"
                      value={form.description}
                      onChange={(e) => handleFormChange(e, index)}
                    />
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
                <input
                  type="text"
                  name="category"
                  value={category}
                  onChange={handleCategoryChange}
                />
              </div>
              <button type="button" className="add-form-button" onClick={handleAddForm}>
                Add Form
              </button>
              <button type="button" className="post-button" onClick={handlePost}>
                Post
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default EditStoryModal;
