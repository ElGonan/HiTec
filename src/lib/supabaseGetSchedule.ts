import supabase from "../supabase/supabaseClient";

export const getSchedule = async (alumno_id: string) => {
  try {
    const { data, error } = await supabase
      .from('alumno_clase')
      .select(`
        clase (
          instructor,
          fecha_hora,
          nombre_clase,
          lugar
        )
      `)
      .eq('alumno_id', alumno_id);

    // 1. Maneja errores explícitos de Supabase
    if (error) throw new Error(error.message);

    // 2. Siempre retorna un array (incluso si data es null o undefined)
    return data?.map(item => item.clase).filter(Boolean) || []; // Filtra null/undefined en clase

  } catch (error) {
    console.error("Error en getSchedule:", error);
    return []; // Fallback seguro para cualquier error
  }
};