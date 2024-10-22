import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post('http://localhost:8000/api/login', formData);
            const token = response.data.token;
            localStorage.setItem('token', token); // Guardar el token en localStorage
            alert('Login exitoso');
            navigate('/'); // Redirige al usuario a la página principal
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            setError('Credenciales inválidas o servidor no disponible');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <h2>Iniciar Sesión</h2>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="form-group mb-3">
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        className="form-control"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group mb-3">
                    <label>Contraseña:</label>
                    <input
                        type="password"
                        name="password"
                        className="form-control"
                        value={formData.password}
                        onChange={handleInputChange}
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

export default LoginForm;
