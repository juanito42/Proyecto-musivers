// src/pages/CategoryPage.jsx
import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import dayjs from 'dayjs';

const CategoryPage = () => {
    const { category } = useParams(); // Obtener la categoría de los parámetros de la URL
    const [events, setEvents] = useState([]);

    // Función para obtener los eventos relacionados con la categoría
    const fetchEventsByCategory = useCallback(async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/events?category=${category}`);
            setEvents(response.data); // Actualizar el estado con los eventos obtenidos
        } catch (error) {
            console.error('Error obteniendo los eventos:', error);
        }
    }, [category]);

    useEffect(() => {
        fetchEventsByCategory();
    }, [fetchEventsByCategory]);

    return (
        <div className="container">
            <h1 className="mt-5">Eventos de la Categoría: {category}</h1>
            <div className="row">
                {events.length === 0 ? (
                    <p>No hay eventos disponibles para esta categoría</p>
                ) : (
                    events.map((event) => (
                        <div className="col-md-4" key={event.id}>
                            <div className="card mb-4 shadow-sm">
                                <img
                                    src={event.photoFilename ? `http://localhost:8000/uploads/photos/${event.photoFilename}` : "http://localhost:8000/uploads/photos/default-event.jpg"}
                                    className="card-img-top img-fluid"
                                    alt={event.title || 'Evento sin foto'}
                                    style={{ objectFit: 'cover', height: '200px', width: '100%' }}
                                />
                                <div className="card-body">
                                    <h5 className="card-title">{event.title || 'Título no disponible'}</h5>
                                    <p className="card-text">{event.description || 'Descripción no disponible'}</p>
                                    <p className="card-text">
                                        <small>{event.date ? dayjs(event.date).format('YYYY-MM-DD HH:mm') : 'Fecha no disponible'}</small>
                                    </p>
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
