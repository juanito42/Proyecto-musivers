// src/components/ProfileForm.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import '../styles/components/ProfileForm.css'; 

const ProfileForm = () => {
  // Estado para almacenar datos del formulario de perfil
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    bio: '',
    birthDate: '',
  });

  // Hook de navegación para redirigir a otra página después de guardar el perfil
  const navigate = useNavigate();

  // Cargar datos de perfil desde el servidor cuando se monta el componente
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token'); // Obtiene el token de autenticación
        const response = await axios.get('/api/profile', {
          headers: { Authorization: `Bearer ${token}` }, // Incluye el token en la solicitud
        });
        setFormData(response.data); // Almacena los datos del perfil en el estado
      } catch (error) {
        console.error('Error fetching profile:', error); // Muestra el error en consola si falla
      }
    };
    fetchProfile();
  }, []);

  // Maneja los cambios en los campos de entrada y actualiza el estado
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Envía los datos actualizados del perfil al servidor
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Datos del perfil:', formData); // Muestra los datos antes de enviarlos
    try {
      const token = localStorage.getItem('token'); // Recupera el token
      await axios.put('/api/profile', formData, {
        headers: { Authorization: `Bearer ${token}` }, // Incluye el token en los headers
      });
      alert('Perfil guardado correctamente'); // Alerta de éxito
      navigate('/profile'); // Redirige a la página de perfil
    } catch (error) {
      console.error('Error saving profile data', error.response?.data || error.message);
      alert('Error al guardar el perfil'); // Alerta de error
    }
  };

  return (
    <Container className="profile-container">
      <Row className="justify-content-center">
        <Col md={8}>
          {/* Tarjeta de formulario de perfil */}
          <div className="card profile-card">
            <div className="card-header profile-card-header">
              Complete Your Profile
            </div>
            <div className="card-body">
              <Form onSubmit={handleSubmit}>
                {/* Campo de entrada para el nombre */}
                <Form.Group controlId="formFirstName" className="mb-3">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="profile-input"
                    placeholder="Enter your first name"
                    required
                  />
                </Form.Group>

                {/* Campo de entrada para el apellido */}
                <Form.Group controlId="formLastName" className="mb-3">
                  <Form.Label>Apellido</Form.Label>
                  <Form.Control
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="profile-input"
                    placeholder="Enter your last name"
                    required
                  />
                </Form.Group>

                {/* Campo de entrada para la biografía */}
                <Form.Group controlId="formBio" className="mb-3">
                  <Form.Label>Biografía</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    className="profile-input"
                    placeholder="Tell us about yourself..."
                  />
                </Form.Group>

                {/* Campo de entrada para la fecha de nacimiento */}
                <Form.Group controlId="formBirthDate" className="mb-3">
                  <Form.Label>Año Nacimiento</Form.Label>
                  <Form.Control
                    type="date"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleInputChange}
                    className="profile-input"
                    required
                  />
                </Form.Group>

                {/* Botón para guardar el perfil */}
                <Button type="submit" variant="primary" className="profile-save-button">
                  Guardar Perfil
                </Button>
              </Form>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ProfileForm;
