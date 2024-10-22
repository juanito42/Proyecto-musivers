import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Realiza la solicitud de inicio de sesión
            const response = await axios.post('http://localhost:8000/api/login', {
                email,
                password,
            });

            // Obtenemos el token JWT de la respuesta
            const token = response.data.token;

            // Guardamos el token en localStorage
            localStorage.setItem('token', token);
            console.log('Inicio de sesión exitoso, token almacenado:', token);

            // Redirige al usuario a la página de foros o donde desees
            navigate('/');
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            setError('Credenciales inválidas o servidor no disponible');
        } finally {
            setLoading(false); // Termina el indicador de carga
        }
    };

    return (
        <div className="container mt-5">
            <h2>Iniciar Sesión</h2>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleLogin}>
                <div className="form-group mb-3">
                    <label>Email:</label>
                    <input
                        type="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group mb-3">
                    <label>Contraseña:</label>
                    <input
                        type="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Iniciando...' : 'Iniciar Sesión'}
                </button>
            </form>

            <div className="mt-3">
                <button 
                    className="btn btn-secondary"
                    onClick={() => navigate('/register')} 
                >
                    Registrarse
                </button>
            </div>
        </div>
    );
};

export default AuthForm;
