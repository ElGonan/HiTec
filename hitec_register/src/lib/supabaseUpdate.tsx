import supabase from '../supabase/supabaseClient'
import { PostgrestError } from '@supabase/supabase-js'

type SupabaseUpdateResult = {
  data: any[] | null
  error: PostgrestError | null
}

const supabaseUpdate = async (
  table: string,
  parameter: string, // columna por la cual buscar
  value: string | number, // valor para hacer match (ej. clase_id)
  updates: object // objeto con los valores nuevos
): Promise<SupabaseUpdateResult> => {
  const { data, error } = await supabase
    .from(table)
    .update(updates)
    .eq(parameter, value)
    .select(); // opcional: devuelve los datos actualizados

  return { data, error };
}

export default supabaseUpdate;
