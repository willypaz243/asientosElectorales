import { useEffect } from 'react';
import { MapContainer, TileLayer, useMap, ZoomControl } from 'react-leaflet';
import L from 'leaflet';

// Importar estilos de Leaflet explícitamente
import 'leaflet/dist/leaflet.css';

// Fix de iconos de Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
});

// Componente interno para actualizar el mapa
function MapUpdater({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);

  return null;
}

interface MapComponentProps {
  center?: [number, number];
  zoom?: number;
  children: React.ReactNode;
  className?: string;
}

export const MapComponent: React.FC<MapComponentProps> = ({
  center = [-16.2902, -63.5887],
  zoom = 6,
  children,
  className = ''
}) => {
  return (
    <div className={`map-container ${className}`} style={{ height: '100%', width: '100%', position: 'relative', background: '#f5f5f5' }}>
      <MapContainer
        center={center}
        zoom={zoom}
        zoomControl={false}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%', position: 'absolute', top: 0, left: 0, zIndex: 1 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          maxZoom={19}
        />

      {children}

        <MapUpdater center={center} zoom={zoom} />
        <ZoomControl position="bottomright" />
      </MapContainer>
    </div>
  );
};

export default MapComponent;