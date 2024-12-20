import React, { useState, useEffect } from 'react';

const TemplateForm = ({ onSubmit, template, onCancel }) => {
  // Initial state for form data
  const [formData, setFormData] = useState({
    templateName: '',
    templateCategory: '',
    createdBy: '',
    uploadLocation: '',
    unzipLocation: '',
  });

  // Update form data if 'template' prop changes (for editing)
  useEffect(() => {
    if (template) setFormData(template);
  }, [template]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    onSubmit(formData); // Pass the form data to the parent component
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Template Name:</label>
        <input
          type="text"
          name="templateName"
          value={formData.templateName}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Template Category:</label>
        <input
          type="text"
          name="templateCategory"
          value={formData.templateCategory}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Created By:</label>
        <input
          type="text"
          name="createdBy"
          value={formData.createdBy}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Upload Location:</label>
        <input
          type="text"
          name="uploadLocation"
          value={formData.uploadLocation}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Unzip Location:</label>
        <input
          type="text"
          name="unzipLocation"
          value={formData.unzipLocation}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-buttons">
        <button type="submit">Submit</button>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default TemplateForm;

