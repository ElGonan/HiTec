import supabase from '../supabase/supabaseClient'
import { PostgrestError } from '@supabase/supabase-js'

const SupabaseInscription = async (alumno_id : number, clase_id: number) => {

    const { data, error }: { data: any[] | null; error: PostgrestError | null } = await supabase
      .from("alumno_clase")
      .insert([{ alumno_id, clase_id }])
        .select()

    if (error) {
      return { data: null, error }
    }

    if (data) {
        console.log("Inscripcion exitosa")
      return { data, error: null }
    }
  
  return { data: null, error: null }
}

  export default SupabaseInscription