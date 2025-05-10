import supabase from '../supabase/supabaseClient'
import { PostgrestError } from '@supabase/supabase-js'

const supabaseGet = async (table: string, parameter: string, value: string | number) => {

    const { data, error }: { data: any[] | null; error: PostgrestError | null } = await supabase
      .from(table)
      .select()
      .eq(parameter, value)

    if (error) {
      return { data: null, error }
    }

    if (data) {
      return { data, error: null }
    }
  
  return { data: null, error: null }
}

  export default supabaseGet