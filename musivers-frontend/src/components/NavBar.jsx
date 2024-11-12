// src/components/NavBar.jsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Button, Form, FormControl, Dropdown } from 'react-bootstrap';
import { festivales, categories } from '../js/CategoryData';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/components/Navbar.css';

const NavBar = () => {
  // Estado para manejar la búsqueda y subcategorías
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [subcategories, setSubcategories] = useState([]);
  const token = localStorage.getItem('token'); // Verifica si el usuario está autenticado mediante el token

  // Función para manejar el cierre de sesión
  const handleLogout = () => {
    localStorage.removeItem('token'); // Elimina el token del almacenamiento local
    navigate('/auth'); // Redirige al usuario a la página de autenticación
  };

  // Función para seleccionar una categoría principal
  const handleCategorySelect = (category) => {
    if (category === 'Festivales') {
      setSubcategories(festivales); // Muestra las subcategorías si "Festivales" está seleccionado
    } else {
      setSubcategories([]); // Limpia subcategorías para otras categorías principales
      setSearchTerm(category); // Asigna la categoría seleccionada al término de búsqueda
    }
  };

  // Función para seleccionar una subcategoría
  const handleSubcategorySelect = (subcategory) => {
    setSearchTerm(subcategory); // Actualiza el término de búsqueda con la subcategoría seleccionada
  };

  // Función para manejar la búsqueda de categorías
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm) {
      navigate(`/category/${searchTerm}`); // Navega a la categoría o subcategoría seleccionada
      setSearchTerm(''); // Limpia el término de búsqueda después de la navegación
    }
  };

  return (
    // Navbar principal con fondo degradado y sombra
    <Navbar expand="lg" className="py-0 navbar-custom">
      <Container fluid className="align-items-center">
        {/* Marca de la aplicación con el logotipo de Musivers */}
        <Navbar.Brand as={Link} to="/" className="p-0 d-flex align-items-center">
          <img src="/images/musivers-logo.webp" alt="Musivers logo" className="navbar-logo" />
        </Navbar.Brand>

        {/* Botón para mostrar el menú en pantallas pequeñas */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {/* Enlaces de navegación principales */}
            <Nav.Link as={Link} to="/events" className="nav-link-custom">
              EVENTOS
            </Nav.Link>
            <Nav.Link as={Link} to="/forums" className="nav-link-custom">
              FOROS
            </Nav.Link>
            <Nav.Link as={Link} to="/grupos-rock" className="nav-link-custom">
              GRUPOSROCK
            </Nav.Link>

            {/* Botón para crear un evento (solo se muestra si el usuario está autenticado) */}
            {token && (
              <Nav.Link as={Link} to="/events/new">
                <Button variant="info" className="ms-2 btn-sm btn-custom">
                  Crear Evento
                </Button>
              </Nav.Link>
            )}
          </Nav>

          {/* Barra de búsqueda de categorías */}
          <Form className="d-flex" onSubmit={handleSearch}>
            {/* Campo de entrada para términos de búsqueda */}
            <FormControl
              type="text"
              placeholder="Buscar categoría..."
              className="me-2 form-control-sm search-bar"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            
            {/* Menú desplegable para seleccionar categorías principales */}
            <Dropdown onSelect={handleCategorySelect}>
              <Dropdown.Toggle variant="info" id="dropdown-basic" className="btn-sm btn-custom">
                Categorías
              </Dropdown.Toggle>
              <Dropdown.Menu className="dropdown-menu-custom">
                {categories.map((category, index) => (
                  <Dropdown.Item key={index} eventKey={category} className="dropdown-item-custom">
                    {category}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>

            {/* Menú desplegable de subcategorías, visible solo si "Festivales" está seleccionado */}
            {subcategories.length > 0 && (
              <Dropdown onSelect={handleSubcategorySelect}>
                <Dropdown.Toggle variant="info" id="dropdown-basic" className="btn-sm ms-2 btn-custom">
                  Festivales
                </Dropdown.Toggle>
                <Dropdown.Menu className="dropdown-menu-custom">
                  {subcategories.map((subcategory, index) => (
                    <Dropdown.Item key={index} eventKey={subcategory} className="dropdown-item-custom">
                      {subcategory}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            )}

            {/* Botón para ejecutar la búsqueda */}
            <Button type="submit" variant="info" className="ms-2 btn-sm btn-custom">
              Buscar
            </Button>
          </Form>

          {/* Opciones de usuario (perfil y cierre de sesión si autenticado; login/registro si no) */}
          <Nav className="ms-auto">
            {token ? (
              <>
                <Button as={Link} to="/profile" variant="info" className="ms-2 btn-sm btn-custom">
                  Mi Perfil
                </Button>
                <Button onClick={handleLogout} variant="info" className="ms-2 btn-sm btn-custom">
                  Cerrar Sesión
                </Button>
              </>
            ) : (
              <Button as={Link} to="/auth" variant="info" className="ms-2 btn-sm btn-custom">
                Login/Register
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
