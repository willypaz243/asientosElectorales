import { Navigate, Route, Routes } from "react-router-dom";
import VistaDepartamento from "./pages/VistaDepartamento";
import VistaNacional from "./pages/VistaNacional";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/vista_nacional" replace />} />
      <Route path="vista_nacional" element={<VistaNacional />} />
      <Route path="vista_departamento">
        <Route path=":departamento" element={<VistaDepartamento />} />
      </Route>
    </Routes>
  );
}

export default App;
