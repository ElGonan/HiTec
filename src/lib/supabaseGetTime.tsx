// made with chatxd

import supabase from '../supabase/supabaseClient'

const supabaseGetTime = async (time: number) => {
  const { data, error } = await supabase
    .rpc('get_clases_por_hora', { hora_objetivo: time });

  return { data, error };
}

export default supabaseGetTime;
