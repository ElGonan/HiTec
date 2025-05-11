import supabase from '../supabase/supabaseClient'
import { PostgrestError } from '@supabase/supabase-js'

type SupabaseGetResult = {
  data: any[] | null
  error: PostgrestError | null
}

const supabaseGet = async (
  table: string,
  parameter?: string,
  value?: string | number
): Promise<SupabaseGetResult> => {
  let query = supabase.from(table).select();

  if (parameter && value !== undefined) {
    query = query.eq(parameter, value);
  }

  const { data, error } = await query;

  return { data, error };
}

export default supabaseGet;
