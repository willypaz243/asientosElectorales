import React from 'react';

interface DepartmentStatsProps {
  departamento: string;
  asientos: number;
  departamentos: any[];
}

export const DepartmentStats: React.FC<DepartmentStatsProps> = ({
  departamento,
  asientos,
  departamentos
}) => {
  const departamentoCode = departamento.toUpperCase();
  const totalAsientos = departamentos.reduce((sum, d) => sum + d.count, 0);
  const percentage = ((asientos / totalAsientos) * 100).toFixed(1);

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        📊 Estadísticas - {departamentoCode}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 rounded-xl p-6 text-center">
          <div className="text-3xl font-bold text-blue-600">{asientos}</div>
          <div className="text-sm text-gray-600 mt-2">Asientos Electorales</div>
          <div className="text-xs text-gray-500 mt-1">{percentage}% del total nacional</div>
        </div>

        <div className="bg-green-50 rounded-xl p-6 text-center">
          <div className="text-3xl font-bold text-green-600">
            {asientos * 0.14}
          </div>
          <div className="text-sm text-gray-600 mt-2">Estimado Urbano</div>
          <div className="text-xs text-gray-500 mt-1">~14%</div>
        </div>

        <div className="bg-purple-50 rounded-xl p-6 text-center">
          <div className="text-3xl font-bold text-purple-600">
            {asientos * 0.86}
          </div>
          <div className="text-sm text-gray-600 mt-2">Estimado Rural</div>
          <div className="text-xs text-gray-500 mt-1">~86%</div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentStats;