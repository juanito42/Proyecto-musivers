// src/components/AuthForm.jsx

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/components/AuthForm.css'; 

const AuthForm = () => {
    const [email, setEmail] = useState(''); // Estado para almacenar el email
    const [password, setPassword] = useState(''); // Estado para almacenar la contraseña
    const [loading, setLoading] = useState(false); // Estado para indicar carga
    const [error, setError] = useState(null); // Estado para manejar mensajes de error
    const navigate = useNavigate(); // Hook de React Router para redirigir

    // Maneja el proceso de inicio de sesión
    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post('http://localhost:8000/api/login', { email, password });
            const token = response.data.token; // Extrae el token de la respuesta
            localStorage.setItem('token', token); // Almacena el token en localStorage
            console.log('Inicio de sesión exitoso, token almacenado:', token);
            navigate('/'); // Redirige a la página principal tras el inicio de sesión
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            setError('Credenciales inválidas o servidor no disponible');
        } finally {
            setLoading(false); // Desactiva el indicador de carga
        }
    };

    return (
        <div className="container mt-5 auth-form-container">
            <h2 className="auth-form-title">Iniciar Sesión</h2>

            {/* Mensaje de error */}
            {error && <div className="alert alert-danger auth-form-error">{error}</div>}

            <form onSubmit={handleLogin} className="auth-form">
                {/* Campo de entrada para el email */}
                <div className="form-group mb-3">
                    <label className="text-white">Email:</label>
                    <input
                        type="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                {/* Campo de entrada para la contraseña */}
                <div className="form-group mb-3">
                    <label className="text-white">Contraseña:</label>
                    <input
                        type="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                {/* Botón de envío con indicador de carga */}
                <button
                    type="submit"
                    className="btn btn-primary w-100 auth-form-button"
                    disabled={loading}
                >
                    {loading ? 'Iniciando...' : 'Iniciar Sesión'}
                </button>
            </form>

            {/* Botón para redirigir a la página de registro */}
            <div className="text-center mt-3">
                <button
                    className="btn btn-secondary auth-form-secondary-button"
                    onClick={() => navigate('/register')}
                >
                    Registrarse
                </button>
            </div>
        </div>
    );
};

export default AuthForm;
