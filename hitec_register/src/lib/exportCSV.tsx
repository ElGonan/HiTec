import supabase from '../supabase/supabaseClient'

type AlumnoClase = {
  inscripcion_id: string
  alumno: Student
  clase: Class
}

  const transformDate = (date: string) => {
        const dateObj = new Date(date)
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        }
        const formattedDate = dateObj.toLocaleString('es-MX', options)
        return formattedDate
    }
const getAlumnosPorClase = async () => {


let { data: alumno_clase, error } = await supabase
  .from('alumno_clase')
  .select(`
    inscripcion_id,
    alumno (
        alumno_id,
        alumno_name,
        alumno_phone
    ),
    clase (
        clase_id,
        instructor,
        fecha_hora,
        nombre_clase
    )
  `)

if (error) {
    console.error("Error fetching data:", error);
    return [];
  }

return alumno_clase as unknown as AlumnoClase[]


}

// Este código si se lo pedí a chat porque ni de pedo iba a hacer un CSV a mano
const exportToCSV = async () => {
  const data = await getAlumnosPorClase()

  if (!data || data.length === 0) {
    console.warn("No hay datos para exportar.")
    return
  }

  // Agrupar alumnos por clase_id   
  const clasesMap = new Map()

  data.forEach((item: AlumnoClase) => {
    const key = item.clase.clase_id
    const alumno = {
      nombre: item.alumno.alumno_name,
      telefono: item.alumno.alumno_phone,
    }

    if (!clasesMap.has(key)) {
      clasesMap.set(key, {
        clase: {
          nombre_clase: item.clase.nombre_clase,
          fecha_hora: item.clase.fecha_hora,
          instructor: item.clase.instructor,
        },
        alumnos: [alumno],
      })
    } else {
      clasesMap.get(key).alumnos.push(alumno)
    }
  })

  // Construir contenido CSV
  let csvContent = ''

  for (const [_, { clase, alumnos }] of clasesMap) {
    csvContent += `Clase: ${clase.nombre_clase}, ${transformDate(clase.fecha_hora)}, Instructor: ${clase.instructor}\n`
    csvContent += `Nombre,Telefono\n`
    alumnos.forEach((al : any) => {
      csvContent += `${al.nombre},${al.telefono}\n`
    })
    csvContent += `\n` // espacio entre clases
  }

  // Crear blob y forzar descarga
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', 'alumnos_por_clase.csv')
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}



export default exportToCSV
