import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useElectoralStore } from "../store/useElectoralStore";
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Paper,
  Stack,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Map as MapIcon, Place } from "@mui/icons-material";
import MapComponent from "../components/MapComponent";
import { SeatMarkers } from "../components/SeatMarkers";
import { electoralDataService } from "../services/electoralData.service";
import {
  DEFAULT_LATITUDE,
  DEFAULT_LONGITUDE,
  ZOOM_COUNTRY,
} from "../types/leaflet";

const VistaNacional = () => {
  const navigate = useNavigate();
  const { setCurrentView, departments } = useElectoralStore();
  const [seats, setSeats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSeats = async () => {
      try {
        setLoading(true);

        await electoralDataService.loadSeats();
        const allSeats = electoralDataService.getSeats();

        setSeats(allSeats);
        setError(null);
      } catch (err) {
        console.error("=== Error al cargar asientos ===", err);
        setError("Error al cargar los asientos electorales");
      } finally {
        setLoading(false);
      }
    };

    loadSeats();
  }, []);

  const handleDepartamentoClick = (nombre: string) => {
    setCurrentView({
      level: "department",
      data: { Departamento: nombre },
    });
    navigate(`/vista_departamento/${nombre}`, {
      state: { level: "department", data: { Departamento: nombre } },
    });
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "grey.50", py: 4 }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="center"
            spacing={2}
            mb={2}
          >
            <MapIcon sx={{ fontSize: 40, color: "primary.main" }} />
            <Typography
              variant="h3"
              component="h1"
              color="text.primary"
              fontWeight="bold"
            >
              Mapa Nacional - Bolivia 2026
            </Typography>
          </Stack>
          <Typography variant="h6" color="text.secondary">
            Visualización de asientos electorales urbanos en todo el país
          </Typography>
        </Box>

        {/* Mapa Principal */}
        <Paper sx={{ mb: 4, elevation: 2, overflow: "hidden" }}>
          <Box
            sx={{
              height: "500px",
              width: "100%",
              position: "relative",
              bgcolor: "#f5f5f5",
            }}
          >
            {loading ? (
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "grey.100",
                  zIndex: 10,
                }}
              >
                <Stack alignItems="center" spacing={2}>
                  <CircularProgress size={60} />
                  <Typography variant="body1" color="text.secondary">
                    Cargando mapa electoral...
                  </Typography>
                </Stack>
              </Box>
            ) : error ? (
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "grey.100",
                  zIndex: 10,
                }}
              >
                <Alert severity="error" sx={{ maxWidth: 400 }}>
                  {error}
                </Alert>
              </Box>
            ) : (
              <Box sx={{ height: "100%", width: "100%" }}>
                <MapComponent
                  center={[DEFAULT_LATITUDE, DEFAULT_LONGITUDE]}
                  zoom={ZOOM_COUNTRY}
                >
                  <SeatMarkers
                    seats={seats.filter(
                      (seat) => seat.Tipo_Urbano_Rural === "Urbano",
                    )}
                  />
                </MapComponent>
              </Box>
            )}
          </Box>
        </Paper>

        {/* Instrucciones de uso */}
        <Paper sx={{ p: 3, mb: 4, elevation: 1, bgcolor: "info.50" }}>
          <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
            💡 Cómo interactuar con el mapa:
          </Typography>
          <Stack spacing={1}>
            <Typography variant="body2" color="text.secondary">
              • <strong>Hover (pasar el mouse):</strong> Muestra información
              rápida del asiento electoral
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • <strong>Click:</strong> Abre un popup con información detallada
              del asiento
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • <strong>Zoom:</strong> Usa la rueda del mouse o los controles
              para acercar/alejar
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • <strong>Arrastrar:</strong> Mueve el mapa para explorar
              diferentes áreas
            </Typography>
          </Stack>
        </Paper>

        {/* Estadísticas Generales */}
        <Paper sx={{ p: 4, mb: 4, elevation: 2 }}>
          <Typography
            variant="h5"
            component="h2"
            gutterBottom
            fontWeight="medium"
          >
            Estadísticas Generales - Bolivia 2026
          </Typography>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <Paper
                sx={{
                  p: 3,
                  textAlign: "center",
                  bgcolor: "primary.50",
                  border: 1,
                  borderColor: "primary.200",
                }}
                elevation={0}
              >
                <Typography variant="h4" color="primary.main" fontWeight="bold">
                  {seats.length}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Total
                </Typography>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <Paper
                sx={{
                  p: 3,
                  textAlign: "center",
                  bgcolor: "primary.50",
                  border: 1,
                  borderColor: "primary.200",
                }}
                elevation={0}
              >
                <Typography variant="h4" color="primary.main" fontWeight="bold">
                  {seats.filter((s) => s.Tipo_Urbano_Rural === "Urbano").length}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  Asientos Urbanos
                </Typography>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <Paper
                sx={{
                  p: 3,
                  textAlign: "center",
                  bgcolor: "info.50",
                  border: 1,
                  borderColor: "info.200",
                }}
                elevation={0}
              >
                <Typography variant="h4" color="info.main" fontWeight="bold">
                  {seats.filter((s) => s.Tipo_Urbano_Rural === "Rural").length}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  Asientos Rurales
                </Typography>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <Paper
                sx={{
                  p: 3,
                  textAlign: "center",
                  bgcolor: "warning.50",
                  border: 1,
                  borderColor: "warning.200",
                }}
                elevation={0}
              >
                <Typography variant="h4" color="warning.main" fontWeight="bold">
                  {
                    seats.filter((s) => s.Tipo_Circunscripcion === "Mixto")
                      .length
                  }
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  Circunscripciones Mixtas
                </Typography>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <Paper
                sx={{
                  p: 3,
                  textAlign: "center",
                  bgcolor: "info.50",
                  border: 1,
                  borderColor: "info.200",
                }}
                elevation={0}
              >
                <Typography variant="h4" color="info.main" fontWeight="bold">
                  {
                    seats.filter((s) => s.Tipo_Circunscripcion === "Uninominal")
                      .length
                  }
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  Circunscripciones Uninominales
                </Typography>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <Paper
                sx={{
                  p: 3,
                  textAlign: "center",
                  bgcolor: "secondary.50",
                  border: 1,
                  borderColor: "secondary.200",
                }}
                elevation={0}
              >
                <Typography
                  variant="h4"
                  color="secondary.main"
                  fontWeight="bold"
                >
                  {
                    seats.filter((s) => s.Tipo_Circunscripcion === "Especial")
                      .length
                  }
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  Circunscripciones Especiales
                </Typography>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <Paper
                sx={{
                  p: 3,
                  textAlign: "center",
                  bgcolor: "secondary.50",
                  border: 1,
                  borderColor: "secondary.200",
                }}
                elevation={0}
              >
                <Typography
                  variant="h4"
                  color="secondary.main"
                  fontWeight="bold"
                >
                  {departments.length}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  <Place
                    sx={{ fontSize: 16, verticalAlign: "middle", mr: 0.5 }}
                  />
                  Departamentos
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Paper>

        {/* Tarjetas de Departamentos */}
        <Paper sx={{ p: 4, elevation: 2 }}>
          <Typography
            variant="h5"
            component="h2"
            gutterBottom
            fontWeight="medium"
          >
            Seleccionar Departamento
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Haz clic en un departamento para ver los detalles electorales
          </Typography>

          <Grid container spacing={3}>
            {departments.map((dept) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={dept.code}>
                <Card
                  sx={{
                    height: "100%",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: 6,
                    },
                    cursor: "pointer",
                  }}
                  onClick={() => handleDepartamentoClick(dept.name)}
                >
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mb: 2,
                        width: 60,
                        height: 60,
                        borderRadius: 2,
                        bgcolor: "primary.main",
                        color: "white",
                        fontSize: "1.5rem",
                        fontWeight: "bold",
                      }}
                    >
                      {dept.code}
                    </Box>
                    <Typography
                      variant="h6"
                      component="h3"
                      align="center"
                      fontWeight="medium"
                    >
                      {dept.name}
                    </Typography>
                    <Button
                      variant="contained"
                      fullWidth
                      sx={{ mt: 2 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDepartamentoClick(dept.name);
                      }}
                    >
                      Ver Detalles
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default VistaNacional;
