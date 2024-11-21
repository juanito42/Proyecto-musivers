// src/components/RegisterForm.jsx

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/components/RegisterForm.css'; 

const RegisterForm = () => {
    // Estado local para almacenar el email y la contraseña del usuario
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    // Estado de carga y manejo de errores
    const [loading, setLoading] = useState(false); 
    const [error, setError] = useState(null); 
    
    // Hook de navegación para redirigir a otra página
    const navigate = useNavigate(); 

    // Maneja el envío del formulario de registro
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Activa el indicador de carga
        setError(null); // Limpia errores previos

        try {
            // Realiza una solicitud POST al backend para registrar al usuario
            const response = await axios.post('http://localhost:8000/api/register', {
                email,
                password
            });
            alert('Registro exitoso'); // Alerta de éxito
            console.log('Usuario registrado:', response.data);
            
            // Limpia los campos de entrada después del registro exitoso
            setEmail('');
            setPassword('');
            
            // Redirige al formulario de autenticación para iniciar sesión
            navigate('/auth'); 
        } catch (error) {
            // Maneja errores de autenticación o de servidor
            if (error.response && error.response.status === 401) {
                setError('No autorizado: Verifica tus credenciales');
            } else {
                setError('Error al registrar el usuario');
            }
            console.error('Error en el registro:', error);
        } finally {
            setLoading(false); // Desactiva el indicador de carga al finalizar
        }
    };

    return (
        <div className="container register-container">
            <h2 className="register-header">Registro de Usuario</h2>

            {/* Muestra un mensaje de error si hay uno presente */}
            {error && <div className="alert alert-danger text-center">{error}</div>}

            <form onSubmit={handleSubmit} className="register-form">
                {/* Campo de entrada para el email */}
                <div className="form-group mb-3">
                    <label className="text-white">Email:</label>
                    <input
                        type="email"
                        className="form-control register-input"
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
                        className="form-control register-input"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                {/* Botón para enviar el formulario */}
                <button 
                    type="submit" 
                    className="btn register-button"
                    disabled={loading}
                >
                    {loading ? 'Registrando...' : 'Registrarse'}
                </button>
            </form>
            <br />
        </div>
    );
};

export default RegisterForm;
