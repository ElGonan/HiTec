// código para importar clases desde un CSV con el siguiente formato:

/*

    instructor, fecha_hora, capacidad_clase, nombre_clase, area, lugar
    instructor1, 2023-10-01 10:00, 30, Clase A, Area 1, Lugar 1
    instructor2, 2023-10-02 11:00, 25, Clase B, Area 2, Lugar 2 ...

 */

import supabase from "../supabase/supabaseClient";
import Papa from "papaparse";

type ImportResult = {
  total: number;
  inserted: number;
  updated: number;
  errors: string[];
};

// Función para convertir formato DD/MM/YYYY HH:MM a YYYY-MM-DD HH:MM:SS
const convertToISODate = (dateString: string): string => {
  const [datePart, timePart] = dateString.split(' ');
  const [day, month, year] = datePart.split('/');
  return `${year}-${month}-${day} ${timePart}:00`;
};

export const importClassesCSV = async (
  file: File,
  onProgress?: (progress: number) => void
): Promise<ImportResult> => {
  const result: ImportResult = {
    total: 0,
    inserted: 0,
    updated: 0,
    errors: [],
  };

  try {
    // 1. Parsear CSV
    const parsedData = await new Promise<Papa.ParseResult<unknown>>((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (header: string) => 
          header.trim()
            .replace('Instructor', 'instructor')
            .replace('Fecha_hora', 'fecha_hora')
            .replace('Capacidad_clase', 'capacidad_clase')
            .replace('Nombre_clase', 'nombre_clase')
            .replace('Area', 'area')
            .replace('Lugar', 'lugar'),
        complete: resolve,
        error: reject,
      });
    });

    result.total = parsedData.data.length;

    // 2. Validar y transformar datos
    const classes: Partial<Class>[] = [];
    parsedData.data.forEach((row: any, index: number) => {
      try {
        if (!row.instructor || !row.fecha_hora || !row.capacidad_clase || !row.nombre_clase || !row.area || !row.lugar) {
          throw new Error('Faltan campos obligatorios');
        }

        classes.push({
          instructor: String(row.instructor).trim(),
          fecha_hora: convertToISODate(String(row.fecha_hora).trim()),
          capacidad_clase: Number(row.capacidad_clase),
          nombre_clase: String(row.nombre_clase).trim(),
          area: String(row.area).trim(),
          lugar: String(row.lugar).trim(),
        });
      } catch (error) {
        result.errors.push(`Fila ${index + 1}: ${error instanceof Error ? error.message : 'Datos inválidos'}`);
      }
    });

    // 3. Upsert en lotes
    const BATCH_SIZE = 50;
    for (let i = 0; i < classes.length; i += BATCH_SIZE) {
      const batch = classes.slice(i, i + BATCH_SIZE);
      
      const { data, error } = await supabase
        .from('clase')
        .upsert(batch)
        .select('clase_id, nombre_clase');

      if (error) throw error;

      // Contabilizar resultados
      if (data) {
        batch.forEach(() => { // Simplificado ya que upsert no distingue bien inserts/updates
          data.length > 0 ? result.updated++ : result.inserted++;
        });
      }

      // Notificar progreso
      const progress = Math.round(((i + batch.length) / classes.length) * 100);
      onProgress?.(progress);
    }

    return result;

  } catch (error) {
    console.error('Error en importación:', error);
    throw error;
  }
};