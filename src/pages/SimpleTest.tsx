import { useState } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';

const SimpleTest = () => {
  const [count, setCount] = useState(0);
  const [data, setData] = useState<any>(null);

  const loadData = async () => {
    try {
      console.log('Cargando datos...');
      const response = await fetch('/data/asientos_electorales_gps.json');
      const json = await response.json();
      console.log('Datos cargados:', json.length);
      setData(json);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Prueba Simple
        </Typography>
        <Typography variant="body1" paragraph>
          Contador: {count}
        </Typography>
        <Button variant="contained" onClick={() => setCount(count + 1)}>
          Incrementar
        </Button>
        <Button variant="contained" onClick={loadData} sx={{ ml: 2 }}>
          Cargar Datos
        </Button>
        {data && (
          <Typography variant="body2" sx={{ mt: 2 }}>
            Datos cargados: {data.length} registros
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default SimpleTest;