// src/pages/CategoryPage.jsx

import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import '../styles/pages/CategoryPage.css'; 
const CategoryPage = () => {
  const { category } = useParams(); // Obtiene la categoría actual de los parámetros de la URL
  const [events, setEvents] = useState([]); // Estado para almacenar eventos por categoría
  const [loading, setLoading] = useState(true); // Estado de carga de datos

  // Función para obtener eventos de una categoría específica
  const fetchEventsByCategory = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token no encontrado, redirigiendo al login");
      return;
    }
  
    try {
      const response = await axios.get(
        `http://localhost:8000/api/events?category=${category}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      console.log("Datos recibidos:", response.data);
  
      // Verifica y establece los eventos
      setEvents(response.data.data || []); // Usa "data.data" para acceder a los eventos
    } catch (error) {
      console.error("Error obteniendo los eventos:", error);
      setEvents([]); // Evita errores si no hay datos disponibles
    } finally {
      setLoading(false);
    }
  }, [category]);

  // Efecto para cargar los eventos al montar el componente o cambiar de categoría
  useEffect(() => {
    fetchEventsByCategory();
  }, [fetchEventsByCategory]);

  if (loading) {
    // Muestra un mensaje de carga mientras se obtienen los eventos
    return <div className="container mt-5 text-center">Cargando eventos...</div>;
  }

  return (
    <div className="container category-container">
      <h1 className="category-header">{category}</h1>
      <div className="row">
        {events.length === 0 ? (
          // Muestra un mensaje si no hay eventos en esta categoría
          <p className="text-center">No hay eventos disponibles para esta categoría</p>
        ) : (
          events.map((event, index) => (
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
                  <p className="card-text event-card-text">
                    {event.description || "Descripción no disponible"}
                  </p>
                  <p className="card-text mt-auto event-card-date">
                    <small>
                      {event.date ? dayjs(event.date).format("YYYY-MM-DD HH:mm") : "Fecha no disponible"}
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
          ))
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
