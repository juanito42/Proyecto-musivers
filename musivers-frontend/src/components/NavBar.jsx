import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Navbar,
  Nav,
  Container,
  Button,
  Form,
  FormControl,
  Dropdown,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const NavBar = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [subcategories, setSubcategories] = useState([]);

  // Verifica si hay un token en el localStorage
  const token = localStorage.getItem("token");

  // Función para manejar el cierre de sesión
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/auth");
  };

  // Función para manejar la selección de la categoría
  const handleCategorySelect = (category) => {
    if (category === "Festivales") {
      setSubcategories(festivales); // Mostrar subcategorías si es "Festivales"
    } else {
      setSubcategories([]); // Limpiar subcategorías si no es "Festivales"
      setSearchTerm(category);
    }
  };

  // Función para manejar la selección de una subcategoría
  const handleSubcategorySelect = (subcategory) => {
    setSearchTerm(subcategory);
  };

  // Función para manejar la búsqueda
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm) {
      navigate(`/category/${searchTerm}`);
      setSearchTerm("");
    }
  };

  const festivales = [
    "Festivales de Música Rock",
    "Festivales de Jazz",
    "Festivales de musica Electrónica",
    "Festivales de Música Indie",
    "Festivales Remember",
    "Festivales de Ópera",
    "Festivales de Música Clásica",
    "Festivales de Blues",
    "Festivales de Reggae",
    "Festivales Multicultural",
  ];

  const categories = [
    "Festivales",
    "Rock",
    "Pop",
    "Jazz",
    "Hip Hop",
    "Reggae",
    "Electrónica",
    "Clásica",
    "Folk",
    "Heavy Metal",
    "Punk",
    "Salsa",
    "Flamenco",
    "Funk",
    "Trap",
    "K-pop",
    "Ópera",
  ];

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="py-0">
      <Container>
        <Navbar.Brand as={Link} to="/" className="p-0 d-flex align-items-center">
          <img
            src="/images/musivers-logo.webp"
            alt="Musivers logo"
            className="d-inline-block align-top"
            style={{
              height: "100%",
              maxHeight: "80px",
              objectFit: "contain",
              margin: "0",
              padding: "0",
            }}
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/events">
              EVENTOS
            </Nav.Link>
            <Nav.Link as={Link} to="/map">
              MAPAS
            </Nav.Link>
            <Nav.Link as={Link} to="/forums">
              FORO
            </Nav.Link>

            {/* Añadir botón para crear un evento */}
            {token && (
              <Nav.Link as={Link} to="/events/new">
                <Button variant="success" className="ms-2 btn-sm">
                  Crear Evento
                </Button>
              </Nav.Link>
            )}
          </Nav>

          <Form className="d-flex" onSubmit={handleSearch}>
            <FormControl
              type="text"
              placeholder="Buscar categoría..."
              className="me-2 form-control-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: "200px" }}
            />
            <Dropdown onSelect={handleCategorySelect}>
              <Dropdown.Toggle
                variant="secondary"
                id="dropdown-basic"
                className="btn-sm"
              >
                Categorías
              </Dropdown.Toggle>
              <Dropdown.Menu
                style={{
                  maxHeight: "150px",
                  overflowY: "scroll",
                  backgroundColor: "#c364bf",
                }}
              >
                {categories.map((category, index) => (
                  <Dropdown.Item key={index} eventKey={category}>
                    {category}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>

            {subcategories.length > 0 && (
              <Dropdown onSelect={handleSubcategorySelect}>
                <Dropdown.Toggle
                  variant="warning"
                  id="dropdown-basic"
                  className="btn-sm ms-2"
                >
                  Festivales
                </Dropdown.Toggle>
                <Dropdown.Menu
                  style={{
                    maxHeight: "150px",
                    overflowY: "scroll",
                    backgroundColor: "#80bc3e",
                  }}
                >
                  {subcategories.map((subcategory, index) => (
                    <Dropdown.Item key={index} eventKey={subcategory}>
                      {subcategory}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            )}

            <Button
              type="submit"
              variant="outline-light"
              className="ms-2 btn-sm"
            >
              Buscar
            </Button>
          </Form>

          <Nav className="ms-auto">
            {token ? (
              <>
                <Button
                  as={Link}
                  to="/profile"
                  variant="outline-light"
                  className="ms-2 btn-sm"
                >
                  Mi Perfil
                </Button>
                <Button
                  onClick={handleLogout}
                  variant="outline-light"
                  className="ms-2 btn-sm"
                >
                  Cerrar Sesión
                </Button>
              </>
            ) : (
              <Button
                as={Link}
                to="/auth"
                variant="outline-light"
                className="ms-2 btn-sm"
              >
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