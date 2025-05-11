import supabase from '../supabase/supabaseClient'
import { PostgrestError } from '@supabase/supabase-js'


const modifyCapacity = async (id: number) => {
  // 1. Obtener capacidad actual
  const { data, error }: { data: { capacidad_clase: number } | null; error: PostgrestError | null } = await supabase
    .from("clase")
    .select("capacidad_clase")
    .eq("clase_id", id)
    .single() // para que regrese solo un objeto, no arreglo

  if (error || !data) {
    console.error("Error al obtener la capacidad de la clase:", error)
    return
  }

  const nuevaCapacidad = data.capacidad_clase - 1

  // 2. Validar que no sea menor a 0
  if (nuevaCapacidad < 0) {
    alert("No hay lugares disponibles en esta clase.")
    return -1
  }

  // 3. Actualizar capacidad
  const { error: updateError } = await supabase
    .from("clase")
    .update({ capacidad_clase: nuevaCapacidad })
    .eq("clase_id", id)

  if (updateError) {
    console.error("Error al actualizar la capacidad:", updateError)
  } else {
    console.log(`Capacidad actualizada: ${nuevaCapacidad}`)
  }
}

const SupabaseInscription = async (alumno_id : number, clase_id: number) => {

    // 1. Modificar capacidad de la clase
    const capacidadResult = await modifyCapacity(clase_id)
    if (capacidadResult === -1) {
      return { data: null, error: new Error("No hay lugares disponibles en esta clase.") }
    }

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