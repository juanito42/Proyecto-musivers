// src/pages/EventsPage.jsx

import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import '../styles/pages/EventsPage.css'; 

const EventsPage = () => {
  const [events, setEvents] = useState([]); // Estado para almacenar los eventos
  const [loading, setLoading] = useState(true); // Estado para manejar la carga de datos
  const navigate = useNavigate(); // Hook para redirigir al usuario si es necesario

  // Función para obtener los eventos desde la API
  const fetchEvents = useCallback(async () => {
    const token = localStorage.getItem("token"); // Obtiene el token de autenticación
    if (!token) {
      console.log("No token found, redirecting to login");
      navigate("/auth"); // Redirige a la página de autenticación si no hay token
      return;
    }

    try {
      const response = await axios.get("http://localhost:8000/api/events", {
        headers: {
          Authorization: `Bearer ${token}`, // Incluye el token en la cabecera de la solicitud
        },
      });
      console.log("Eventos obtenidos:", response.data);
      setEvents(response.data); // Actualiza el estado con los datos de eventos obtenidos
    } catch (error) {
      console.error("Error al obtener los eventos:", error);
      if (error.response && error.response.status === 401) {
        navigate("/auth"); // Redirige si ocurre un error 401 (no autorizado)
      }
    } finally {
      setLoading(false); // Finaliza el estado de carga
    }
  }, [navigate]);

  useEffect(() => {
    fetchEvents(); // Ejecuta la función para obtener eventos al montar el componente
  }, [fetchEvents]);

  if (loading) {
    // Muestra un mensaje de carga mientras se obtienen los eventos
    return <div className="container mt-5 text-center">Cargando eventos...</div>;
  }

  return (
    <div className="container events-container">
      <h1 className="events-header">Eventos</h1>
      <div className="row">
        {events.map((event, index) => (
          <div className="col-md-6 col-lg-3 mb-4" key={event.id || index}>
            <div className="card h-100 event-card">
              <div className="card-img-container">
                {event.photoFilename ? (
                  <img
                    src={`http://localhost:8000/uploads/photos/${event.photoFilename}`}
                    className="card-img-top img-fluid event-card-img"
                    alt={event.title}
                  />
                ) : (
                  <img
                    src="http://localhost:8000/uploads/photos/default-event.jpg"
                    className="card-img-top img-fluid event-card-img"
                    alt="Evento sin foto"
                  />
                )}
              </div>
              <div className="card-body d-flex flex-column">
                <h5 className="card-title event-card-title">
                  {event.title || "Título no disponible"}
                </h5>
                <p className="card-text event-card-description">
                  {event.description || "Descripción no disponible"}
                </p>
                <p className="card-text mt-auto event-card-date">
                  <small>
                    {event.date ? dayjs(event.date).format("DD-MM-YYYY HH:mm") : "Fecha no disponible"}
                  </small>
                </p>

                {/* Muestra la categoría del evento */}
                <p className="card-text event-card-category">
                  <strong>Categoría:</strong> {event.category || "Categoría no disponible"}
                </p>

                {/* Botón para más información si el evento tiene URL */}
                <div className="d-flex justify-content-between mt-2">
                  {event.url && (
                    <a
                      href={event.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-info event-info-button"
                    >
                      Más información
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventsPage;

