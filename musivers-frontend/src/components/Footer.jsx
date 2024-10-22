import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

function Footer() {
  return (
    <footer className="bg-light text-center text-lg-start mt-5">
      <Container className="p-4">
        <Row>
          <Col lg={6} md={12} className="mb-4 mb-md-0">
            <h5 className="text-uppercase">Musivers</h5>
            <p>
              Musivers es una plataforma donde puedes explorar eventos musicales, participar en foros, y conectar con otros amantes de la música.
            </p>
          </Col>

          <Col lg={3} md={6} className="mb-4 mb-md-0">
            <h5 className="text-uppercase">Enlaces útiles</h5>
            <ul className="list-unstyled mb-0">
              <li>
                <a href="/" className="text-dark">Inicio</a>
              </li>
              <li>
                <a href="/events" className="text-dark">Eventos</a>
              </li>
              <li>
                <a href="/forums" className="text-dark">Foros</a>
              </li>
              <li>
                <a href="/contact" className="text-dark">Contacto</a>
              </li>
            </ul>
          </Col>

          <Col lg={3} md={6} className="mb-4 mb-md-0">
            <h5 className="text-uppercase">Redes Sociales</h5>
            <ul className="list-unstyled mb-0">
              <li>
                <a href="#!" className="text-dark">Facebook</a>
              </li>
              <li>
                <a href="#!" className="text-dark">Twitter</a>
              </li>
              <li>
                <a href="#!" className="text-dark">Instagram</a>
              </li>
              <li>
                <a href="#!" className="text-dark">YouTube</a>
              </li>
            </ul>
          </Col>
        </Row>
      </Container>

      <div className="text-center p-3 bg-dark text-white">
        © 2024 Musivers. All Rights Reserved.
      </div>
    </footer>
  );
}

export default Footer;
