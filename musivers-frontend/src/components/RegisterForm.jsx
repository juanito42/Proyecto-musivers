import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Importa el hook useNavigate

const RegisterForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Inicializa el hook useNavigate

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post('http://localhost:8000/api/register', {
                email,
                password
            });
            alert('Registro exitoso');
            console.log('Usuario registrado:', response.data);
            setEmail('');
            setPassword('');
            navigate('/auth'); // Redirigir al login después del registro exitoso
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setError('No autorizado: Verifica tus credenciales');
            } else {
                setError('Error al registrar el usuario');
            }
            console.error('Error en el registro:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <h2>Registro de Usuario</h2>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
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
                    {loading ? 'Registrando...' : 'Registrarse'}
                </button>
            </form>
        </div>
    );
};

export default RegisterForm;
