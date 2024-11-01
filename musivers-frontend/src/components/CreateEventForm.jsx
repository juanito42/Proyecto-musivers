// src/components/CreateEventForm.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Form, Button, Dropdown, Container, Row, Col } from 'react-bootstrap';
import { festivales, categories } from '../js/CategoryData'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/components/CreateEventForm.css'; 

// Componente para crear un nuevo evento
const CreateEventForm = () => {
  const navigate = useNavigate(); // Hook de navegación de React Router

  // Estado para almacenar los datos del formulario
  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    date: '',
    category: '',
    url: '',
    photo: null,
  });

  // Estado para manejar la lista de subcategorías cuando se selecciona "Festivales"
  const [subcategories, setSubcategories] = useState([]);

  // Actualiza el estado de eventData cuando se modifican los campos de entrada
  const handleInputChange = (e) => {
    setEventData({
      ...eventData,
      [e.target.name]: e.target.value,
    });
  };

  // Actualiza el estado de eventData con la foto seleccionada
  const handleFileChange = (e) => {
    setEventData({
      ...eventData,
      photo: e.target.files[0],
    });
  };

  // Maneja la selección de una categoría principal
  const handleCategorySelect = (category) => {
    if (category === 'Festivales') {
      // Si se selecciona "Festivales", muestra subcategorías específicas
      setSubcategories(festivales);
      setEventData({ ...eventData, category: '' }); // Limpia la categoría seleccionada
    } else {
      // Para cualquier otra categoría, oculta subcategorías y asigna la categoría
      setSubcategories([]);
      setEventData({ ...eventData, category });
    }
  };

  // Asigna la subcategoría seleccionada al estado de eventData
  const handleSubcategorySelect = (subcategory) => {
    setEventData({ ...eventData, category: subcategory });
  };

  // Envía el formulario para crear el evento
  const handleCreateEvent = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token'); // Obtiene el token de autenticación

    // Crea un objeto FormData para enviar datos, incluyendo archivos
    const formData = new FormData();
    formData.append('title', eventData.title);
    formData.append('description', eventData.description);
    formData.append('date', eventData.date);
    formData.append('category', eventData.category);
    formData.append('url', eventData.url);
    if (eventData.photo) formData.append('photo', eventData.photo); // Agrega la foto si está disponible

    try {
      // Envía la solicitud para crear el evento al servidor
      await axios.post('http://localhost:8000/api/admin/events/new', formData, {
        headers: {
          'Authorization': `Bearer ${token}`, // Agrega el token de autenticación en los encabezados
          'Content-Type': 'multipart/form-data', // Define el tipo de contenido para FormData
        },
      });
      alert('Evento creado con éxito');
      navigate('/events'); // Redirige a la página de eventos
    } catch (error) {
      console.error('Error creando el evento:', error.response ? error.response.data : error.message);
      alert(`Error creando el evento: ${error.response ? error.response.data.error : error.message}`);
    }
  };

  return (
    <Container className="create-event-container">
      <Row className="justify-content-center">
        <Col md={8}>
          <div className="card create-event-card">
            <div className="card-header create-event-header">Crear un Nuevo Evento</div>
            <div className="card-body">
              <Form onSubmit={handleCreateEvent}>
                {/* Campo para el título del evento */}
                <Form.Group controlId="formTitle">
                  <Form.Label>Título</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={eventData.title}
                    onChange={handleInputChange}
                    className="create-event-input"
                    placeholder="Título del evento"
                    required
                  />
                </Form.Group>

                {/* Campo para la descripción del evento */}
                <Form.Group controlId="formDescription" className="mt-3">
                  <Form.Label>Descripción</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="description"
                    value={eventData.description}
                    onChange={handleInputChange}
                    className="create-event-input"
                    placeholder="Descripción del evento"
                    required
                  />
                </Form.Group>

                {/* Campo para seleccionar la fecha y hora del evento */}
                <Form.Group controlId="formDate" className="mt-3">
                  <Form.Label>Fecha</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    name="date"
                    value={eventData.date}
                    onChange={handleInputChange}
                    className="create-event-input"
                    required
                  />
                </Form.Group>

                {/* Dropdown para seleccionar categoría y subcategoría */}
                <Form.Group controlId="formCategory" className="mt-3">
                  <Form.Label>Categoría</Form.Label>
                  <Dropdown onSelect={handleCategorySelect}>
                    <Dropdown.Toggle variant="secondary" id="dropdown-category" className="create-event-dropdown">
                      {eventData.category || 'Selecciona una categoría'}
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="create-event-dropdown-menu">
                      {categories.map((category, index) => (
                        <Dropdown.Item key={index} eventKey={category} className="create-event-dropdown-item">
                          {category}
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>

                  {/* Dropdown de subcategorías si la categoría seleccionada es "Festivales" */}
                  {subcategories.length > 0 && (
                    <Dropdown onSelect={handleSubcategorySelect} className="mt-2">
                      <Dropdown.Toggle variant="warning" id="dropdown-subcategories" className="create-event-dropdown">
                        Subcategorías de Festivales
                      </Dropdown.Toggle>
                      <Dropdown.Menu className="create-event-dropdown-menu">
                        {subcategories.map((subcategory, index) => (
                          <Dropdown.Item key={index} eventKey={subcategory} className="create-event-dropdown-item">
                            {subcategory}
                          </Dropdown.Item>
                        ))}
                      </Dropdown.Menu>
                    </Dropdown>
                  )}
                </Form.Group>

                {/* Campo para ingresar la URL del evento (opcional) */}
                <Form.Group controlId="formUrl" className="mt-3">
                  <Form.Label>Enlace (opcional)</Form.Label>
                  <Form.Control
                    type="url"
                    name="url"
                    value={eventData.url}
                    onChange={handleInputChange}
                    className="create-event-input"
                    placeholder="URL del evento"
                  />
                </Form.Group>

                {/* Campo para subir una foto del evento */}
                <Form.Group controlId="formPhoto" className="mt-3">
                  <Form.Label>Foto</Form.Label>
                  <Form.Control
                    type="file"
                    name="photo"
                    onChange={handleFileChange}
                    className="create-event-input"
                  />
                </Form.Group>

                {/* Botón para enviar el formulario y crear el evento */}
                <Button type="submit" variant="primary" className="create-event-button">
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
