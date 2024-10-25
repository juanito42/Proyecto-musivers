// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000', // Verifica que el puerto y URL sean correctos
});

// Configuración del token de autenticación en cada solicitud
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Llamada API para el registro de usuario
export const registerUser = (formData) => api.post('/api/register', formData);

// Llamada API para iniciar sesión
export const loginUser = (formData) => api.post('/api/login', formData);

// Obtener todos los eventos
export const getEvents = () => api.get('/api/events');

// Función para crear un nuevo evento
export const createEvent = async (newEvent) => {
  try {
    const response = await api.post('/api/admin/events/new', newEvent);  // Asegúrate de usar la ruta correcta
    console.log('Evento creado:', response.data);
    return response.data; // Devuelve los datos del evento si necesitas manejar la respuesta en otro lado
  } catch (error) {
    console.error('Error creando el evento:', error);
    throw error; // Lanza el error para que pueda ser capturado en el componente
  }
};

// Función para crear un nuevo foro
export const createForum = async (newForum) => {
  try {
    const response = await api.post('/api/forums/new', newForum);  // Usar la ruta correcta y verificar que exista en el backend
    console.log('Foro creado:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creando el foro:', error);
    throw error;
  }
};

// Petición para obtener eventos filtrados por categoría
export const getEventsByCategory = async (category) => {
  try {
    const response = await api.get(`/api/events?category=${category}`);
    return response.data;
  } catch (error) {
    console.error('Error obteniendo eventos por categoría:', error);
    throw error;
  }
};
