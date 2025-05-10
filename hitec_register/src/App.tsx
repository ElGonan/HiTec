import supabase from './supabase/supabaseClient'
import { useEffect, useState } from 'react'
import useSupabaseRead from './hooks/useSupabaseRead'
import { PostgrestError } from '@supabase/supabase-js'



const App = () => {
  const [error, setError] = useState<PostgrestError | null | string>(null)
  const [clases, setClases] = useState<any[] | null>(null)
  const [alumno_name, setName] = useState<string>("")
  const [strPhone, setStrPhone] = useState<string>("")
  const [alumno_phone, setPhone] = useState<number>(0)


  const fetchClases = async () => {
    const { data, error } = await supabase
    .from('clase')
    .select()

    if (error) {
      setError(error)
      setClases(null)
      console.error('Error fetching data:', error)

    }

    if (data) {
      setClases(data)
      setError(null)
    }
      }

  const addStudent = async (e : any) => {
    e.preventDefault()

  
    if (!alumno_name || !strPhone)
    {
      setError("Favor de llenar el valor de Nombre o telefono")
      return
    }

    const parsedPhone = Number(strPhone)
    if (isNaN(parsedPhone)) {
      setError("Teléfono inválido")
      return
    }
    setPhone(parsedPhone)

    setError(null)

   
    const estudiante: Student = { alumno_name, alumno_phone}


    console.log(estudiante)

    const { data, error } = await supabase
    .from("alumno")
    .insert([estudiante])
    .select()

    if(error)
    {
      if(error.code = "400")
      {
        alert("Error en alguna regla!!")
        return
      }
      alert(error.message)
    }
    
    if(data)
    {
      alert("Alumno creado correctamente")
      setName("")
      setStrPhone("")   
    }

  }

  const {data} = useSupabaseRead('alumnos')


useEffect(() => {
fetchClases()
  }, [])

  return(

    <>
    <div>
      <h1>Hitec Register</h1>
      <p>Welcome to the Hitec Register app!</p>
      <p>Check the console for Supabase client details.</p>
      <div className="Alumnos">
        {data?.map(alumno => (
          <div key={alumno.alumno_id}>
            <p>Nombre del alumno: {alumno.alumno_name}</p>
            <p>Teléfono del alumno: {alumno.alumno_phone}</p>
          </div>
        ))}
      </div>
      <div className="Clases">
        {clases?.map(clase => (
          <div key={clase.clase_id}>
            <p>Instructor de la clase: {clase.instructor}</p>
            <p>Fecha y hora de la clase: {clase.fecha_hora}</p>
            <p>Capacidad de la clase: {clase.capacidad_clase}</p>
            <p>Nombre de la clase: {clase.nombre_clase}</p>
          </div>
        ))}
      </div>

      <div className="AddAlumno">
        <h1>Favor de llenar los campos del alumno:</h1>
        <div>
        {error && (<h2>Error: {error?.toString()}</h2>)}        
      </div>
      <label>phone: </label>
        <input type="text" id="Student_phone" name="phone" value={strPhone} onChange={(e) => setStrPhone(e.target.value)}></input>
        <br></br>
        <label>Full name: </label>
        <input type="text" id="Student_name" name="Nombre" value={alumno_name} onChange={(e) => setName(e.target.value)}></input>
        <br></br>
        <button onClick={(e) => addStudent(e)}>Enviar datos</button>
      
      </div>
    </div>
    </>

  )

}
export default App


// Just while I do testing, I'll comment the whole page out

/*
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
*/