import supabase from '../supabase/supabaseClient'

/*
  Cambiamos la función para hacerla atómica.

  Ahroa la lógica de añadir inscripciones a la tabla
  de alumnos_clases y decrementar la capacidad
  de la clase se hace en un solo RPC.
 */

const SupabaseDeleteInscription = async (alumno_id : number) => {
  try {
    // El rpc está dado de alta en supabase, puedes verlo desde misc/SQL/delete_inscription.sql
    const { data: deletedData, error : updateError } = await supabase
      .rpc('delete_inscription', { 
      p_alumno_id: alumno_id
    });

    //console.log("deletedData", deletedData);

    if (deletedData.error == "Eliminar clases bloqueado") {
      return { data: "blocked", error: null };
    }

    if (deletedData.error || updateError) {
      return { data: null, error: new Error("Error reduciendo la capacidad") };
    }

    return { data: deletedData, error: updateError };

  } catch (err) {
    return { error: err as Error };
  }
};

  export default SupabaseDeleteInscription