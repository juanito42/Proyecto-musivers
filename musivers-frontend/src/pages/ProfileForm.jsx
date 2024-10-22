// src/pages/ProfileForm.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ProfileForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    birthDate: ''
  });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/profile', formData);  // Enviar datos al backend
      navigate('/success');  // Redirigir a una página de éxito
    } catch (error) {
      console.error('Error saving profile data', error);
    }
  };

  return (
    <div>
      <h2>Complete Your Profile</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>First Name:</label>
          <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} required />
        </div>
        <div>
          <label>Last Name:</label>
          <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} required />
        </div>
        <div>
          <label>Birth Date:</label>
          <input type="date" name="birthDate" value={formData.birthDate} onChange={handleInputChange} required />
        </div>
        <button type="submit">Save Profile</button>
      </form>
    </div>
  );
}

export default ProfileForm;
