import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateForum = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const navigate = useNavigate(); // Initialize the navigate function

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const newForum = { title, description };

        try {
            await axios.post('http://localhost:8000/forums/new', newForum, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            // Clear the form fields
            setTitle('');
            setDescription('');

            // Redirect to the forums page after the forum is created
            navigate('/forums');
        } catch (error) {
            console.error('Error creando el foro:', error);
        }
    };

    return (
        <div className="mb-4">
            <h3>Crear Nuevo Foro</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Título del Foro</label>
                    <input
                        type="text"
                        className="form-control"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Descripción</label>
                    <textarea
                        className="form-control"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-success mt-2">Crear Foro</button>
            </form>
        </div>
    );
};

export default CreateForum;
