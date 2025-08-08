/* 
  Ignoren el código comentado debajo de esta sección, es las versiones anteriores del exportar pero ahora está mejorado
  No se borra solo por si sven prefiere el formato anterior
*/

import supabase from '../supabase/supabaseClient'

type Inscripcion = {
  alumno_matricula: string
  nombre_clase: string
}

const getClasesPorAlumno = async (): Promise<Record<string, string[]>> => {
  // Obtenemos todas las inscripciones
  const { data, error } = await supabase
    .from('alumno_clase')
    .select(`
      alumno:alumno_id(alumno_matricula),
      clase:clase_id(nombre_clase)
    `)

  if (error) {
    console.error("Error al obtener inscripciones:", error)
    return {}
  }

  // Agrupamos las clases por matrícula
  const clasesPorAlumno: Record<string, string[]> = {}

  data.forEach(item => {
    const matricula = item.alumno?.alumno_matricula
    const clase = item.clase?.nombre_clase
    
    if (matricula && clase) {
      if (!clasesPorAlumno[matricula]) {
        clasesPorAlumno[matricula] = []
      }
      clasesPorAlumno[matricula].push(clase)
    }
  })

  return clasesPorAlumno
}

const exportClasesPorAlumnoCSV = async () => {
  console.log("Generando reporte de clases por alumno...")
  const clasesPorAlumno = await getClasesPorAlumno()

  if (Object.keys(clasesPorAlumno).length === 0) {
    console.warn("No se encontraron datos")
    return
  }

  // Determinamos el máximo número de clases que tiene un alumno
  const maxClases = Math.max(...Object.values(clasesPorAlumno).map(clases => clases.length))

  // Creamos los encabezados dinámicos
  const headers = ['Matrícula', ...Array.from({length: maxClases}, (_, i) => `Clase ${i+1}`)]
  
  // Generamos las filas del CSV
  const rows = Object.entries(clasesPorAlumno).map(([matricula, clases]) => {
    return [matricula, ...clases].join(',')
  })

  const csvContent = [headers.join(','), ...rows].join('\n')

  // Generamos y descargamos el archivo
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `clases_por_alumno_${new Date().toISOString().slice(0,10)}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export default exportClasesPorAlumnoCSV






// import supabase from '../supabase/supabaseClient'
// import transformDate from './transformDate'

// type AlumnoClase = {
//   inscripcion_id: string
//   alumno: Student
//   clase: Class
// }

// const getAlumnosPorClase = async () => {


// const { data: alumno_clase, error } = await supabase
//   .from('alumno_clase')
//   .select(`
//     inscripcion_id,
//     alumno (
//         alumno_id,
//         alumno_matricula,
//     ),
//     clase (
//         clase_id,
//         instructor,
//         fecha_hora,
//         nombre_clase
//     )
//   `)

// if (error) {
//     console.error("Error fetching data:", error);
//     return [];
//   }

// return alumno_clase as unknown as AlumnoClase[]


// }

// // Este código si se lo pedí a chat porque ni de pedo iba a hacer un CSV a mano
// const exportToCSV = async () => {
//   const data = await getAlumnosPorClase()

//   if (!data || data.length === 0) {
//     console.warn("No hay datos para exportar.")
//     return
//   }

//   // Agrupar alumnos por clase_id   
//   const clasesMap = new Map()

//   data.forEach((item: AlumnoClase) => {
//     const key = item.clase.clase_id
//     const alumno = {
//       nombre: item.alumno.alumno_name,
//       telefono: item.alumno.alumno_phone,
//     }

//     if (!clasesMap.has(key)) {
//       clasesMap.set(key, {
//         clase: {
//           nombre_clase: item.clase.nombre_clase,
//           fecha_hora: item.clase.fecha_hora,
//           instructor: item.clase.instructor,
//         },
//         alumnos: [alumno],
//       })
//     } else {
//       clasesMap.get(key).alumnos.push(alumno)
//     }
//   })

//   // Construir contenido CSV
//   let csvContent = ''

//   for (const [_, { clase, alumnos }] of clasesMap) {
//     csvContent += `Clase: ${clase.nombre_clase}, ${transformDate(clase.fecha_hora)}, Instructor: ${clase.instructor}\n`
//     csvContent += `Nombre,Telefono\n`
//     alumnos.forEach((al : any) => {
//       csvContent += `${al.nombre},${al.telefono}\n`
//     })
//     csvContent += `\n` // espacio entre clases
//   }

//   // Crear blob y forzar descarga
//   const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
//   const url = URL.createObjectURL(blob)
//   const link = document.createElement('a')
//   link.setAttribute('href', url)
//   link.setAttribute('download', 'alumnos_por_clase.csv')
//   link.style.visibility = 'hidden'
//   document.body.appendChild(link)
//   link.click()
//   document.body.removeChild(link)
// }



// export default exportToCSV









// import supabase from '../supabase/supabaseClient'

// type Inscripcion = {
//   alumno: {
//     alumno_matricula: string
//   },
//   clase: {
//     nombre_clase: string
//   }
// }

// const getTodasInscripciones = async (): Promise<Inscripcion[]> => {
//   let todasLasInscripciones: Inscripcion[] = []
//   let desde = 0
//   const limitePorPagina = 1000 // Máximo permitido por Supabase
//   let hayMasDatos = true

//   while (hayMasDatos) {
//     const { data, error, count } = await supabase
//       .from('alumno_clase')
//       .select(`
//         alumno:alumno_id(alumno_matricula),
//         clase:clase_id(nombre_clase)
//       `, { count: 'exact' })
//       .range(desde, desde + limitePorPagina - 1)

//     if (error) {
//       console.error("Error al obtener inscripciones:", error)
//       return []
//     }

//     if (data && data.length > 0) {
//       todasLasInscripciones = [...todasLasInscripciones, ...data as unknown as Inscripcion[]]
//       desde += limitePorPagina
//     } else {
//       hayMasDatos = false
//     }

//     // Verificar si hemos obtenido todos los registros
//     if (count && todasLasInscripciones.length >= count) {
//       hayMasDatos = false
//     }
//   }

//   return todasLasInscripciones
// }

// const exportTodasInscripcionesCSV = async () => {
//   console.log("Comenzando la exportación...")
//   const todasLasInscripciones = await getTodasInscripciones()

//   if (!todasLasInscripciones || todasLasInscripciones.length === 0) {
//     console.warn("No se encontraron inscripciones")
//     return
//   }

//   console.log(`Total de inscripciones obtenidas: ${todasLasInscripciones.length}`)

//   // Encabezado del CSV
//   let csvContent = 'Matrícula,Clase inscrita\n'
  
//   // Agregar todas las inscripciones
//   todasLasInscripciones.forEach(inscripcion => {
//     csvContent += `${inscripcion.alumno.alumno_matricula},${inscripcion.clase.nombre_clase}\n`
//   })

//   // Crear y descargar el archivo
//   const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
//   const url = URL.createObjectURL(blob)
//   const link = document.createElement('a')
//   link.href = url
//   link.download = `todas_inscripciones_${new Date().toISOString().slice(0,10)}.csv`
//   document.body.appendChild(link)
//   link.click()
//   document.body.removeChild(link)
//   URL.revokeObjectURL(url)
// }

// export default exportTodasInscripcionesCSV














// import supabase from '../supabase/supabaseClient'

// const getMatriculasUnicas = async (): Promise<string[]> => {
//   // Primero obtenemos el conteo total de matrículas únicas
//   const { count } = await supabase
//     .from('alumno_clase')
//     .select('alumno_id', { count: 'exact', head: true })
//     .not('alumno_id', 'is', null)

//   if (!count || count === 0) {
//     return []
//   }

//   // Luego obtenemos todas las matrículas únicas usando distinct
//   const { data, error } = await supabase
//     .from('alumno_clase')
//     .select('alumno:alumno_id(alumno_matricula)')
//     .not('alumno_id', 'is', null)
//     .limit(count)

//   if (error) {
//     console.error("Error al obtener matrículas:", error)
//     return []
//   }

//   // Extraemos solo las matrículas y eliminamos duplicados
//   const matriculas = data.map(item => item.alumno?.alumno_matricula).filter(Boolean)
//   const matriculasUnicas = [...new Set(matriculas)]

//   return matriculasUnicas as string[]
// }

// const exportMatriculasUnicasCSV = async () => {
//   console.log("Obteniendo matrículas únicas...")
//   const matriculas = await getMatriculasUnicas()

//   if (!matriculas || matriculas.length === 0) {
//     console.warn("No se encontraron matrículas")
//     return
//   }

//   console.log(`Total de matrículas únicas encontradas: ${matriculas.length}`)

//   // Creamos el contenido CSV
//   const csvContent = 'Matrícula\n' + matriculas.join('\n')

//   // Generamos y descargamos el archivo
//   const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
//   const url = URL.createObjectURL(blob)
//   const link = document.createElement('a')
//   link.href = url
//   link.download = `matriculas_unicas_${new Date().toISOString().slice(0,10)}.csv`
//   document.body.appendChild(link)
//   link.click()
//   document.body.removeChild(link)
//   URL.revokeObjectURL(url)
// }

// export default exportMatriculasUnicasCSV
