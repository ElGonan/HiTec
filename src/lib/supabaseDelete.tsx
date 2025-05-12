import supabase from '../supabase/supabaseClient'
import { PostgrestError } from '@supabase/supabase-js'

type SupabaseGetResult = {
  error: PostgrestError | null
}

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
