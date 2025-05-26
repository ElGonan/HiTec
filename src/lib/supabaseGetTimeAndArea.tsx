// made with chatxd

import supabase from '../supabase/supabaseClient'

const supabaseGetTimeAndArea = async (time: number, area: string) => {
  const { data, error } = await supabase
    .rpc('get_clases_por_hora_y_area', { hora_objetivo: time, area_objetivo: area });

  return { data, error };
}

export default supabaseGetTimeAndArea;
