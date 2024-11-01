// src/pages/Register.jsx

import React, { useState } from 'react';
import axios from 'axios';
import '../styles/pages/Register.css'; 

const Register = () => {
    const [email, setEmail] = useState(''); // Estado para almacenar el email
    const [password, setPassword] = useState(''); // Estado para almacenar la contraseña
    const [confirmPassword, setConfirmPassword] = useState(''); // Estado para confirmar la contraseña

    // Maneja el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Verifica que las contraseñas coincidan
        if (password !== confirmPassword) {
            alert('Las contraseñas no coinciden');
            return;
        }

        try {
            // Realiza la solicitud de registro al backend
            const response = await axios.post('http://localhost:8000/api/register', {
                email,
                password,
            });
            alert('Usuario registrado con éxito');
            console.log('Registro exitoso:', response.data);
        } catch (error) {
            console.error('Error en el registro:', error);
            alert('Error en el registro');
        }
    };

    return (
        <div className="container register-container">
            <h1 className="register-title">Registro</h1>
            <form onSubmit={handleSubmit} className="register-form">
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
                <div className="form-group mb-3">
                    <label className="text-white">Confirmar Contraseña:</label>
                    <input
                        type="password"
                        className="form-control register-input"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn register-button">
                    Registrarse
                </button>
            </form>
        </div>
    );
};

export default Register;
