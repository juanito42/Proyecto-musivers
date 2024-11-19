// src/services/api.js

import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000', 
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
    const response = await api.post('/api/admin/events', newEvent);
    console.log('Evento creado:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creando el evento:', error);
    throw error;
  }
};
// Función para crear un nuevo foro
export const createForum = async (newForum) => {
  try {
    const response = await api.post('/api/forums/new', newForum);  
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

/// Función para obtener el perfil del usuario autenticado
export const getProfile = async () => {
  try {
    const response = await api.get('/api/profile');
    console.log('Perfil obtenido:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error obteniendo el perfil:', error.response?.data || error.message);
    if (error.response && error.response.status === 404) {
      console.error('Perfil no encontrado.');
    }
    throw error;
  }
};

// Función para crear o actualizar el perfil del usuario autenticado
export const saveProfile = async (profileData) => {
  try {
    const response = await api.put('/api/profile', profileData);
    console.log('Perfil guardado:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error guardando el perfil:', error.response?.data || error.message);
    throw error;
  }
};

// Obtener grupos de rock con paginación
export const getGruposRock = async (page = 1, limit = 1) => {
  const response = await api.get(`/api/grupos-rock?page=${page}&limit=${limit}`);
  return response.data;
};


export default api;

