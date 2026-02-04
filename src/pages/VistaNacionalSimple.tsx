import { Box, Typography, Paper, Container } from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix de iconos de Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
});

const VistaNacionalSimple = () => {
  console.log('=== VistaNacionalSimple renderizado ===');
  
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "grey.50", py: 4 }}>
      <Container maxWidth="xl">
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography variant="h3" component="h1" fontWeight="bold">
            Mapa Nacional - Bolivia 2026 (Simple)
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Prueba de mapa sin cargar datos
          </Typography>
        </Box>

        <Paper sx={{ mb: 4, elevation: 2, overflow: "hidden" }}>
          <Box sx={{ height: "500px", width: "100%", position: "relative", bgcolor: "#f5f5f5" }}>
            <MapContainer
              center={[-16.2902, -63.5887]}
              zoom={6}
              style={{ height: '100%', width: '100%', position: 'absolute', top: 0, left: 0 }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              />
              <Marker position={[-16.2902, -63.5887]}>
                <Popup>
                  <div>
                    <strong>Bolivia</strong><br />
                    Centro del país
                  </div>
                </Popup>
              </Marker>
            </MapContainer>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default VistaNacionalSimple;