import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchEvents = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("No token found, redirecting to login");
      navigate("/auth");
      return;
    }

    try {
      const response = await axios.get("http://localhost:8000/api/events", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Eventos obtenidos:", response.data);
      setEvents(response.data);
    } catch (error) {
      console.error("Error al obtener los eventos:", error);
      if (error.response && error.response.status === 401) {
        navigate("/auth");
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  if (loading) {
    return <div className="container mt-5 text-center">Cargando eventos...</div>;
  }

  return (
    <div className="container">
      <h1 className="mt-5">Eventos</h1>
      <div className="row">
        {events.map((event, index) => (
          <div className="col-md-4" key={event.id || index}>
            <div className="card mb-4 shadow-sm" style={{ height: "100%" }}>
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
        ))}
      </div>
    </div>
  );
};

export default EventsPage;
