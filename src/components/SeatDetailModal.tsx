import React from 'react';
import { X } from 'lucide-react';

interface SeatDetailModalProps {
  seat: any;
  isOpen: boolean;
  onClose: () => void;
}

export const SeatDetailModal: React.FC<SeatDetailModalProps> = ({
  seat,
  isOpen,
  onClose
}) => {
  if (!isOpen || !seat) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-2xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">
            Detalle del Asiento Electoral
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6 p-4 rounded-lg bg-blue-50 border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-800 mb-3">
              {seat.Asiento_Electoral}
            </h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-500">Departamento:</span>
                <p className="font-medium">{seat.Departamento}</p>
              </div>
              <div>
                <span className="text-gray-500">Provincia:</span>
                <p className="font-medium">{seat.Provincia}</p>
              </div>
              <div>
                <span className="text-gray-500">Municipio:</span>
                <p className="font-medium">{seat.Municipio}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">
                Datos de Circunscripción
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-500 text-sm">Tipo:</span>
                  <p className="font-medium">{seat.Tipo_Circunscripcion}</p>
                </div>
                <div>
                  <span className="text-gray-500 text-sm">Id Localidad:</span>
                  <p className="font-medium">{seat.Id_Localidad}</p>
                </div>
                <div>
                  <span className="text-gray-500 text-sm">Tipo Urbano/Rural:</span>
                  <p className="font-medium">{seat.Tipo_Urbano_Rural}</p>
                </div>
                <div>
                  <span className="text-gray-500 text-sm">FID:</span>
                  <p className="font-medium">{seat.FID}</p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-gray-100">
              <h4 className="font-semibold text-gray-700 mb-2">
                Coordenadas GPS
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-500 text-sm">Latitud:</span>
                  <p className="font-medium">
                    {seat.Latitud.toFixed(6)}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500 text-sm">Longitud:</span>
                  <p className="font-medium">
                    {seat.Longitud.toFixed(6)}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <span className="text-gray-500 text-sm">Estado:</span>
              <p className="font-medium">{seat.Estado}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatDetailModal;