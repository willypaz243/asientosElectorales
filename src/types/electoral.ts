// Tipos para datos electorales

export interface Geometry {
  type: 'Point' | 'Polygon' | 'LineString';
  coordinates: number[];
}

export interface ElectoralSeat {
  FID: number;
  Departamento: string;
  Provincia: string;
  Municipio: string;
  Asiento_Electoral: string;
  Id_Localidad: number;
  Tipo_Circunscripcion: 'Uninominal' | 'Binominal' | 'Plurinominal';
  Latitud: number;
  Longitud: number;
  Tipo_Urbano_Rural: 'Urbano' | 'Rural';
  Estado: string;
  Geometry_X: number;
  Geometry_Y: number;
  geometry?: Geometry;
}

export interface Department {
  name: string;
  code: string;
}

export interface Province {
  name: string;
  department: string;
  code: string;
}

export interface Municipality {
  name: string;
  province: string;
  department: string;
  code: string;
}

export interface FilterOptions {
  departamento: string;
  provincia: string;
  tipoCircunscripcion: string;
  tipoUrbanoRural: string;
}

export interface MapView {
  level: 'country' | 'department' | 'province';
  data: Partial<ElectoralSeat>;
}