// src/pages/ProfileEdit.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container } from 'react-bootstrap';

const ProfileEdit = () => {
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    bio: '',
    birthDate: '',
  });
  useEffect(() => {
    // Cargar el perfil del usuario cuando se monte el componente
    const fetchProfile = async () => {
      try {
        const response = await axios.get('/api/profile');
        setProfileData(response.data);
      } catch (error) {
        console.error('Error al cargar el perfil:', error);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put('/api/profile', profileData);
      console.log('Perfil actualizado correctamente.');
    } catch (error) {
      console.error('Error al actualizar el perfil:', error.response?.data || error.message);
    }
  };

  return (
    <Container className="mt-5">
      <h2>Editar Perfil</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formFirstName">
          <Form.Label>Nombre</Form.Label>
          <Form.Control
            type="text"
            name="firstName"
            value={profileData.firstName}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formLastName" className="mt-3">
          <Form.Label>Apellido</Form.Label>
          <Form.Control
            type="text"
            name="lastName"
            value={profileData.lastName}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formBio" className="mt-3">
          <Form.Label>Biografía</Form.Label>
          <Form.Control
            as="textarea"
            name="bio"
            value={profileData.bio}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group controlId="formBirthDate" className="mt-3">
          <Form.Label>Fecha de Nacimiento</Form.Label>
          <Form.Control
            type="date"
            name="birthDate"
            value={profileData.birthDate}
            onChange={handleChange}
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="mt-3">
          Guardar Cambios
        </Button>
      </Form>
    </Container>
  );
};

export default ProfileEdit;
