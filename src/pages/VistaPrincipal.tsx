import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useElectoralStore } from '../store/useElectoralStore';
import { MapComponent } from '../components/MapComponent';
import { SeatMarkers } from '../components/SeatMarkers';
import { SeatDetailModal } from '../components/SeatDetailModal';
import { ProgressBar } from '../components/ProgressBar';
import { electoralDataService } from '../services/electoralData.service';

const VistaPrincipal = () => {
  const location = useLocation();
  const { currentView, setCurrentView, filters, setFilters } = useElectoralStore();

  const [seats, setSeats] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSeat, setSelectedSeat] = useState<any>(null);

  useEffect(() => {
    // Determinar la vista actual desde el estado del store
    if (location.state?.level) {
      setCurrentView(location.state);
    }
  }, [location.state, setCurrentView]);

  useEffect(() => {
    loadSeats();
  }, []);

  const loadSeats = async () => {
    try {
      setIsLoading(true);
      await electoralDataService.loadSeats();

      // Filtrar según la vista actual
      if (currentView.level === 'country') {
        setSeats(electoralDataService.getSeats());
      } else if (currentView.level === 'department') {
        setSeats(electoralDataService.getSeatsByDepartment(currentView.data.Departamento!));
      } else if (currentView.level === 'province') {
        setSeats(
          electoralDataService.getSeatsByProvince(
            currentView.data.Departamento!,
            currentView.data.Provincia!
          )
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar los datos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters({ [field]: value });
  };

  const handleCloseModal = () => {
    setSelectedSeat(null);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-4 shadow-lg">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">🗺️ Mapa Electoral - Bolivia 2026</h1>
          <p className="text-blue-100 text-sm">
            Visualización de asientos electorales por departamento, provincia y municipio
          </p>
        </div>
      </header>

      {/* Contenido principal */}
      <div className="flex-1 flex overflow-hidden">
        {/* Panel lateral */}
        <aside className="w-80 bg-white shadow-lg overflow-y-auto p-6 border-r">
          <div className="space-y-6">
            {/* Información de la vista */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                {currentView.level === 'country' && 'Vista Nacional'}
                {currentView.level === 'department' && 'Vista Departamental'}
                {currentView.level === 'province' && 'Vista Provincial'}
              </h2>

              <div className="bg-blue-50 rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-600">
                  Mostrando {seats.length} asientos electorales
                </p>
              </div>
            </div>

            {/* Filtros */}
            <div>
              <h3 className="text-md font-semibold text-gray-700 mb-3">
                📋 Filtros
              </h3>

              {currentView.level === 'department' && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Departamento
                  </label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={filters.departamento || ''}
                    onChange={(e) => handleFilterChange('departamento', e.target.value)}
                  >
                    <option value="">Todos</option>
                    <option value="La Paz">La Paz</option>
                    <option value="Cochabamba">Cochabamba</option>
                    <option value="Oruro">Oruro</option>
                    <option value="Potosí">Potosí</option>
                    <option value="Chuquisaca">Chuquisaca</option>
                    <option value="Tarija">Tarija</option>
                    <option value="Santa Cruz">Santa Cruz</option>
                    <option value="Beni">Beni</option>
                    <option value="Pando">Pando</option>
                  </select>
                </div>
              )}

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Tipo de Circunscripción
                </label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={filters.tipoCircunscripcion || ''}
                  onChange={(e) => handleFilterChange('tipoCircunscripcion', e.target.value)}
                >
                  <option value="">Todos</option>
                  <option value="Uninominal">Uninominal</option>
                  <option value="Binominal">Binominal</option>
                  <option value="Plurinominal">Plurinominal</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Urbano / Rural
                </label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={filters.tipoUrbanoRural || ''}
                  onChange={(e) => handleFilterChange('tipoUrbanoRural', e.target.value)}
                >
                  <option value="">Todos</option>
                  <option value="Urbano">Urbano</option>
                  <option value="Rural">Rural</option>
                </select>
              </div>
            </div>

            {/* Estadísticas */}
            <div>
              <h3 className="text-md font-semibold text-gray-700 mb-3">
                📊 Estadísticas
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Porcentaje Urbano
                  </label>
                  <div className="bg-cyan-50 rounded-lg p-3 border border-cyan-200">
                    <ProgressBar value={14} max={100} label="Urbano" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Porcentaje Rural
                  </label>
                  <div className="bg-gray-100 rounded-lg p-3 border border-gray-200">
                    <ProgressBar value={86} max={100} label="Rural" />
                  </div>
                </div>
              </div>
            </div>

            {/* Leyenda */}
            <div>
              <h3 className="text-md font-semibold text-gray-700 mb-3">
                🎨 Leyenda
              </h3>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow"></div>
                  <span className="text-sm text-gray-600">Asiento Electrónico Urbano</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-gray-500 border-2 border-white shadow"></div>
                  <span className="text-sm text-gray-600">Asiento Electrónico Rural</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Mapa */}
        <main className="flex-1 relative">
          <MapComponent center={[-16.2902, -63.5887]} zoom={6}>
            <SeatMarkers seats={seats} />
          </MapComponent>

          {/* Indicador de carga */}
          {isLoading && (
            <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-4">
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span className="text-sm font-medium">Cargando...</span>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="absolute top-4 right-4 bg-red-500 rounded-lg shadow-lg p-4 text-white">
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}
        </main>
      </div>

      {/* Modal de detalle */}
      <SeatDetailModal
        seat={selectedSeat}
        isOpen={!!selectedSeat}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default VistaPrincipal;