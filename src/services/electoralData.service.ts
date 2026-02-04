import type { ElectoralSeat } from '../types/electoral';

/**
 * Servicio para cargar datos electorales
 */
class ElectoralDataService {
  private seats: ElectoralSeat[] | null = null;
  private departments: Map<string, number> = new Map();
  private provinces: Map<string, string[]> = new Map();

  /**
   * Carga los asientos electorales desde el archivo JSON
   */
  async loadSeats(): Promise<void> {
    try {
      console.log('Iniciando carga de asientos electorales...');
      const response = await fetch('/data/asientos_electorales_gps.json');

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Datos recibidos:', Array.isArray(data) ? `Array con ${data.length} elementos` : typeof data);

      // El JSON es un array directo, no un GeoJSON con features
      if (Array.isArray(data)) {
        this.seats = data.map((item: any) => {
          const seat = {
            ...item,
            geometry: {
              type: 'Point',
              coordinates: [
                item.Longitud ?? item.Geometry_X ?? 0,
                item.Latitud ?? item.Geometry_Y ?? 0
              ]
            }
          };
          return seat;
        });
        console.log('Asientos procesados:', this.seats.length);
        console.log('Primer asiento:', this.seats[0] || 'No disponible');
      } else if (data.features && Array.isArray(data.features)) {
        // Si es GeoJSON con features
        this.seats = data.features.map((feature: any) => ({
          ...feature.properties,
          geometry: feature.geometry || {
            type: 'Point',
            coordinates: [0, 0]
          }
        }));
        console.log('Asientos desde GeoJSON:', this.seats?.length || 0);
      } else {
        throw new Error('Formato de datos no reconocido');
      }
    } catch (error) {
      console.error('Error al cargar datos electorales:', error);
      throw error;
    }
  }

  /**
   * Obtiene todos los asientos electorales
   */
  getSeats(): ElectoralSeat[] {
    if (!this.seats) {
      throw new Error('Los datos aún no han sido cargados');
    }
    return this.seats;
  }

  /**
   * Filtra asientos por departamento
   */
  getSeatsByDepartment(departamento: string): ElectoralSeat[] {
    if (!this.seats) {
      throw new Error('Los datos aún no han sido cargados');
    }
    return this.seats.filter((seat) => seat.Departamento === departamento);
  }

  /**
   * Filtra asientos por provincia
   */
  getSeatsByProvince(departamento: string, provincia: string): ElectoralSeat[] {
    if (!this.seats) {
      throw new Error('Los datos aún no han sido cargados');
    }
    return this.seats.filter(
      (seat) =>
        seat.Departamento === departamento && seat.Provincia === provincia
    );
  }

  /**
   * Obtiene las coordenadas y conteos por departamento
   */
  getDepartamentoStats(): { name: string; count: number; lat: number; lng: number }[] {
    if (!this.seats) {
      throw new Error('Los datos aún no han sido cargados');
    }

    const stats = new Map<
      string,
      { name: string; count: number; lat: number; lng: number }
    >();

    this.seats.forEach((seat) => {
      if (!stats.has(seat.Departamento)) {
        stats.set(seat.Departamento, {
          name: seat.Departamento,
          count: 0,
          lat: -16.2902,
          lng: -63.5887
        });
      }
      const stat = stats.get(seat.Departamento)!;
      stat.count++;
    });

    return Array.from(stats.values());
  }

  /**
   * Carga los departamentos con sus coordenadas centroides
   */
  async loadDepartments(): Promise<void> {
    if (this.departments.size > 0) return;

    const stats = this.getDepartamentoStats();

    stats.forEach(({ name }) => {
      this.departments.set(name, this.departments.size);

      if (!this.provinces.has(name)) {
        this.provinces.set(name, []);
      }
    });
  }

  /**
   * Obtiene un departamento específico con su código
   */
  getDepartamentoCode(nombre: string): string {
    const codeMap: Record<string, string> = {
      'La Paz': 'LP',
      'Cochabamba': 'CB',
      'Oruro': 'OR',
      'Potosí': 'PO',
      'Chuquisaca': 'CH',
      'Tarija': 'TA',
      'Santa Cruz': 'SC',
      'Beni': 'BN',
      'Pando': 'PD'
    };
    return codeMap[nombre] || nombre.slice(0, 2).toUpperCase();
  }
}

export const electoralDataService = new ElectoralDataService();

