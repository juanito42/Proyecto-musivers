import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../styles/components/Footer.css'; 

function Footer() {
  return (
    <>
      <footer className="footer text-center text-lg-start">
        <Container className="p-4">
          <Row>
            <Col lg={6} md={12} className="mb-4 mb-md-0">
              <h5 className="footer-title mb-4">Musivers</h5>
              <p className="footer-text">
                Musivers es una plataforma donde puedes explorar y crear eventos musicales, 
                participar en foros, y conectar con otros amantes de la música. 
                Nuestro objetivo es unir a los fans de la música en un solo lugar.
              </p>
            </Col>

            <Col lg={3} md={6} className="mb-4 mb-md-0">
              <h5 className="footer-title mb-4">Enlaces útiles</h5>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <a href="/" className="footer-link">Inicio</a>
                </li>
                <li className="mb-2">
                  <a href="/events" className="footer-link">Eventos</a>
                </li>
                <li className="mb-2">
                  <a href="/forums" className="footer-link">Foros</a>
                </li>
                <li className="mb-2">
                  <a href="/contact" className="footer-link">Contacto</a>
                </li>
              </ul>
            </Col>

            <Col lg={3} md={6} className="mb-4 mb-md-0">
              <h5 className="footer-title mb-4">Redes Sociales</h5>
              <div className="footer-social-icons">
                <a href="#!" className="text-reset">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="#!" className="text-reset">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#!" className="text-reset">
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="#!" className="text-reset">
                  <i className="fab fa-youtube"></i>
                </a>
              </div>
            </Col>
          </Row>
        </Container>

        <div className="footer-copyright">
          © 2024 Musivers. All Rights Reserved.
        </div>
      </footer>

      <a
        href="https://api.whatsapp.com/send?phone=625356695"
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-button"
      >
        <i className="fab fa-whatsapp"></i>
      </a>
    </>
  );
}

export default Footer;
