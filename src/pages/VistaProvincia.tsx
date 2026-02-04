import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useElectoralStore } from '../store/useElectoralStore';
import { electoralDataService } from '../services/electoralData.service';

const VistaProvincia = () => {
  const navigate = useNavigate();
  const params = useParams();
  const departamento = params.departamento?.toUpperCase() || '';
  const provincia = decodeURIComponent(params.provincia || '').toUpperCase();

  const { setCurrentView, setFilters } = useElectoralStore();
  const [seats, setSeats] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (departamento && provincia) {
      setFilters({
        departamento,
        provincia,
        tipoCircunscripcion: '',
        tipoUrbanoRural: ''
      });

      electoralDataService
        .loadSeats()
        .then(() => {
          const provinciaSeats = electoralDataService.getSeatsByProvince(departamento, provincia);
          setSeats(provinciaSeats);
        })
        .finally(() => {
          setIsLoading(false);
        });

      setCurrentView({
        level: 'province',
        data: { Departamento: departamento, Provincia: provincia }
      });
    }
  }, [departamento, provincia]);

  const handleDepartamentoClick = () => {
    navigate(`/vista_departamento/${encodeURIComponent(departamento)}`);
  };

  const goBack = () => {
    navigate(`/vista_departamento/${encodeURIComponent(departamento)}`);
  };

  if (isLoading && !seats.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent inline-block mb-4"></div>
          <p className="text-gray-600">Cargando datos de la provincia...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={goBack}
            className="bg-white rounded-full p-3 shadow-lg hover:bg-gray-50 transition-colors"
            aria-label="Volver"
          >
            <svg
              className="w-6 h-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <div>
            <div className="text-sm text-gray-500 mb-1">Departamento</div>
            <button
              onClick={handleDepartamentoClick}
              className="text-xl font-semibold text-blue-600 hover:text-blue-800 transition-colors"
            >
              {departamento}
            </button>
          </div>
          <div className="text-2xl text-gray-300">/</div>
          <h1 className="text-2xl font-bold text-gray-800">{provincia}</h1>
        </div>

        {/* Información de la provincia */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-blue-600">{seats.length}</div>
              <div className="text-sm text-gray-600 mt-1">Asientos Electorales</div>
            </div>

            <div className="bg-green-50 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-green-600">
                {seats.filter(s => s.Tipo_Urbano_Rural === 'Urbano').length}
              </div>
              <div className="text-sm text-gray-600 mt-1">Asientos en Zona Urbana</div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-gray-600">
                {seats.filter(s => s.Tipo_Urbano_Rural === 'Rural').length}
              </div>
              <div className="text-sm text-gray-600 mt-1">Asientos en Zona Rural</div>
            </div>

            <div className="bg-purple-50 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-purple-600">
                {seats.length > 0 ? ((seats.filter(s => s.Tipo_Circunscripcion === 'Uninominal').length / seats.length) * 100).toFixed(1) : 0}%
              </div>
              <div className="text-sm text-gray-600 mt-1">Uninominales</div>
            </div>
          </div>
        </div>

        {/* Resumen del municipio */}
        {seats.length > 0 && seats.length <= 5 ? (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Detalle por Municipio
            </h2>

            <div className="space-y-4">
              {seats.map((seat) => (
                <div
                  key={`${seat.Asiento_Electoral}-${seat.FID}`}
                  className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {seat.Asiento_Electoral}
                      </h3>
                      <p className="text-sm text-gray-500">{seat.Municipio}, {departamento}</p>
                    </div>
                    <span
                      className={`text-xs font-medium px-3 py-1 rounded-full ${
                        seat.Tipo_Urbano_Rural === 'Urbano'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {seat.Tipo_Urbano_Rural}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                    <div>
                      <span className="text-gray-500">Circunscripción:</span>
                      <p className="font-medium">{seat.Tipo_Circunscripcion}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Latitud:</span>
                      <p className="font-medium">{seat.Latitud.toFixed(6)}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Longitud:</span>
                      <p className="font-medium">{seat.Longitud.toFixed(6)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🗺️</div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                Vista en Mapa
              </h2>
              <p className="text-gray-600 mb-6">
                Ver los asientos electorales en el mapa interactivo
              </p>
              <button
                onClick={() => {
                  setFilters({ departamento, provincia, tipoCircunscripcion: '', tipoUrbanoRural: '' });
                  navigate('/vista_principal');
                }}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-600 transform hover:scale-105 transition-all shadow-lg"
              >
                Ver en Mapa
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VistaProvincia;