// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

## 🗺️ Características

### Vista Nacional
- **Mapa interactivo** con todos los asientos electorales urbanos de Bolivia
- **Filtrado automático** de ubicaciones urbanas para mejor visualización
- **Interactividad avanzada:**
  - **Hover (pasar el mouse):** Muestra información rápida del asiento electoral
  - **Click:** Abre un popup detallado con toda la información del asiento
  - **Zoom y navegación:** Explora el mapa con controles intuitivos
- **Estadísticas en tiempo real** de asientos urbanos, activos y uninominales
- **Navegación por departamentos** con tarjetas interactivas
- **Diseño responsivo** adaptado a diferentes tamaños de pantalla

