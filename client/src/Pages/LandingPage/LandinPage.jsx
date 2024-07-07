import React from "react";
import { Button, MenuItem, Select, Typography, Container, Box, InputLabel, FormControl } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify'; // Importa ToastContainer y toast desde react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Importa los estilos CSS de react-toastify

export const LandingPage = () => {
  const [option, setOption] = React.useState("");
  const navigate = useNavigate();

  const handleChange = (event) => {
    setOption(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (option) {
      console.log("Selected option:", option);
      navigate("/anlize-vrp");
    } else {
      toast.error('Seleccione una opción antes de continuar'); 
    }
  };

  return (
    <Box
      sx={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(to right, #ffe5ec, #e3f8ff)',
        overflow: 'hidden',
      }}
    >
      <Container maxWidth="md" sx={{ px: { xs: 2, md: 4 }, textAlign: 'center' }}>
        <Box display="flex" flexDirection="column" alignItems="center" textAlign="center" gap={4}>
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontSize: { xs: '2.5rem', sm: '3rem', md: '4rem' },
                fontWeight: 'bold',
                color: '#333',
              }}
            >
              Solución al problema de ruteo vehicular
            </Typography>
            <Typography
              sx={{
                mx: 'auto',
                maxWidth: '600px',
                fontSize: { xs: '1rem', md: '1.25rem' },
                color: 'rgba(51, 51, 51, 0.7)',
                mt: 2,
              }}
            >
              La pagina web busca dar solución a las variantes del problema de ruteo vehicular
            </Typography>
          </Box>
          <Box sx={{ width: '100%', maxWidth: '400px' }}>
            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', gap: 2 }}>
              <FormControl fullWidth>
                <InputLabel id="select-label">Select an option</InputLabel>
                <Select
                  labelId="select-label"
                  value={option}
                  label="Select an option"
                  onChange={handleChange}
                  sx={{
                    backgroundColor: 'white',
                    borderRadius: '4px',
                  }}
                >
                  <MenuItem value="VRP">VRP</MenuItem>
                  <MenuItem value="CVRP">CVRP</MenuItem>
                  <MenuItem value="VRPTW">VRPTW</MenuItem>
                  <MenuItem value="VRPB">VRPB</MenuItem>
                  <MenuItem value="VRPPD">VRPPD</MenuItem>
                </Select>
              </FormControl>
              <Button type="submit" variant="contained" color="primary" sx={{ height: '56px', backgroundColor: '#ff80ab' }}>
                Get Started
              </Button>
            </Box>
            <Typography variant="body2" sx={{ mt: 2, color: 'rgba(51, 51, 51, 0.7)' }}>
              Elige una de las variantes del problema de ruteo vehicular
            </Typography>
          </Box>
        </Box>
      </Container>
      <ToastContainer /> 
    </Box>
  );
};
