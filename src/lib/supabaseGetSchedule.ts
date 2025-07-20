import supabase from "../supabase/supabaseClient"

export const getSchedule = async (alumno_id: string) => {
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
  .eq('alumno_id', alumno_id)
  if (data){
    return data?.map(item => item.clase) ?? [];  
}
  
  if (error){
    throw new Error(error.message);
  }
  
}



