import { create } from 'zustand';
import type { FilterOptions, MapView, Department } from '../types/electoral';
import { DEPARTAMENTO_COORDINATES } from '../types/leaflet';

interface ElectoralStore {
  // Estado de la vista actual
  currentView: MapView;
  setCurrentView: (view: MapView) => void;

  // Filtros activos
  filters: FilterOptions;
  setFilters: (filters: Partial<FilterOptions>) => void;
  resetFilters: () => void;

  // Lista de departamentos
  departments: Department[];
  setDepartments: (departments: Department[]) => void;

  // Estado de carga
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;

  // Error
  error: string | null;
  setError: (error: string | null) => void;
}

export const useElectoralStore = create<ElectoralStore>((set) => ({
  currentView: {
    level: 'country',
    data: {}
  },
  setCurrentView: (view) => set({ currentView: view }),

  filters: {
    departamento: '',
    provincia: '',
    tipoCircunscripcion: '',
    tipoUrbanoRural: ''
  },
  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters }
    })),
  resetFilters: () =>
    set({
      filters: {
        departamento: '',
        provincia: '',
        tipoCircunscripcion: '',
        tipoUrbanoRural: ''
      }
    }),

  departments: Object.entries(DEPARTAMENTO_COORDINATES).map(([name]) => ({
    name,
    code: name === 'La Paz' ? 'LP' : name.slice(0, 2).toUpperCase()
  })),
  setDepartments: (departments) => set({ departments }),

  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),

  error: null,
  setError: (error) => set({ error })
}));