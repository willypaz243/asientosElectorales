import { ArrowDownward, Clear } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MapComponent from "../components/MapComponent";
import { SeatMarkers } from "../components/SeatMarkers";
import { electoralDataService } from "../services/electoralData.service";
import { useElectoralStore } from "../store/useElectoralStore";
import {
  DEFAULT_LATITUDE,
  DEFAULT_LONGITUDE,
  DEPARTAMENTO_COORDINATES,
  ZOOM_DEPARTMENT,
} from "../types/leaflet";

const VistaDepartamento = () => {
  const navigate = useNavigate();
  const params = useParams();
  const departamento = params.departamento;

  const { setCurrentView } = useElectoralStore();

  const [mapCenter, setMapCenter] = useState<[number, number]>([
    DEFAULT_LATITUDE,
    DEFAULT_LONGITUDE,
  ]);

  // Estados
  const [seats, setSeats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filtros
  const [filters, setFilters] = useState({
    provincia: "",
    municipio: "",
    tipoUrbanoRural: "",
    tipoCircunscripcion: "",
  });
  const [filteredSeats, setFilteredSeats] = useState<any[]>([]);

  // Lista de opciones
  const [provincias, setProvincias] = useState<string[]>([]);
  const [municipios, setMunicipios] = useState<string[]>([]);

  useEffect(() => {
    const initializeView = async () => {
      if (departamento) {
        try {
          setLoading(true);
          setError(null);

          const dep_coor = DEPARTAMENTO_COORDINATES[departamento];

          setMapCenter([dep_coor.lat, dep_coor.lng]);
          setCurrentView({
            level: "department",
            data: { Departamento: departamento },
          });

          // Cargar asientos
          await electoralDataService.loadSeats();
          const allSeats = electoralDataService.getSeats();

          // Filtrar por departamento
          const deptSeats = allSeats.filter(
            (seat: any) => seat.Departamento === departamento,
          );
          setSeats(deptSeats);
          setFilteredSeats(deptSeats);

          // Obtener provincias únicas
          const uniqueProvincias = [
            ...new Set(deptSeats.map((s: any) => s.Provincia)),
          ].sort();
          setProvincias(uniqueProvincias);

          // Si hay un filtro de provincia seleccionado, cargar municipios
          if (filters.provincia) {
            const uniqueMunicipios = [
              ...new Set(
                deptSeats
                  .filter((s: any) => s.Provincia === filters.provincia)
                  .map((s: any) => s.Municipio),
              ),
            ].sort();
            setMunicipios(uniqueMunicipios);
          } else {
            setMunicipios([]);
          }

          // Limpiar filtros
          setFilters({
            provincia: "",
            municipio: "",
            tipoUrbanoRural: "",
            tipoCircunscripcion: "",
          });
        } catch (err) {
          console.error("Error:", err);
          setError("Error al cargar el departamento");
        } finally {
          setLoading(false);
        }
      } else {
        navigate("/vista_nacional");
      }
    };

    initializeView();
  }, [departamento]);

  // Aplicar filtros
  useEffect(() => {
    if (!seats || seats.length === 0) {
      setFilteredSeats(seats);
      return;
    }

    let result = [...seats];

    if (filters.provincia) {
      result = result.filter(
        (seat: any) => seat.Provincia === filters.provincia,
      );
    }

    if (filters.municipio) {
      result = result.filter(
        (seat: any) => seat.Municipio === filters.municipio,
      );
    }

    if (filters.tipoUrbanoRural) {
      result = result.filter(
        (seat: any) => seat.Tipo_Urbano_Rural === filters.tipoUrbanoRural,
      );
    }

    if (filters.tipoCircunscripcion) {
      result = result.filter(
        (seat: any) =>
          seat.Tipo_Circunscripcion === filters.tipoCircunscripcion,
      );
    }

    setFilteredSeats(result);
  }, [filters, seats]);

  // Manejar cambio de provincia
  const handleProvinciaChange = (provincia: string) => {
    setFilters((prev: any) => ({
      ...prev,
      provincia: provincia,
      municipio: "",
    }));

    if (provincia) {
      const uniqueMunicipios = [
        ...new Set(
          seats
            .filter((s: any) => s.Provincia === provincia)
            .map((s: any) => s.Municipio),
        ),
      ].sort();
      setMunicipios(uniqueMunicipios);
    } else {
      setMunicipios([]);
    }
  };

  // Manejar cambio de municipio
  const handleMunicipioChange = (municipio: string) => {
    setFilters((prev: any) => ({ ...prev, municipio }));
  };

  // Manejar cambio de circunscripción
  const handleTipoCircunscripcionChange = (tipo: string) => {
    setFilters((prev: any) => ({
      ...prev,
      tipoCircunscripcion: tipo,
    }));

    if (tipo && filters.provincia) {
      const uniqueMunicipios = [
        ...new Set(
          seats
            .filter(
              (s: any) =>
                s.Provincia === filters.provincia &&
                s.Tipo_Circunscripcion === tipo,
            )
            .map((s: any) => s.Municipio),
        ),
      ].sort();
      setMunicipios(uniqueMunicipios);
    } else {
      setMunicipios([]);
    }
  };

  // Limpiar todos los filtros
  const handleClearFilters = () => {
    setFilters({
      provincia: "",
      municipio: "",
      tipoUrbanoRural: "",
      tipoCircunscripcion: "",
    });
    setMunicipios([]);

    // Recargar todos los asientos
    setFilteredSeats(seats);
  };

  // Obtener código del departamento
  const departamentoCode = departamento
    ? electoralDataService.getDepartamentoCode(departamento)
    : "";

  // Ir a vista nacional
  const goBack = () => {
    navigate("/vista_nacional");
  };

  // Estadísticas
  const stats = {
    total: seats.length,
    urbano: seats.filter((s: any) => s.Tipo_Urbano_Rural === "Urbano").length,
    rural: seats.filter((s: any) => s.Tipo_Urbano_Rural === "Rural").length,
    activo: seats.filter((s: any) => s.Estado === "Habilitado TSE").length,
    mixto: seats.filter((s: any) => s.Tipo_Circunscripcion === "Mixto").length,
    uninominal: seats.filter(
      (s: any) => s.Tipo_Circunscripcion === "Uninominal",
    ).length,
    especial: seats.filter((s: any) => s.Tipo_Circunscripcion === "Especial")
      .length,
  };

  // Formatear tabla
  const tableData = filteredSeats.map((seat: any, index: number) => ({
    id: index,
    departamento: seat.Departamento,
    provincia: seat.Provincia,
    municipio: seat.Municipio,
    asiento: seat.Asiento_Electoral,
    ubi_rur: seat.Tipo_Urbano_Rural,
    circ: seat.Tipo_Circunscripcion,
    estado: seat.Estado,
    lat: seat.Latitud?.toFixed(6),
    lng: seat.Longitud?.toFixed(6),
  }));

  // Loading state
  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "grey.50",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Stack spacing={2} alignItems="center">
          <CircularProgress size={60} />
          <Typography variant="body1" color="text.secondary">
            Cargando datos...
          </Typography>
        </Stack>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "grey.50", py: 4 }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
          <Button
            startIcon={<ArrowDownward />}
            onClick={goBack}
            variant="outlined"
          >
            Volver
          </Button>
          <Box>
            <Typography variant="h4" fontWeight="bold" color="text.primary">
              {departamento} - {departamentoCode}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Mapa de Asientos Electorales
            </Typography>
          </Box>
        </Stack>

        {/* Estadísticas Rápidas */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, sm: 6, md: 6, lg: 3 }}>
            <Paper
              sx={{
                p: 2,
                textAlign: "center",
                bgcolor: "primary.50",
                border: 1,
                borderColor: "primary.200",
              }}
            >
              <Typography variant="h4" color="primary.main" fontWeight="bold">
                {stats.total}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total
              </Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 6, lg: 3 }}>
            <Paper
              sx={{
                p: 2,
                textAlign: "center",
                bgcolor: "info.50",
                border: 1,
                borderColor: "info.200",
              }}
            >
              <Typography variant="h4" color="info.main" fontWeight="bold">
                {stats.urbano}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Urbano
              </Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 6, lg: 3 }}>
            <Paper
              sx={{
                p: 2,
                textAlign: "center",
                bgcolor: "warning.50",
                border: 1,
                borderColor: "warning.200",
              }}
            >
              <Typography variant="h4" color="warning.main" fontWeight="bold">
                {stats.rural}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Rural
              </Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 6, lg: 3 }}>
            <Paper
              sx={{
                p: 2,
                textAlign: "center",
                bgcolor: "success.50",
                border: 1,
                borderColor: "success.200",
              }}
            >
              <Typography variant="h4" color="success.main" fontWeight="bold">
                {stats.activo}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Activos
              </Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 6, lg: 3 }}>
            <Paper
              sx={{
                p: 2,
                textAlign: "center",
                bgcolor: "warning.50",
                border: 1,
                borderColor: "warning.200",
              }}
            >
              <Typography variant="h4" color="warning.main" fontWeight="bold">
                {stats.mixto}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Circunscripciones Mixtas
              </Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 6, lg: 3 }}>
            <Paper
              sx={{
                p: 2,
                textAlign: "center",
                bgcolor: "info.50",
                border: 1,
                borderColor: "info.200",
              }}
            >
              <Typography variant="h4" color="info.main" fontWeight="bold">
                {stats.uninominal}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Circunscripciones Uninominales
              </Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 6, lg: 3 }}>
            <Paper
              sx={{
                p: 2,
                textAlign: "center",
                bgcolor: "secondary.50",
                border: 1,
                borderColor: "secondary.200",
              }}
            >
              <Typography variant="h4" color="secondary.main" fontWeight="bold">
                {stats.especial}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Circunscripciones Especiales
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Mapa */}
        <Paper sx={{ mb: 3, elevation: 2, overflow: "hidden" }}>
          <Box
            sx={{
              height: "500px",
              width: "100%",
              position: "relative",
              bgcolor: "#f5f5f5",
            }}
          >
            {error ? (
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
                <MapComponent center={mapCenter} zoom={ZOOM_DEPARTMENT}>
                  <SeatMarkers seats={filteredSeats} />
                </MapComponent>
              </Box>
            )}
          </Box>
        </Paper>

        {/* Filtros */}
        <Paper sx={{ p: 3, mb: 3, elevation: 2 }}>
          <Typography variant="h6" fontWeight="medium" gutterBottom>
            Filtros
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Box sx={{ minWidth: "100%" }}>
                <InputLabel>Provincia</InputLabel>
                <Select
                  value={filters.provincia}
                  onChange={(e: any) => handleProvinciaChange(e.target.value)}
                  fullWidth
                >
                  <MenuItem value="">
                    <em>Todas</em>
                  </MenuItem>
                  {provincias.map((provincia: string) => (
                    <MenuItem key={provincia} value={provincia}>
                      {provincia}
                    </MenuItem>
                  ))}
                </Select>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Box sx={{ minWidth: "100%" }}>
                <InputLabel>Municipio</InputLabel>
                <Select
                  value={filters.municipio}
                  onChange={(e: any) => handleMunicipioChange(e.target.value)}
                  fullWidth
                  disabled={!filters.provincia}
                >
                  <MenuItem value="">
                    <em>Todos</em>
                  </MenuItem>
                  {municipios.map((municipio: string) => (
                    <MenuItem key={municipio} value={municipio}>
                      {municipio}
                    </MenuItem>
                  ))}
                </Select>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Box sx={{ minWidth: "100%" }}>
                <InputLabel>Urbano/Rural</InputLabel>
                <Select
                  value={filters.tipoUrbanoRural}
                  onChange={(e: any) =>
                    setFilters((prev: any) => ({
                      ...prev,
                      tipoUrbanoRural: e.target.value,
                    }))
                  }
                  fullWidth
                >
                  <MenuItem value="">
                    <em>Todos</em>
                  </MenuItem>
                  <MenuItem value="Urbano">Urbano</MenuItem>
                  <MenuItem value="Rural">Rural</MenuItem>
                </Select>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3 }}>
              <Box sx={{ minWidth: "100%" }}>
                <InputLabel>Circunscripción</InputLabel>
                <Select
                  value={filters.tipoCircunscripcion}
                  onChange={(e: any) =>
                    handleTipoCircunscripcionChange(e.target.value)
                  }
                  fullWidth
                  disabled={!!filters.provincia}
                  error={!!filters.provincia && !filters.municipio}
                >
                  <MenuItem value="">
                    <em>Todos</em>
                  </MenuItem>
                  <MenuItem value="Mixto">Mixto</MenuItem>
                  <MenuItem value="Uninominal">Uninominal</MenuItem>
                  <MenuItem value="Especial">Especial</MenuItem>
                </Select>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3 }}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Clear />}
                onClick={handleClearFilters}
                sx={{ height: "56px" }}
              >
                Limpiar
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Tabla de Datos */}
        {filteredSeats.length > 0 && (
          <Paper sx={{ mb: 3, elevation: 2 }}>
            <Box sx={{ p: 3 }}>
              <Typography
                variant="h6"
                fontWeight="medium"
                gutterBottom
                display="flex"
                alignItems="center"
                gap={1}
              >
                Lista de Asientos
                <Chip
                  label={filteredSeats.length}
                  size="small"
                  color="primary"
                  sx={{ ml: "auto" }}
                />
              </Typography>
            </Box>
            <Divider />
            <Box sx={{ overflowX: "auto" }}>
              <Box sx={{ minWidth: "800px" }}>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(6, 1fr)",
                    borderBottom: 2,
                    borderColor: "grey.300",
                    "& > *": {
                      px: 2,
                      py: 1.5,
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      color: "text.secondary",
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
                    },
                  }}
                >
                  <Box>Municipio</Box>
                  <Box>Asiento Electoral</Box>
                  <Box sx={{ textAlign: "right" }}>Tipo</Box>
                  <Box sx={{ textAlign: "right" }}>Circunscripción</Box>
                  <Box sx={{ textAlign: "right" }}>Estado</Box>
                  <Box sx={{ textAlign: "right" }}>Coordenadas</Box>
                </Box>
                <Box>
                  {tableData.map((row: any) => (
                    <Box
                      key={row.id}
                      sx={{
                        display: "grid",
                        gridTemplateColumns: "repeat(6, 1fr)",
                        borderBottom: 1,
                        borderColor: "grey.200",
                        "&:nth-of-type(odd)": { bgcolor: "grey.50" },
                        "&:hover": { bgcolor: "action.hover" },
                        transition: "background-color 0.2s",
                        "& > *": {
                          px: 2,
                          py: 1,
                          fontSize: "0.8rem",
                        },
                      }}
                    >
                      <Box>
                        <Box>
                          <Typography variant="body2" fontWeight="medium">
                            {row.municipio}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ fontSize: "0.7rem" }}
                          >
                            {row.departamento} • {row.provincia}
                          </Typography>
                        </Box>
                      </Box>
                      <Box>
                        <Typography
                          variant="body2"
                          fontWeight="bold"
                          color="primary.main"
                          sx={{ fontSize: "0.8rem" }}
                        >
                          {row.asiento}
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                        <Chip
                          label={row.ubi_rur}
                          size="small"
                          color={row.ubi_rur === "Urbano" ? "info" : "warning"}
                          variant="outlined"
                        />
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "flex-end",
                          color: "text.primary",
                        }}
                      >
                        <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>
                          {row.circ}
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                        {row.estado === "Habilitado TSE" ? (
                          <Chip
                            label={row.estado}
                            size="small"
                            color="success"
                          />
                        ) : (
                          <Chip label={row.estado} size="small" color="error" />
                        )}
                      </Box>
                      <Box>
                        <Typography
                          variant="caption"
                          sx={{ fontFamily: "monospace", fontSize: "11px" }}
                        >
                          {row.lat}, {row.lng}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
          </Paper>
        )}

        {/* Instrucciones */}
        <Paper sx={{ p: 3, elevation: 1, sx: { bgcolor: "info.50" } }}>
          <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
            💡 Instrucciones:
          </Typography>
          <Stack spacing={1}>
            <Typography variant="body2" color="text.secondary">
              • Usa los filtros para filtrar asientos por provincia, municipio o
              tipo
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • El mapa se actualiza automáticamente con los filtros aplicados
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • Haz clic en cualquier punto del mapa para ver información
              detallada
            </Typography>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};

export default VistaDepartamento;
