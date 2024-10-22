// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000', // Asegúrate de que el puerto y la URL sean correctos
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
    const response = await api.post('/admin/events/new', newEvent);  // Usar la ruta correcta
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
    const response = await api.post('/forums/new', newForum);  // Usar la ruta correcta
    console.log('Foro creado:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creando el foro:', error);
  }
};

// Petición para obtener eventos filtrados por categoría
export const getEventsByCategory = async (category) => {
  try {
    const response = await api.get(`/api/events?category=${category}`);  // Pasar la categoría como parámetro de consulta
    return response.data;
  } catch (error) {
    console.error('Error obteniendo eventos por categoría:', error);
  }
};
