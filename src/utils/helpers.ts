import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combina clases de Tailwind CSS y Lógica clsx
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formatea números como porcentajes
 */
export function formatPercentage(value: number): string {
  return `${Math.round(value)}%`;
}

/**
 * Trunca texto si excede cierto largo
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}

/**
 * Obtiene coordenadas centroides de una provincia (aproximadas)
 */
export function getApproximateProvinceCenter(
  departamento: string,
): [number, number] {
  // Coordenadas aproximadas como referencia
  // En producción, estas deberán calcularse dinámicamente
  const departmentCoords: Record<string, [number, number]> = {
    "La Paz": [-16.5, -68.1],
    Cochabamba: [-17.4, -66.1],
    Oruro: [-19.2, -67.0],
    Potosí: [-19.6, -65.1],
    Chuquisaca: [-19.6, -65.2],
    Tarija: [-21.5, -64.8],
    "Santa Cruz": [-18.5, -63.1],
    Beni: [-14.8, -65.4],
    Pando: [-13.6, -68.2],
  };

  const coords = departmentCoords[departamento] || [-16.2902, -63.5887];
  return coords;
}

/**
 * Genera una URL para Google Maps
 */
export function generateMapsLink(
  lat: number,
  lng: number,
  name?: string,
): string {
  const params = name ? `&q=${encodeURIComponent(name)}` : "";
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}${params}`;
}
