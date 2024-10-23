import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import '@fortawesome/fontawesome-free/css/all.min.css'; // Asegúrate de importar Font Awesome

function Footer() {
  return (
    <>
      <footer className="bg-dark text-light text-center text-lg-start mt-5">
        <Container className="p-4">
          <Row>
            <Col lg={6} md={12} className="mb-4 mb-md-0">
              <h5 className="text-uppercase fw-bold mb-4">Musivers</h5>
              <p>
                Musivers es una plataforma donde puedes explorar eventos musicales, participar en foros, y conectar con otros amantes de la música. 
                Nuestro objetivo es unir a los fans de la música en un solo lugar.
              </p>
            </Col>

            <Col lg={3} md={6} className="mb-4 mb-md-0">
              <h5 className="text-uppercase fw-bold mb-4">Enlaces útiles</h5>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <a href="/" className="text-reset text-decoration-none">Inicio</a>
                </li>
                <li className="mb-2">
                  <a href="/events" className="text-reset text-decoration-none">Eventos</a>
                </li>
                <li className="mb-2">
                  <a href="/forums" className="text-reset text-decoration-none">Foros</a>
                </li>
                <li className="mb-2">
                  <a href="/contact" className="text-reset text-decoration-none">Contacto</a>
                </li>
              </ul>
            </Col>

            <Col lg={3} md={6} className="mb-4 mb-md-0">
              <h5 className="text-uppercase fw-bold mb-4">Redes Sociales</h5>
              <ul className="list-unstyled d-flex justify-content-center justify-content-lg-start">
                <li className="me-4">
                  <a href="#!" className="text-reset">
                    <i className="fab fa-facebook-f fa-lg"></i>
                  </a>
                </li>
                <li className="me-4">
                  <a href="#!" className="text-reset">
                    <i className="fab fa-twitter fa-lg"></i>
                  </a>
                </li>
                <li className="me-4">
                  <a href="#!" className="text-reset">
                    <i className="fab fa-instagram fa-lg"></i>
                  </a>
                </li>
                <li>
                  <a href="#!" className="text-reset">
                    <i className="fab fa-youtube fa-lg"></i>
                  </a>
                </li>
              </ul>
            </Col>
          </Row>
        </Container>

        <div className="text-center p-3 bg-dark text-white border-top border-light">
          © 2024 Musivers. All Rights Reserved.
        </div>
      </footer>

      {/* Ícono flotante de WhatsApp */}
      <a
        href="https://api.whatsapp.com/send?phone=123456789"
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-button btn btn-success rounded-circle shadow"
      >
        <i className="fab fa-whatsapp"></i>
      </a>

      <style jsx>{`
        .whatsapp-button {
          position: fixed;
          width: 60px;
          height: 60px;
          bottom: 20px;
          right: 20px;
          font-size: 30px;
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
      `}</style>
    </>
  );
}

export default Footer;
