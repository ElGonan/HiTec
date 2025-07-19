import supabase from '../supabase/supabaseClient'
import { PostgrestError } from '@supabase/supabase-js'

type SupabaseGetResult = {
  error: PostgrestError | null
}

/*
 * I requiered a function to delete parameters from a table,
 * this function can delete a row or a specific parameter
 * from a table in Supabase.
 */

const supabaseDelete = async (
  table: string,
  parameter: string,
  value: string | number
): Promise<SupabaseGetResult> => {
  let query = supabase.from(table).delete().eq(parameter, value);

  const { error } = await query;

  return { error };
}

export default supabaseDelete;
