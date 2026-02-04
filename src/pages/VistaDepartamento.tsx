import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useElectoralStore } from '../store/useElectoralStore';
import { electoralDataService } from '../services/electoralData.service';

const VistaDepartamento = () => {
  const navigate = useNavigate();
  const params = useParams();
  const departamento = params.departamento?.toUpperCase();

  const { setCurrentView, setFilters } = useElectoralStore();
  const [seats, setSeats] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [provincias, setProvincias] = useState<string[]>([]);
  const [departamentoStats, setDepartamentoStats] = useState<any>(null);

  useEffect(() => {
    if (departamento) {
      setFilters({ departamento, provincia: '', tipoCircunscripcion: '', tipoUrbanoRural: '' });

      electoralDataService
        .loadSeats()
        .then(() => {
          const provinciaData = electoralDataService.getSeatsByDepartment(departamento);
          setSeats(provinciaData);

          // Obtener provincias únicas
          const provinciaSet = new Set(provinciaData.map((s: any) => s.Provincia));
          setProvincias(Array.from(provinciaSet) as string[]);

          // Obtener estadísticas del departamento
          const stats = electoralDataService.getDepartamentoStats();
          const deptStats = stats.find((d: any) => d.name.toUpperCase() === departamento);
          setDepartamentoStats(deptStats);
        })
        .finally(() => {
          setIsLoading(false);
        });

      setCurrentView({
        level: 'department',
        data: { Departamento: departamento }
      });
    }
  }, [departamento]);

  const handleProvinciaClick = (provincia: string) => {
    setCurrentView({
      level: 'province',
      data: { Departamento: departamento, Provincia: provincia }
    });
    navigate(`/vista_provincia/${encodeURIComponent(provincia)}`, {
      state: { level: 'province', data: { Departamento: departamento, Provincia: provincia } }
    });
  };

  const departamentoCode = departamento ? electoralDataService.getDepartamentoCode(departamento) : '';

  const goBack = () => {
    navigate('/vista_nacional');
  };

  if (isLoading && !seats.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent inline-block mb-4"></div>
          <p className="text-gray-600">Cargando datos del departamento...</p>
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
          <h1 className="text-4xl font-bold text-gray-800">
            {departamento} - {departamentoCode}
          </h1>
        </div>

        {/* Información del departamento */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-blue-600">
                {departamentoStats?.count || seats.length}
              </div>
              <div className="text-sm text-gray-600 mt-1">Asientos Electorales</div>
            </div>

            <div className="bg-green-50 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-green-600">
                {provincias.length}
              </div>
              <div className="text-sm text-gray-600 mt-1">Provincias</div>
            </div>

            <div className="bg-purple-50 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-purple-600">
                {departamentoCode}
              </div>
              <div className="text-sm text-gray-600 mt-1">Código Departamental</div>
            </div>
          </div>
        </div>

        {/* Tarjetas de provincias */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Provincias en {departamento}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {provincias.slice(0, 12).map((provincia) => (
              <button
                key={provincia}
                onClick={() => handleProvinciaClick(provincia)}
                className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-xl p-6 hover:from-blue-600 hover:to-cyan-600 transform hover:scale-105 transition-all duration-300 shadow-lg text-left"
              >
                <div className="text-2xl font-bold mb-1">{provincia}</div>
                <div className="text-sm text-blue-100">
                  Ver detalles
                </div>
              </button>
            ))}

            {provincias.length > 12 && (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500">Y {provincias.length - 12} más...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VistaDepartamento;