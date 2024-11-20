// src/pages/Home.jsx

import React, { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "animate.css";
import '../styles/pages/Home.css';

function Home() {
  useEffect(() => {
    const homeElement = document.querySelector(".home");
    homeElement.classList.add("animate__animated", "animate__fadeIn");
  }, []);

  return (
    <div className="home text-center">
      {/* Video de fondo */}
      <video autoPlay muted className="video-background">
        <source src="/videos/musi.mp4" type="video/mp4" />
        Tu navegador no soporta el video.
      </video>
    </div>
  );
}

export default Home;
