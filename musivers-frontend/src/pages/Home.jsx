// src/pages/Home.jsx

import React, { useEffect, useRef, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "animate.css";
import '../styles/pages/Home.css';

function Home() {
  const audioRef = useRef(null);
  const [audioBlocked, setAudioBlocked] = useState(false);

  useEffect(() => {
    const homeElement = document.querySelector(".home");
    homeElement.classList.add("animate__animated", "animate__fadeIn");

    // Intento de reproducir el audio al cargar la página
    if (audioRef.current) {
      audioRef.current.play().catch((error) => {
        console.log("El navegador ha bloqueado la reproducción automática.");
        setAudioBlocked(true); // Muestra el mensaje si el navegador bloquea el audio
      });
    }
  }, []);

  // Función para reproducir el audio si ha sido bloqueado
  const handleAudioPlay = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setAudioBlocked(false); // Oculta el mensaje una vez que se reproduce el audio
    }
  };

  return (
    <div className="home text-center" onClick={handleAudioPlay}>
      {/* Video de fondo */}
      <video autoPlay muted className="video-background">
        <source src="/videos/musi.mp4" type="video/mp4" />
        Tu navegador no soporta el video.
      </video>

      {/* Música de fondo */}
      <audio ref={audioRef} loop>
        <source src="/audio/action.mp3" type="audio/mp3" />
        Tu navegador no soporta el audio.
      </audio>

      {/* Mostrar mensaje si el audio es bloqueado */}
      {audioBlocked && (
        <div className="audio-warning">
          Habilitar el sonido.
        </div>
      )}
    </div>
  );
}

export default Home;
