import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';

const ProfileForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    bio: '',
    birthDate: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFormData(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Datos del perfil:', formData); // Verifica qué datos se envían
    try {
      const token = localStorage.getItem('token');
      await axios.put('/api/profile', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Perfil guardado correctamente');
      navigate('/profile');
    } catch (error) {
      console.error('Error saving profile data', error.response?.data || error.message);
      alert('Error al guardar el perfil');
    }
  };
  
  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <div className="card bg-dark text-white">
            <div className="card-header">
              <h3 className="text-center">Complete Your Profile</h3>
            </div>
            <div className="card-body">
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formFirstName" className="mb-3">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="bg-dark text-white"
                    required
                  />
                </Form.Group>

                <Form.Group controlId="formLastName" className="mb-3">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="bg-dark text-white"
                    required
                  />
                </Form.Group>

                <Form.Group controlId="formBio" className="mb-3">
                  <Form.Label>Bio</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    className="bg-dark text-white"
                  />
                </Form.Group>

                <Form.Group controlId="formBirthDate" className="mb-3">
                  <Form.Label>Birth Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleInputChange}
                    className="bg-dark text-white"
                    required
                  />
                </Form.Group>

                <Button type="submit" variant="primary" className="w-100">
                  Save Profile
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
