import React from 'react';

interface BackNavigationProps {
  currentLevel: 'country' | 'department' | 'province' | 'seat';
  onBack: () => void;
}

export const BackNavigation: React.FC<BackNavigationProps> = ({
  currentLevel,
  onBack
}) => {
  const getButtonText = () => {
    switch (currentLevel) {
      case 'department':
        return '⬅️ Volver a Departamentos';
      case 'province':
        return '⬅️ Ver Departamentos';
      case 'seat':
        return '⬅️ Volver';
      default:
        return '⬅️ Volver';
    }
  };

  return (
    <button
      onClick={onBack}
      className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-white text-gray-800 px-6 py-3 rounded-full shadow-lg hover:bg-gray-50 transition-all flex items-center gap-2 font-medium z-40"
    >
      {getButtonText()}
    </button>
  );
};

export default BackNavigation;