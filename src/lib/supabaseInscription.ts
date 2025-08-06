import supabase from '../supabase/supabaseClient'

/*
  Cambiamos la función para hacerla atómica.
 */

const SupabaseInscription = async (alumno_id : number, clase_id: number) => {
  try {
    // El rpc está dado de alta en supabase, puedes verlo desde misc/querys.sql
    const { data: updatedClass, error : updateError } = await supabase
      .rpc('decrementar_capacidad', { 
      p_clase_id: clase_id 
    });
    console.log(updatedClass)

    if (updatedClass.error || updateError) {
      return { data: null, error: new Error("No hay más lugares disponibles.") };
    }

    if(updatedClass.success) {
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

    return { data : enrollment, error: enrollmentError };
  };

  } catch (err) {
    return { error: err as Error };
  }
};

  export default SupabaseInscription