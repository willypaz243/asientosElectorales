import { Routes, Route, Navigate } from 'react-router-dom';
import VistaPrincipal from './pages/VistaPrincipal';
import VistaNacional from './pages/VistaNacional';
import VistaNacionalSimple from './pages/VistaNacionalSimple';
import VistaDepartamento from './pages/VistaDepartamento';
import VistaProvincia from './pages/VistaProvincia';
import TestMap from './pages/TestMap';
import SimpleTest from './pages/SimpleTest';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/vista_nacional" replace />} />
      <Route path="vista_nacional" element={<VistaNacional />} />
      <Route path="vista_nacional_simple" element={<VistaNacionalSimple />} />
      <Route path="test_map" element={<TestMap />} />
      <Route path="simple_test" element={<SimpleTest />} />
      <Route path="vista_departamento">
        <Route path=":departamento" element={<VistaDepartamento />} />
      </Route>
      <Route path="vista_provincia">
        <Route path=":departamento/:provincia" element={<VistaProvincia />} />
      </Route>
      <Route path="vista_principal" element={<VistaPrincipal />} />
    </Routes>
  );
}

export default App;
