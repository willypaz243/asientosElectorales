const LoadingScreen = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-8 border-blue-500 border-t-transparent inline-block mb-6"></div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Cargando Mapa Electoral</h2>
        <p className="text-gray-600 mb-4">Recopilando datos de los asientos electorales...</p>
        <div className="w-64 bg-gray-200 rounded-full h-2 mx-auto">
          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full animate-progress"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;