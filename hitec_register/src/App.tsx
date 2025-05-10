import supabase from './supabase/supabaseClient'
import { useEffect, useState } from 'react'
import { PostgrestError } from '@supabase/supabase-js'



const App = () => {
  const [error, setError] = useState<PostgrestError | null>(null)
  const [data, setData] = useState<any[] | null>(null)
  const [clases, setClases] = useState<any[] | null>(null)

  const fetchData = async () => {
    const { data, error } = await supabase
      .from('alumno')
      .select()
  
      if (error) {
        setError(error)
        setData(null)
        console.error('Error fetching data:', error)
   }
  
   if (data) {
     setData(data)
     setError(null)
     console.log('Data fetched successfully:', data)
   }
  }

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
  console.log('Data fetched successfully:', data)
}
  }


 useEffect(() => {

fetchClases(),
fetchData()
 }, [])

console.log("data:", data)
console.log("clases: ",clases)

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