import React from "react";
import { Marker as LeafletMarker, Tooltip, Popup } from "react-leaflet";
import L from "leaflet";
import { Box, Typography, Divider, Stack, Chip } from "@mui/material";
import {
  LocationCity,
  Place,
  Map,
  Info,
  CheckCircle,
  Cancel,
} from "@mui/icons-material";

// Iconos personalizados según el tipo
const getIcon = (tipoUrbanoRural: string) => {
  const size = 24;
  const color = tipoUrbanoRural === "Urbano" ? "#3b82f6" : "#64748b";

  const icon = L.divIcon({
    className: "custom-marker",
    html: `<div style="
      width: ${size}px;
      height: ${size}px;
      background-color: ${color};
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.4);
      transition: all 0.2s ease;
    "></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size - 20],
  });

  return icon;
};

interface SeatMarkersProps {
  seats: any[];
}

export const SeatMarkers: React.FC<SeatMarkersProps> = ({ seats }) => {
  if (!seats || seats.length === 0) {
    return null;
  }

  return (
    <>
      {seats.map((seat) => {
        const [lat, lng] = [
          seat.geometry?.coordinates?.[1] || seat.Latitud,
          seat.geometry?.coordinates?.[0] || seat.Longitud,
        ];

        return (
          <LeafletMarker
            key={
              seat.FID ||
              `${seat.Asiento_Electoral}-${seat.Departamento}-${seat.Provincia}-${seat.Municipio}`
            }
            position={[lat, lng]}
            icon={getIcon(seat.Tipo_Urbano_Rural)}
          >
            {/* Tooltip al hacer hover - muestra información rápida */}
            <Tooltip
              direction="top"
              offset={[0, -35]}
              opacity={1}
              permanent={false}
            >
              <Box
                sx={{
                  p: 1.5,
                  minWidth: 200,
                  bgcolor: "white",
                  borderRadius: 1,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                }}
              >
                <Typography
                  variant="subtitle2"
                  fontWeight="bold"
                  color="primary"
                  sx={{ fontSize: "0.9rem" }}
                >
                  {seat.Asiento_Electoral}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    fontSize: "0.75rem",
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    mt: 0.5,
                  }}
                >
                  <LocationCity sx={{ fontSize: 12 }} />
                  {seat.Departamento} • {seat.Provincia}
                </Typography>
              </Box>
            </Tooltip>

            {/* Popup al hacer clic - muestra información detallada */}
            <Popup autoPan={true}>
              <Box sx={{ minWidth: 280, maxWidth: 380 }}>
                {/* Header con título */}
                <Box
                  sx={{
                    bgcolor: "primary.main",
                    color: "white",
                    px: 2,
                    py: 1.5,
                    borderRadius: "8px 8px 0 0",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Place sx={{ fontSize: 20 }} />
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    sx={{ fontSize: "1rem" }}
                  >
                    {seat.Asiento_Electoral}
                  </Typography>
                </Box>

                {/* Contenido principal */}
                <Box sx={{ p: 2, bgcolor: "white" }}>
                  {/* Ubicación */}
                  <Stack spacing={1.5}>
                    <Box>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                          fontWeight: 600,
                          textTransform: "uppercase",
                          fontSize: "0.7rem",
                          letterSpacing: 0.5,
                        }}
                      >
                        <LocationCity sx={{ fontSize: 14 }} />
                        Ubicación
                      </Typography>
                      <Box sx={{ mt: 0.5, pl: 2 }}>
                        <Typography
                          variant="body2"
                          color="text.primary"
                          fontWeight="medium"
                        >
                          {seat.Departamento}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ fontSize: "0.85rem" }}
                        >
                          {seat.Provincia}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ fontSize: "0.85rem" }}
                        >
                          {seat.Municipio}
                        </Typography>
                      </Box>
                    </Box>

                    <Divider sx={{ my: 0.5 }} />

                    {/* Información electoral */}
                    <Box>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                          fontWeight: 600,
                          textTransform: "uppercase",
                          fontSize: "0.7rem",
                          letterSpacing: 0.5,
                        }}
                      >
                        <Info sx={{ fontSize: 14 }} />
                        Información Electoral
                      </Typography>
                      <Box sx={{ mt: 0.5, pl: 2 }}>
                        <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
                          <Chip
                            label={seat.Tipo_Urbano_Rural}
                            size="small"
                            sx={{
                              bgcolor:
                                seat.Tipo_Urbano_Rural === "Urbano"
                                  ? "primary.50"
                                  : "grey.100",
                              color:
                                seat.Tipo_Urbano_Rural === "Urbano"
                                  ? "primary.dark"
                                  : "text.secondary",
                              fontWeight: 600,
                              fontSize: "0.75rem",
                              height: 24,
                            }}
                          />
                          <Chip
                            label={seat.Tipo_Circunscripcion}
                            size="small"
                            sx={{
                              bgcolor: "secondary.50",
                              color: "secondary.dark",
                              fontWeight: 600,
                              fontSize: "0.75rem",
                              height: 24,
                            }}
                          />
                        </Stack>
                        <Box
                          sx={{
                            mt: 1,
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          {seat.Estado === "Habilitado TSE" ? (
                            <CheckCircle
                              sx={{ fontSize: 16, color: "success.main" }}
                            />
                          ) : (
                            <Cancel
                              sx={{ fontSize: 16, color: "error.main" }}
                            />
                          )}
                          <Typography
                            variant="body2"
                            color={
                              seat.Estado === "Habilitado TSE"
                                ? "success.main"
                                : "error.main"
                            }
                            fontWeight="medium"
                            sx={{ fontSize: "0.85rem" }}
                          >
                            {seat.Estado}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    <Divider sx={{ my: 0.5 }} />

                    {/* Coordenadas */}
                    <Box>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                          fontWeight: 600,
                          textTransform: "uppercase",
                          fontSize: "0.7rem",
                          letterSpacing: 0.5,
                        }}
                      >
                        <Map sx={{ fontSize: 14 }} />
                        Coordenadas
                      </Typography>
                      <Box sx={{ mt: 0.5, pl: 2 }}>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{
                            fontFamily: "monospace",
                            fontSize: "0.75rem",
                            bgcolor: "grey.50",
                            px: 1,
                            py: 0.5,
                            borderRadius: 0.5,
                            display: "inline-block",
                          }}
                        >
                          {seat.Latitud?.toFixed(6)},{" "}
                          {seat.Longitud?.toFixed(6)}
                        </Typography>
                      </Box>
                    </Box>
                  </Stack>
                </Box>
              </Box>
            </Popup>
          </LeafletMarker>
        );
      })}
    </>
  );
};

export default SeatMarkers;
