// src/components/CreateForum.jsx

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/components/CreateForum.css';

const CreateForum = () => {
    // Estado local para almacenar el título del foro
    const [title, setTitle] = useState('');
    // Estado local para almacenar la descripción del foro
    const [description, setDescription] = useState('');
    // Hook de navegación para redirigir al usuario a otra página
    const navigate = useNavigate();

    // Función para manejar el envío del formulario de creación de foro
    const handleSubmit = async (e) => {
        e.preventDefault(); // Evita la recarga de página en el envío del formulario
        const token = localStorage.getItem('token'); // Obtiene el token de autenticación del usuario
        const newForum = { title, description }; // Crea un objeto con el título y descripción del foro

        try {
            // Envía una solicitud POST al backend para crear el nuevo foro
            await axios.post('http://localhost:8000/forums/new', newForum, {
                headers: {
                    'Authorization': `Bearer ${token}`, // Incluye el token en los headers para autenticación
                    'Content-Type': 'application/json'
                }
            });
            // Resetea los campos del formulario después de crear el foro con éxito
            setTitle('');
            setDescription('');
            // Redirige a la página de lista de foros
            navigate('/forums');
        } catch (error) {
            console.error('Error creando el foro:', error); // Muestra el error en consola si la creación falla
        }
    };

    return (
        <div className="container mt-4 p-5 create-forum-container">
            {/* Título de la sección de creación de foro */}
            <h3 className="create-forum-title">Crear Nuevo Foro</h3>
            
            {/* Formulario de creación de foro */}
            <form onSubmit={handleSubmit} className="create-forum-form">
                {/* Campo de entrada para el título del foro */}
                <div className="form-group mb-3">
                    <label htmlFor="title" className="create-forum-label">
                        Título del Foro
                    </label>
                    <input
                        type="text"
                        id="title"
                        className="form-control create-forum-input"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)} // Actualiza el estado con el valor ingresado
                        placeholder="Escribe un título llamativo..."
                        required // Hace que el campo sea obligatorio
                    />
                </div>

                {/* Campo de entrada para la descripción del foro */}
                <div className="form-group mb-3">
                    <label htmlFor="description" className="create-forum-label">
                        Descripción
                    </label>
                    <textarea
                        id="description"
                        className="form-control create-forum-textarea"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)} // Actualiza el estado con el valor ingresado
                        placeholder="Describe el tema de discusión..."
                        required // Hace que el campo sea obligatorio
                    />
                </div>

                {/* Botón para enviar el formulario y crear el foro */}
                <button type="submit" className="btn create-forum-button w-100">
                    Crear Foro
                </button>
            </form>
        </div>
    );
};

export default CreateForum; 
