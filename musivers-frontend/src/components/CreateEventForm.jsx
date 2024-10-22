import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Form, Button, Dropdown, Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const CreateEventForm = () => {
  const navigate = useNavigate();
  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    date: '',
    category: '',
    url: '',
    photo: null,
  });
  const [subcategories, setSubcategories] = useState([]);

  const festivales = [
    'Festivales de Música Rock',
    'Festivales de Jazz',
    'Festivales de música Electrónica',
    'Festivales de Música Indie',
    'Festivales Remember',
    'Festivales de Ópera',
    'Festivales de Música Clásica',
    'Festivales de Blues',
    'Festivales de Reggae',
    'Festivales Multicultural',
  ];

  const categories = [
    'Festivales',
    'Rock',
    'Pop',
    'Jazz',
    'Hip Hop',
    'Reggae',
    'Electrónica',
    'Clásica',
    'Folk',
    'Heavy Metal',
    'Punk',
    'Salsa',
    'Flamenco',
    'Funk',
    'Trap',
    'K-pop',
    'Ópera',
  ];

  const handleInputChange = (e) => {
    setEventData({
      ...eventData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setEventData({
      ...eventData,
      photo: e.target.files[0],
    });
  };

  const handleCategorySelect = (category) => {
    if (category === 'Festivales') {
      setSubcategories(festivales);
      setEventData({ ...eventData, category: '' });
    } else {
      setSubcategories([]);
      setEventData({ ...eventData, category });
    }
  };

  const handleSubcategorySelect = (subcategory) => {
    setEventData({ ...eventData, category: subcategory });
  };

  const handleCreateEvent = async (e) => {
  e.preventDefault();
  const token = localStorage.getItem('token');
  const formData = new FormData();

  formData.append('title', eventData.title);
  formData.append('description', eventData.description);
  formData.append('date', eventData.date);
  formData.append('category', eventData.category);
  formData.append('url', eventData.url);
  formData.append('photo', eventData.photo);

  try {
    await axios.post('http://localhost:8000/admin/events/new', formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    alert('Evento creado con éxito');
    navigate('/events');
  } catch (error) {
    console.error('Error creando el evento:', error.response ? error.response.data : error.message);
    alert('Error creando el evento. Revisa los campos.');
  }
};

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <div className="card bg-dark text-white">
            <div className="card-header">
              <h3 className="text-center">Crear un Nuevo Evento</h3>
            </div>
            <div className="card-body">
              <Form onSubmit={handleCreateEvent}>
                <Form.Group controlId="formTitle">
                  <Form.Label>Título</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={eventData.title}
                    onChange={handleInputChange}
                    className="bg-dark text-white"
                    required
                  />
                </Form.Group>

                <Form.Group controlId="formDescription" className="mt-3">
                  <Form.Label>Descripción</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="description"
                    value={eventData.description}
                    onChange={handleInputChange}
                    className="bg-dark text-white"
                    required
                  />
                </Form.Group>

                <Form.Group controlId="formDate" className="mt-3">
                  <Form.Label>Fecha</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    name="date"
                    value={eventData.date}
                    onChange={handleInputChange}
                    className="bg-dark text-white"
                    required
                  />
                </Form.Group>

                <Form.Group controlId="formCategory" className="mt-3">
                  <Form.Label>Categoría</Form.Label>
                  <Dropdown onSelect={handleCategorySelect}>
                    <Dropdown.Toggle variant="secondary" id="dropdown-category">
                      {eventData.category || 'Selecciona una categoría'}
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="bg-dark text-white">
                      {categories.map((category, index) => (
                        <Dropdown.Item key={index} eventKey={category}>
                          {category}
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>

                  {subcategories.length > 0 && (
                    <Dropdown onSelect={handleSubcategorySelect} className="mt-2">
                      <Dropdown.Toggle variant="warning" id="dropdown-subcategories">
                        Subcategorías de Festivales
                      </Dropdown.Toggle>
                      <Dropdown.Menu className="bg-dark text-white">
                        {subcategories.map((subcategory, index) => (
                          <Dropdown.Item key={index} eventKey={subcategory}>
                            {subcategory}
                          </Dropdown.Item>
                        ))}
                      </Dropdown.Menu>
                    </Dropdown>
                  )}
                </Form.Group>

                <Form.Group controlId="formUrl" className="mt-3">
                  <Form.Label>Enlace (opcional)</Form.Label>
                  <Form.Control
                    type="url"
                    name="url"
                    value={eventData.url}
                    onChange={handleInputChange}
                    className="bg-dark text-white"
                  />
                </Form.Group>

                <Form.Group controlId="formPhoto" className="mt-3">
                  <Form.Label>Foto</Form.Label>
                  <Form.Control
                    type="file"
                    name="photo"
                    onChange={handleFileChange}
                    className="bg-dark text-white"
                    required
                  />
                </Form.Group>

                <Button type="submit" variant="primary" className="mt-3 w-100">
                  Crear Evento
                </Button>
              </Form>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default CreateEventForm;
