# CONTINUE.md - Asientos Electorales Bolivia 2026 Project Guide

## Project Overview

This project is a web application that provides an interactive visualization of electoral seats across Bolivia. Users can explore electoral seats by region using interactive maps with detailed information about each seat including location, electoral type, status, and geographic coordinates.

**Key Technologies:**
- **Framework:** React 19.2.0 with TypeScript
- **Build Tool:** Vite 7.2.4
- **UI Library:** Material UI (MUI) v7.3.7
- **Map Technology:** Leaflet 1.9.4 with react-leaflet 5.0.0
- **State Management:** Zustand 5.0.11
- **Routing:** React Router DOM v7.13.0
- **Styling:** Custom CSS + Tailwind CSS utilities
- **Linting:** ESLint with TypeScript ESLint

**High-Level Architecture:**
- Two main views: National overview (`/vista_nacional`) and Departmental view (`/vista_departamento/:departamento`)
- Modular component structure with reusable UI components
- Data-driven approach using a centralized service layer
- State management with Zustand for global application state

## Getting Started

### Prerequisites

- Node.js v18+ LTS (recommended) or v20+ for better compatibility
- npm, yarn, or pnpm (npm is used in this project)
- Git for version control
- Modern web browser (Chrome, Firefox, Edge, or Safari)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/willypaz243/asientosElectorales.git
   cd asientosElectorales
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create the public/data directory if it doesn't exist:**
   ```bash
   mkdir -p public/data
   ```

4. **Place your electoral data file:**
   - Copy your `asientos_electorales_gps.json` file to `public/data/asientos_electorales_gps.json`
   - Ensure the file contains electoral seat data in the expected format

### Development Server

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Building for Production

Build the application for production:
```bash
npm run build
```

The optimized build will be in the `dist/` directory.

### Preview Production Build

Preview the production build locally:
```bash
npm run preview
```

### Running Tests

This project currently does not include test configuration. To add tests:
- Install testing framework (e.g., Jest, React Testing Library)
- Create test configuration in `vite.config.ts` or `vitest.config.ts`
- Write tests in `__tests__/` directory or alongside your components

### Basic Usage

**Navigation:**
- **National View:** Accessible at `/vista_nacional` (also redirects from `/`)
  - Displays map of all Bolivia with electoral seats
  - Interactive filtering by department
  - Overview statistics
  
- **Departmental View:** Accessible at `/vista_departamento/:departamento`
  - Displays map focused on selected department
  - Advanced filtering by province, municipality, and electoral type
  - Detailed seat lists with coordinates and status

**Map Interactions:**
- **Hover:** Shows quick information tooltip
- **Click:** Opens detailed popup with comprehensive seat information
- **Scroll/Controls:** Zoom in/out and pan around the map

## Project Structure

```
asientosElectorales/
├── .continue/                    # Continue configuration
│   └── rules/
│       └── CONTINUE.md          # This file
├── public/
│   └── data/
│       └── asientos_electorales_gps.json  # Electoral seat data (requires setup)
├── src/
│   ├── components/             # React components
│   │   ├── MapComponent.tsx     # Leaflet map wrapper with base configuration
│   │   └── SeatMarkers.tsx      # Interactive markers for electoral seats
│   ├── data/                   # Data configuration files
│   │   └── asientos_electorales_gps.json  # Electoral seat data (requires setup)
│   ├── pages/                  # Page components
│   │   ├── VistaNacional.tsx    # National view component
│   │   └── VistaDepartamento.tsx # Department view component
│   ├── services/               # Business logic and data handling
│   │   └── electoralData.service.ts # Data service for electoral data
│   ├── store/                  # Global state management
│   │   └── useElectoralStore.ts     # Zustand store for app state
│   ├── types/                  # TypeScript type definitions
│   │   ├── electoral.ts        # Electoral data types
│   │   └── leaflet.ts          # Leaflet/map types and constants
│   ├── utils/                  # Utility functions
│   │   └── helpers.ts          # Helper functions
│   ├── assets/                 # Static assets (images, fonts, etc.)
│   ├── App.tsx                 # Root component with routing
│   ├── index.css               # Global styles
│   ├── main.tsx                # Application entry point
│   └── index.html              # HTML template
├── .gitignore                  # Git ignore rules
├── .eslintrc.cjs               # ESLint configuration
├── eslint.config.js            # ESLint configuration (flat config)
├── index.html                  # Main HTML file
├── LICENSE                     # MIT License
├── package.json                # Dependencies and scripts
├── tsconfig.app.json           # TypeScript configuration for app
├── tsconfig.json               # Base TypeScript configuration
├── tsconfig.node.json          # TypeScript configuration for Node scripts
├── vite.config.ts              # Vite build configuration
└── README.md                   # Project documentation
```

## Development Workflow

### Coding Standards

**TypeScript:**
- Use TypeScript for all new files and components
- Explicitly type all props, state, and return values
- Use interfaces from `src/types/electoral.ts` for data structures

**Component Structure:**
```typescript
import React, { FC } from 'react';
import { Typography, Box } from '@mui/material';

interface ComponentProps {
  // Props with explicit types
  prop1: string;
  prop2?: number;
}

export const Component: FC<ComponentProps> = ({ prop1, prop2 = 10 }) => {
  return (
    <Box>
      <Typography>{prop1}</Typography>
    </Box>
  );
};

export default Component;
```

**Naming Conventions:**
- Components: PascalCase (e.g., `MapComponent.tsx`, `SeatMarkers.tsx`)
- Functions: camelCase (e.g., `loadSeats`, `handleDepartamentoClick`)
- Types and Interfaces: PascalCase (e.g., `ElectoralSeat`, `MapView`)
- Constants: UPPER_SNAKE_CASE (e.g., `DEFAULT_LATITUDE`, `ZOOM_COUNTRY`)

**Material UI Best Practices:**
- Use MUI System props for most styling needs
- Leverage `sx` prop for conditional styles
- Use proper MUI icons (imported from `@mui/icons-material`)
- Follow the MUI design system guidelines

### Testing Approach

**Currently:** No tests configured in the project.

**Recommended Additions:**
1. Set up Jest + React Testing Library
2. Create test files alongside source files (e.g., `MapComponent.test.tsx`)
3. Test critical components: `MapComponent`, `SeatMarkers`, and page components
4. Focus on user interactions, data display, and error handling

### Build and Deployment

**Development:**
```bash
npm run dev
```

**Production Build:**
```bash
npm run build
```

The build process:
1. Runs TypeScript compiler (`tsc -b`)
2. Bundles with Vite
3. Outputs to `dist/` directory

**Deployment Options:**
- **Vercel:** Recommended for easy React/Vite deployments
- **Netlify:** Supports Vite builds
- **GitHub Pages:** Configure via `vite.config.ts` or use a custom domain
- **Traditional Hosting:** Deploy `dist/` directory to any static host

**Environment Variables:**
Create a `.env` file for environment-specific configuration:
```env
# Example configuration
VITE_API_URL=https://api.example.com
VITE_MAPS_TOKEN=your_maps_token
```

Access via `import.meta.env.VITE_*` in your code.

### Contribution Guidelines

**When contributing:**
1. Follow the existing code style and formatting
2. Add TypeScript types for any new data structures
3. Update this `CONTINUE.md` file with relevant information
4. Use descriptive commit messages
5. Add comments for complex business logic
6. Ensure accessibility (aria labels, keyboard navigation)
7. Test on multiple browsers and devices

## Key Concepts

### Domain Terminology

- **Asiento Electoral:** A specific polling place or electoral seat
- **Departamento:** A first-level administrative division (9 departments in Bolivia)
- **Provincia:** A second-level administrative division
- **Municipio:** A third-level administrative division
- **Tipo de Circunscripción:** 
  - `Uninominal`: One representative per seat
  - `Binominal`: Two representatives per seat
  - `Plurinominal`: Multiple representatives per seat
- `Mixto`: Mixed constituency type
  - `Special`: Special electoral arrangement
- `Tipo Urbano/Rural`: Classification of electoral seat location
- `Estado`: Seat status (e.g., "Habilitado TSE" / "Active")

### Core Abstractions

**ElectoralSeat Data Structure:**
```typescript
{
  FID: number;                    // Feature ID
  Departamento: string;          // Department name
  Provincia: string;             // Province name
  Municipio: string;             // Municipality name
  Asiento_Electoral: string;     // Seat identifier
  Id_Localidad: number;          // Local ID
  Tipo_Circunscripcion: string;  // Electoral type
  Latitud: number;               // Latitude coordinate
  Longitud: number;              // Longitude coordinate
  Tipo_Urbano_Rural: string;     // Urban/Rural classification
  Estado: string;                // Status
  Geometry_X: number;            // Legacy geometry X
  Geometry_Y: number;            // Legacy geometry Y
  geometry?: Geometry;           // Optional geometry object
}
```

**State Management (Zustand):**
- `currentView`: Tracks current navigation level (country/department/province)
- `filters`: Active filtering state
- `departments`: List of all departments with their codes
- `isLoading`/`error`: Loading and error states

**Map Coordinates:**
- Bolivia center: `[-16.2902, -63.5887]`
- National zoom level: `ZOOM_COUNTRY = 6`
- Department zoom level: `ZOOM_DEPARTMENT = 8`

### Design Patterns

**Component Composition:**
- `MapComponent` provides a reusable Leaflet map wrapper
- `SeatMarkers` renders individual seat markers
- Pages compose these components with custom UI

**Service Layer:**
- `electoralData.service.ts` centralizes data loading and filtering logic
- Separates business logic from UI components
- Provides caching and data organization

**State-Driven UI:**
- Zustand store drives UI updates
- Filters and navigation trigger re-renders
- Data flows: JSON → Service → State → React Components

## Common Tasks

### Adding a New Departmental View

1. Add department name and coordinates to `src/types/leaflet.ts`:
```typescript
export const DEPARTAMENTO_COORDINATES: Record<string, { lat: number; lng: number }> = {
  'Your Department': { lat: -17.0000, lng: -65.0000 },
  // ... existing departments
};
```

2. Add department code mapping in `src/services/electoralData.service.ts`:
```typescript
getDepartamentoCode(nombre: string): string {
  const codeMap: Record<string, string> = {
    'Your Department': 'YT',
    // ... existing codes
  };
  return codeMap[nombre] || nombre.slice(0, 2).toUpperCase();
}
```

### Updating Electoral Data

1. Place your JSON file in `public/data/asientos_electorales_gps.json`
2. Verify data format matches `ElectoralSeat` interface
3. Rebuild the application: `npm run build`
4. The data will automatically be served from the public directory

### Customizing Map Styles

Edit `src/components/MapComponent.tsx`:
```typescript
<TileLayer
  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  url="your_custom_tile_layer_url"  // Change this URL
  maxZoom={your_max_zoom}
/>
```

### Adding New Filters

1. Update `FilterOptions` type in `src/types/electoral.ts`
2. Add filter state in the component
3. Implement filter logic in the component's `useEffect` or filter handler
4. Add filter UI in the JSX (e.g., MUI Select component)
5. Trigger re-render by updating state

### Adding a New Page

1. Create new component in `src/pages/` (e.g., `NewPage.tsx`)
2. Add route in `src/App.tsx`:
```typescript
<Route path="your_route" element={<NewPage />} />
```

### Styling Updates

- Edit global styles in `src/index.css`
- Create new CSS files in `src/assets/css/` and `import` them
- Use MUI System props (`sx` prop) in component files for component-specific styles
- Use Tailwind CSS classes for utility-based styling

## Troubleshooting

### Common Issues and Solutions

**Issue: Map not displaying or markers showing as broken images**

**Solution:**
```typescript
// This is already in MapComponent.tsx but verify it's working
import 'leaflet/dist/leaflet.css';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
});
```

**Issue: TypeScript errors after updating dependencies**

**Solution:**
```bash
npm install
npm run build
# If build still fails, check for type errors
npx tsc --noEmit
```

**Issue: Data not loading or 404 errors**

**Solution:**
```bash
# Ensure data file exists in both locations
ls public/data/asientos_electorales_gps.json
ls src/data/asientos_electorales_gps.json

# Check public folder structure
ls -la public/data/
```

**Issue: Map markers not showing after filtering**

**Solution:**
Check that filtered data is properly passed to `SeatMarkers` component:
```typescript
<MapComponent center={mapCenter} zoom={zoom}>
  {filteredSeats && filteredSeats.length > 0 ? (
    <SeatMarkers seats={filteredSeats} />
  ) : null}
</MapComponent>
```

**Issue: Build fails with "module not found" errors**

**Solution:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Issue: Map not resizing properly**

**Solution:**
Verify parent container has defined height/width:
```css
/* In your component or global CSS */
.map-container {
  height: 500px; /* or any specific height */
  width: 100%;
}
```

### Debugging Tips

**Enable verbose logging:**
```typescript
// Add to components
console.log('Loading seats:', seats);
console.log('Filtered seats:', filteredSeats);
```

**Check React DevTools:**
- Verify component renders correctly
- Check state values in the store
- Inspect prop passes between components

**Map debugging:**
- Open browser console
- Check for Leaflet errors
- Verify tile layer loads (check network tab)
- Confirm coordinate values are valid numbers

**Data validation:**
```typescript
// Add error boundary or validation in service
if (!response.ok) {
  throw new Error(`HTTP ${response.status}: ${response.statusText}`);
}
```

## References

### Official Documentation

- [React](https://react.dev/learn)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Documentation](https://vitejs.dev/guide/)
- [Material UI (MUI)](https://mui.com/material-ui/getting-started/)
- [Leaflet Documentation](https://leafletjs.com/)
- [React Router](https://reactrouter.com/)
- [Zustand](https://docs.pmnd.rs/zustand/getting-started/introduction)
- [ESLint](https://eslint.org/docs/latest/)

### Project Resources

- **GitHub Repository:** https://github.com/willypaz243/asientosElectorales
- **License:** MIT
- **Author:** willypaz243
- **Version:** 1.0.0

### Related Technologies

- **OpenStreetMap:** https://www.openstreetmap.org/
- **MapTiler:** Alternative tile providers
- **TSE (Tribunal Supremo Electoral):** Electoral authority reference

## Additional Notes

- The project uses a centralized data structure that supports both direct JSON arrays and GeoJSON formats
- Leaflet icon configuration is critical and must be properly imported
- Material UI v7 uses Emotion for styling and follows Emotion's patterns
- The project is designed to be easily extensible for additional features

---

**Last Updated:** 2025-06-18
**Maintained By:** Development Team
**Project Status:** Active Development