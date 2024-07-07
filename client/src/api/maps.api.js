import axios from 'axios';

const mapsApi = axios.create({
  baseURL: 'http://localhost:8000/api/maps/'  // Asegúrate de que la URL base coincide con la configuración de tu backend
});

export const addLocation = (location) => mapsApi.post('/add_location/', location);
