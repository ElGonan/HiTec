import supabase from '../supabase/supabaseClient'

/*
  Cambiamos la función para hacerla atómica.

  Ahroa la lógica de añadir inscripciones a la tabla
  de alumnos_clases y decrementar la capacidad
  de la clase se hace en un solo RPC.
 */

const SupabaseInscription = async (alumno_id : number, clase_id: number) => {
  try {
    // El rpc está dado de alta en supabase, puedes verlo desde misc/SQL/decrementar_capacidad.sql
    const { data: updatedClass, error : updateError } = await supabase
      .rpc('decrementar_capacidad', { 
      p_clase_id: clase_id,
      p_alumno_id: alumno_id
    });
    //console.log(updatedClass)
    //console.log(updateError)

    if (updatedClass.error || updateError) {
      return { data: null, error: new Error("No hay más lugares disponibles.") };
    }

    return { data: updatedClass, error: updateError };

  } catch (err) {
    return { error: err as Error };
  }
};

  export default SupabaseInscription