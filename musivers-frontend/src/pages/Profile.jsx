// src/pages/Profile.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Button, Card, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faUserPlus, faEdit } from '@fortawesome/free-solid-svg-icons';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../styles/pages/Profile.css'; 

const Profile = () => {
  const [profileData, setProfileData] = useState(null); // Estado para almacenar los datos del perfil
  const navigate = useNavigate(); // Hook para redirigir a otra página

  // Cargar datos del perfil al montar el componente
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token'); // Obtiene el token de autenticación
        const response = await axios.get('/api/profile', {
          headers: { Authorization: `Bearer ${token}` }, // Envía el token en la cabecera de la solicitud
        });
        setProfileData(response.data); // Almacena los datos del perfil en el estado
      } catch (error) {
        console.error('Error obteniendo el perfil:', error);
        setProfileData(null); // Si falla la solicitud, establece el perfil en null
      }
    };

    fetchProfile();
  }, []);

  // Muestra un mensaje de carga mientras se obtienen los datos del perfil
  if (!profileData) {
    return (
      <Container className="profile-container-perf text-center">
        <FontAwesomeIcon icon={faSpinner} spin size="2x" className="loading-spinner" />
        <p>Cargando perfil...</p>
        <Button
          variant="primary"
          onClick={() => navigate('/profile_form')}
          className="mt-3 create-edit-profile-button"
        >
          <FontAwesomeIcon icon={faUserPlus} className="me-2" />
          Crear Perfil
        </Button>
      </Container>
    );
  }

  return (
    <Container className="profile-container-perf">
      <Card className="profile-card-perf">
        <Card.Header className="profile-header-perf">
          Perfil de {profileData.firstName}
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <p><strong>Nombre:</strong> {profileData.firstName}</p>
              <p><strong>Apellido:</strong> {profileData.lastName}</p>
            </Col>
            <Col md={6}>
              <p><strong>Biografía:</strong> {profileData.bio || 'No proporcionada'}</p>
              <p><strong>Fecha de Nacimiento:</strong> {profileData.birthDate || 'No especificada'}</p>
            </Col>
          </Row>
          <div className="text-center mt-4">
            <Button
              variant="secondary"
              onClick={() => navigate('/profile_form')}
              className="create-edit-profile-button"
            >
              <FontAwesomeIcon icon={faEdit} className="me-2" />
              Editar Perfil
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Profile;
