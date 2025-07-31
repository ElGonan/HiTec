// código para importar estudiantes desde un CSV con el siguiente formato:

/*

    Matricula_alumno, Clase1, Clase2
    Matricula1, ClaseA, ClaseB
    Matricula2, ClaseA, ClaseB ...

 */

import supabase from "../supabase/supabaseClient";
import Papa from "papaparse";

type StudentClassData = {
  alumno_matricula: string;  // Clave única
  alumno_class_1: string;
  alumno_class_2: string;
};

type ImportResult = {
  total: number;
  inserted: number;
  updated: number;
  errors: string[];
};

export const importStudentsCSV = async (
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
        transformHeader: (header: any) => 
          header.trim().replace('Matricula_alumno', 'matricula') // Normaliza nombres
                 .replace('Clase1', 'clase1')
                 .replace('Clase2', 'clase2'),
        complete: resolve,
        error: reject,
      });
    });

    result.total = parsedData.data.length;

    // 2. Validar y transformar datos
    const studentsData: StudentClassData[] = [];
    parsedData.data.forEach((row: any, index: any) => {
      try {
        if (!row.matricula || !row.clase1 || !row.clase2) {
          throw new Error('Faltan campos obligatorios (matrícula, clase1 o clase2)');
        }
        studentsData.push({
          alumno_matricula: String(row.matricula).trim(),
          alumno_class_1: String(row.clase1).trim(),
          alumno_class_2: String(row.clase2).trim(),
        });
      } catch (error) {
        result.errors.push(`Fila ${index + 1}: ${error instanceof Error ? error.message : 'Datos inválidos'}`);
      }
    });

    // 3. Upsert en lotes
    const BATCH_SIZE = 50;
    for (let i = 0; i < studentsData.length; i += BATCH_SIZE) {
      const batch = studentsData.slice(i, i + BATCH_SIZE);
      
      const { data, error } = await supabase
        .from('alumno')
        .upsert(batch, { onConflict: 'alumno_matricula' })  // Ajustado a tu columna
        .select('alumno_matricula');  // Retorna solo la matrícula para verificar

      if (error) throw error;

      // Contabilizar resultados
      if (data) {
        batch.forEach(item => {
          data.some(d => d.alumno_matricula === item.alumno_matricula) 
            ? result.updated++ 
            : result.inserted++;
        });
      }

      // Notificar progreso
      const progress = Math.round(((i + batch.length) / studentsData.length) * 100);
      onProgress?.(progress);
    }

    return result;

  } catch (error) {
    console.error('Error en importación:', error);
    throw error;
  }
};