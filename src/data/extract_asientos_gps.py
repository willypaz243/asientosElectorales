#!/usr/bin/env python3
"""
Script para extraer todos los datos GPS de asientos electorales de Bolivia
usando la API del OEP con paginación por Object IDs.
"""

import csv
import json
import time

import requests

# URL base de la API
BASE_URL = "https://geoelectoral.oep.org.bo/oep/rest/services/AsientosElectorales/AsientosRecintos_22_01_2026/MapServer/0/query"

def get_all_object_ids():
    """Obtiene todos los IDs de objetos disponibles"""
    params = {
        "where": "1=1",
        "returnIdsOnly": "true",
        "f": "json"
    }
    
    try:
        response = requests.get(BASE_URL, params=params, timeout=30)
        response.raise_for_status()
        data = response.json()
        return data.get("objectIds", [])
    except requests.exceptions.RequestException as e:
        print(f"Error obteniendo IDs: {e}")
        return []

def fetch_records_by_ids(object_ids):
    """Obtiene registros por sus IDs usando POST para evitar límites de URL"""
    all_features = []
    batch_size = 100  # Reducido para evitar errores

    total_batches = (len(object_ids) + batch_size - 1) // batch_size
    for i in range(0, len(object_ids), batch_size):
        batch = object_ids[i:i + batch_size]
        ids_str = ",".join(map(str, batch))
        
        data = {
            "objectIds": ids_str,
            "outFields": "*",
            "outSR": "4326",
            "f": "json",
            "returnGeometry": "true"
        }
        
        try:
            response = requests.post(BASE_URL, data=data, timeout=60)
            response.raise_for_status()
            result = response.json()
            
            features = result.get("features", [])
            all_features.extend(features)
            
            batch_num = i // batch_size + 1
            print(f"  Lote {batch_num}/{total_batches}: {len(features)} registros (Total: {len(all_features)})")
            
            time.sleep(0.2)  # Pequeña pausa
            
        except requests.exceptions.RequestException as e:
            print(f"  Error en lote {i//batch_size + 1}: {e}")
            continue
    
    return all_features

def extract_gps_data(features):
    """Extrae los datos GPS relevantes de cada feature"""
    records = []
    
    for feature in features:
        attrs = feature.get("attributes", {})
        geometry = feature.get("geometry", {})
        
        record = {
            "FID": attrs.get("FID"),
            "Departamento": attrs.get("NomDep"),
            "Provincia": attrs.get("NomProv"),
            "Municipio": attrs.get("NombreMuni"),
            "Asiento_Electoral": attrs.get("AsientoEle"),
            "Id_Localidad": attrs.get("IdLoc"),
            "Tipo_Circunscripcion": attrs.get("TipoCircun"),
            "Latitud": attrs.get("latitud"),
            "Longitud": attrs.get("longitud"),
            "Tipo_Urbano_Rural": attrs.get("descUrbano"),
            "Estado": attrs.get("Estado"),
            "Geometry_X": geometry.get("x"),
            "Geometry_Y": geometry.get("y")
        }
        records.append(record)
    
    return records

def save_to_csv(records, filename="asientos_electorales_gps.csv"):
    """Guarda los registros en un archivo CSV"""
    if not records:
        print("No hay registros para guardar.")
        return
    
    fieldnames = [
        "FID", "Departamento", "Provincia", "Municipio", 
        "Asiento_Electoral", "Id_Localidad", "Tipo_Circunscripcion",
        "Latitud", "Longitud", "Tipo_Urbano_Rural", "Estado",
        "Geometry_X", "Geometry_Y"
    ]
    
    with open(filename, 'w', newline='', encoding='utf-8') as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(records)
    
    print(f"\n✓ Datos guardados en: {filename}")
    print(f"  Total de registros: {len(records)}")

def save_to_json(records, filename="asientos_electorales_gps.json"):
    """Guarda los registros en un archivo JSON"""
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(records, f, ensure_ascii=False, indent=2)
    print(f"✓ Datos guardados en: {filename}")

def main():
    print("=" * 60)
    print("EXTRACTOR DE DATOS GPS - ASIENTOS ELECTORALES BOLIVIA")
    print("Fuente: OEP - geoelectoral.oep.org.bo")
    print("=" * 60)
    
    # Paso 1: Obtener todos los IDs
    print("\n1. Obteniendo lista de IDs...")
    object_ids = get_all_object_ids()
    
    if not object_ids:
        print("No se pudieron obtener los IDs.")
        return
    
    print(f"   Total de IDs disponibles: {len(object_ids)}")
    
    # Paso 2: Obtener datos por lotes
    print("\n2. Descargando datos por lotes...")
    features = fetch_records_by_ids(object_ids)
    
    if not features:
        print("No se pudieron obtener los datos.")
        return
    
    print(f"\n   Total de registros obtenidos: {len(features)}")
    
    # Paso 3: Extraer datos GPS
    print("\n3. Procesando datos...")
    records = extract_gps_data(features)
    
    # Paso 4: Guardar archivos
    print("\n4. Guardando archivos...")
    save_to_csv(records)
    save_to_json(records)
    
    # Mostrar resumen
    print("\n" + "=" * 60)
    print("RESUMEN:")
    print("=" * 60)
    
    # Contar por departamento
    depts = {}
    for r in records:
        dept = r["Departamento"] or "Sin departamento"
        depts[dept] = depts.get(dept, 0) + 1
    
    print("\nDistribución por Departamento:")
    for dept, count in sorted(depts.items()):
        print(f"  {dept}: {count} asientos")
    
    # Contar urbano vs rural
    urbano_rural = {}
    for r in records:
        tipo = r["Tipo_Urbano_Rural"] or "Sin clasificar"
        urbano_rural[tipo] = urbano_rural.get(tipo, 0) + 1
    
    print("\nDistribución Urbano/Rural:")
    for tipo, count in sorted(urbano_rural.items()):
        print(f"  {tipo}: {count}")
    
    # Mostrar algunos ejemplos
    print("\nPrimeros 5 registros:")
    for i, r in enumerate(records[:5], 1):
        print(f"\n{i}. {r['Asiento_Electoral']}")
        print(f"   Dept: {r['Departamento']}, Prov: {r['Provincia']}, Mun: {r['Municipio']}")
        print(f"   GPS: {r['Latitud']}, {r['Longitud']}")

if __name__ == "__main__":
    main()

