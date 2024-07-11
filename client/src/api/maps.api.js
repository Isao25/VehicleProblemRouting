import axios from 'axios';

const mapsApi = axios.create({
  baseURL: 'http://localhost:8000/api/maps/'  // Asegúrate de que la URL base coincide con la configuración de tu backend
});

export const addLocation = (location) => mapsApi.post('/add_location/', location);
export const solveVRP = (data) => mapsApi.post('/solve_VRP/', data);
export const solveCVRP = (data) => mapsApi.post('/solve_CVRP/', data);
export const solveVRPTW = (data) => mapsApi.post('/solve_VRPTW/', data);
