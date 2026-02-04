// Tipos para configuración de Leaflet
import "leaflet/dist/leaflet.css";

export const DEFAULT_LATITUDE = -16.2902;
export const DEFAULT_LONGITUDE = -63.5887;

export const ZOOM_COUNTRY = 5;
export const ZOOM_DEPARTMENT = 8;
export const ZOOM_PROVINCE = 11;

export const DEPARTAMENTO_COORDINATES: {
  [key: string]: { lat: number; lng: number };
} = {
  "La Paz": { lat: -16.485, lng: -68.149 },
  Cochabamba: { lat: -17.388, lng: -66.168 },
  Oruro: { lat: -19.157, lng: -67.115 },
  Potosí: { lat: -19.597, lng: -65.145 },
  Chuquisaca: { lat: -19.544, lng: -65.262 },
  Tarija: { lat: -21.536, lng: -64.876 },
  "Santa Cruz": { lat: -18.434, lng: -63.587 },
  Beni: { lat: -14.833, lng: -65.423 },
  Pando: { lat: -13.617, lng: -68.265 },
};
