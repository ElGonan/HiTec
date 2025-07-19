import Swal from "sweetalert2";
import supabaseUpdate from "../lib/supabaseUpdate";
import supabaseDelete from "../lib/supabaseDelete";



const modifyCapacities = async (capacities: number[], classID: number[], userID: number) => {
    const result = [...capacities];
    for (let i = 0; i < result.length; i++){
        result[i] = result[i] + 1;
    }
    for (let i = 0; i < classID.length; i++) {
            const { error } = await supabaseUpdate("clase", "clase_id", i, { capacidad_clase: result[i] });
            if (error) {
                alert("Error al actualizar la capacidad de la clase: " + error.message);
                return;
    }
    }
    const { error } = await supabaseDelete("alumno_clase", "alumno_id", userID!);
            if (error) {
                    throw new Error("Error al eliminar la inscripción del alumno: " + error.message);
    }
}


// Classes must have the ID´s and the Capacities.
export const useClassDelete = () => {
  const executeDeletion = async (classes: [number[], number[]], userID: number) => {
    const [classIDs, classCapacities] = classes;

    if (!classIDs || !classCapacities || classIDs.length === 0 || classCapacities.length === 0) {
      await Swal.fire({
        title: "No tienes clases inscritas",
        icon: "error"
      });
      return false;
    }

    // Validación de tamaños
    if (classIDs.length !== classCapacities.length) {
      await Swal.fire({
        title: "Error en los datos",
        text: "La cantidad de clases no coincide con las capacidades",
        icon: "error"
      });
      return false;
    }

    try {
      // Lógica de modificación
      await modifyCapacities(classIDs, classCapacities, userID);

      await Swal.fire({
        title: "Operación exitosa",
        text: "Inscripción borrada correctamente",
        icon: "success"
      });
      return true;
    } catch (error) {
      await Swal.fire({
        title: "Error",
        text: error instanceof Error ? error.message : "Error desconocido",
        icon: "error"
      });
      return false;
    }
  };

  return { executeDeletion };
};