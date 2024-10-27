import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Button, Card, Row, Col } from 'react-bootstrap'; // Asegúrate de importar estos componentes
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faUserPlus, faEdit } from '@fortawesome/free-solid-svg-icons';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfileData(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setProfileData(null);
      }
    };

    fetchProfile();
  }, []);

  if (!profileData) {
    return (
      <Container className="mt-5 text-center">
        <FontAwesomeIcon icon={faSpinner} spin size="2x" className="mb-3" />
        <p>Loading profile...</p>
        <Button
          variant="primary"
          onClick={() => navigate('/profile_form')}
          className="mt-3"
        >
          <FontAwesomeIcon icon={faUserPlus} className="me-2" />
          Create Profile
        </Button>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <Card className="bg-light">
        <Card.Header className="bg-dark text-white text-center">
          <h3>Perfil de {profileData.firstName}</h3>
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
