import supabase from '../supabase/supabaseClient'

/*
  Cambiamos la función para hacerla atómica.
 */

const SupabaseInscription = async (alumno_id : number, clase_id: number) => {
  try {
    const { data: updatedClass, error : updateError } = await supabase
    .from("clase")
    .update({ capacidad_clase: supabase.rpc('decrement_if_positive') })
    .eq("clase_id", clase_id)
    .gt("capacidad_clase", 0)
    .select("capacidad_clase")
    .single();

    if (updateError || !updatedClass) {
      return { data: null, error: new Error("No hay más lugares disponibles.") };
    }

    const { data: enrollment, error: enrollmentError } = await supabase
    .from("alumno_clase")
    .insert([{ alumno_id, clase_id }])
    .select()
    .single();

    if (enrollmentError) {
      await supabase
      .from("clase")
      .update({ capacidad_clase: supabase.rpc('increment') })
      .eq("clase_id", clase_id);

      return { data : enrollment, error : enrollmentError };
    }

    return { data: null, error: enrollmentError };

  } catch (err) {
    return { data : null, error: err as Error };
  }
};

  export default SupabaseInscription