import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import dayjs from 'dayjs';

const CategoryPage = () => {
  const { category } = useParams(); // Obtener la categoría de los parámetros de la URL
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true); // Estado para mostrar carga

  const fetchEventsByCategory = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
        console.error('Token no encontrado, redirigiendo al login');
        return;
    }

    try {
        const response = await axios.get(`http://localhost:8000/api/events?category=${category}`, {
            headers: {
                Authorization: `Bearer ${token}`, // Asegúrate de que el token JWT se envía aquí
            },
        });
        setEvents(response.data); // Actualiza el estado con los eventos obtenidos
    } catch (error) {
        console.error('Error obteniendo los eventos:', error);
    } finally {
        setLoading(false); // Deja de mostrar el cargando cuando la petición termina
    }
  }, [category]);

  useEffect(() => {
    fetchEventsByCategory();
  }, [fetchEventsByCategory]);

  if (loading) {
    return <div className="container mt-5 text-center">Cargando eventos...</div>;
  }

  return (
    <div className="container">
      <h1 className="mt-5 text-center">{category}</h1>
      <div className="row">
        {events.length === 0 ? (
          <p>No hay eventos disponibles para esta categoría</p>
        ) : (
          events.map((event, index) => (
            <div className="col-md-6 col-lg-3 mb-4" key={event.id || index}> {/* 4 columnas por fila en pantallas grandes */}
              <div className="card h-100 shadow-sm">
                <div className="card-img-container">
                  {event.photoFilename ? (
                    <img
                      src={`http://localhost:8000/uploads/photos/${event.photoFilename}`}
                      className="card-img-top img-fluid"
                      alt={event.title}
                      style={{ objectFit: "cover", height: "200px", width: "100%" }}
                    />
                  ) : (
                    <img
                      src="http://localhost:8000/uploads/photos/default-event.jpg"
                      className="card-img-top img-fluid"
                      alt="Evento sin foto"
                      style={{ objectFit: "cover", height: "200px", width: "100%" }}
                    />
                  )}
                </div>
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{event.title || "Título no disponible"}</h5>
                  <p className="card-text">{event.description || "Descripción no disponible"}</p>
                  <p className="card-text mt-auto">
                    <small>
                      {event.date ? dayjs(event.date).format("YYYY-MM-DD HH:mm") : "Fecha no disponible"}
                    </small>
                  </p>

                  {/* Mostrar la categoría del evento */}
                  <p className="card-text">
                    <strong>Categoría:</strong> {event.category || "Categoría no disponible"}
                  </p>

                  <div className="d-flex justify-content-between mt-2">
                    {event.url && (
                      <a href={event.url} target="_blank" rel="noopener noreferrer" className="btn btn-info">
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
