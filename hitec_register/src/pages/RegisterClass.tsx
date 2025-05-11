import supabase from '../supabase/supabaseClient'
import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import supabaseGet from '../lib/supabaseGet'
import supabaseUpdate from '../lib/supabaseUpdate'

const RegisterClass = () => {
const [id, setId] = useState<number | null>(null)
 const [instructor, setInstructor] = useState<string>("")
 const [fecha, setFecha] = useState<string>("")
 const [hora , setHora] = useState<string>("")
 const [capacidad_clase, setCapacidad] = useState<number>(40)   
 const [nombre_clase, setNombre] = useState<string>("")
const navigate = useNavigate()
const location = useLocation();


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


  const retrieveClass = async (clase_id: number) => {
    const { data, error } = await supabaseGet("clase", "clase_id", clase_id)
    if (error) {
      alert(error.message)
      return
    }
    if (data) {
      console.log(data)
      setId(data[0].clase_id)
      setInstructor(data[0].instructor)
      setFecha(data[0].fecha_hora.split("T")[0])
      setHora(transformDate(data[0].fecha_hora).split(" ")[1])
      setCapacidad(data[0].capacidad_clase)
      setNombre(data[0].nombre_clase)
    }
  }


  const editClass = async (e : any) => {
    e.preventDefault()

    if (!instructor || !fecha || !hora || !capacidad_clase || !nombre_clase)
    {
      alert("Favor de llenar el valor de Instructor, Fecha, Hora, Capacidad o Nombre de la clase")
      return
    }

    if (window.confirm("¿Estas seguro de que quieres editar la clase?")) {
      
    const Clase = { instructor, fecha_hora: fecha + " " + hora, capacidad_clase, nombre_clase}
  
    if (id === null) {
      alert("ID de la clase no es válido.")
      return
    }
    const { data, error } = await supabaseUpdate("clase", "clase_id", id, Clase)
    if (error) {
      alert(error.message)
      return
    }
    if (data) {
    alert("Clase editada correctamente")
     navigate("/admin") 
    }
    }

  }


  const addClass = async (e : any) => {
    e.preventDefault()


    if (!instructor || !fecha || !hora || !capacidad_clase || !nombre_clase)
    {
      alert("Favor de llenar el valor de Instructor, Fecha, Hora, Capacidad o Nombre de la clase")
      return
    }

    
    const Clase = { instructor, fecha_hora: fecha + " " + hora, capacidad_clase, nombre_clase}


    console.log(Clase)

    if (window.confirm("¿Estas seguro de que quieres crear la clase?")) {

    const { data, error } = await supabase
    .from("clase")
    .insert([Clase])
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
      alert("Clase creada correctamente")
      setInstructor("")
        setFecha("")
        setHora("")
        setCapacidad(0)
        setNombre("")
      navigate("/admin")
        return
    }

  }

  }
useEffect(() => {
    if(location.state)
  {
    retrieveClass(location.state.clase_id)
  }

  }, [location.state])

  return(

    <>
    <div>
      {/* Quiero que el boton de regresar este arrib a la izquierda*/}
      <div style={{ position: "absolute", top: "10px", left: "10px" }}>
      <button onClick={() => navigate("/admin")}>Regresar</button>
      </div>
      <h1>Registro de clases</h1>
      <p>Hola Snev o miembro del Staff. Por favor den de alta la clase que gusten</p>
      <div>
        <h3>Nombre del instructor:</h3>
        <input type="text" id="instructor_name" name="instructor_name" value={instructor} onChange={(e) => setInstructor(e.target.value)} placeholder='Osito Snev'></input>
        <h3>Fecha de la clase:</h3>
        <input type="date" id="fecha" name="fecha" value={fecha} onChange={(e) => setFecha(e.target.value)} placeholder='30/03/2003'></input>
        <h3>Hora de la clase:</h3>
        <input type="time" id="hora" name="hora" value={hora} onChange={(e) => setHora(e.target.value)} placeholder='15:50'></input>
        <h3>Capacidad de la clase:</h3>
        <input type="text" id="capacidad_clase" name="capacidad_clase" value={capacidad_clase} onChange={(e) => setCapacidad(Number(e.target.value))} placeholder='5132'></input>
        <h3>Nombre de la clase:</h3>
        <input type="text" id="nombre_clase" name="nombre_clase" value={nombre_clase} onChange={(e) => setNombre(e.target.value)} placeholder='Odiamos Tecmed la vuelta'></input>
        <br></br>
        <br></br>
        {id ? <button onClick={editClass}>Modificar Clase</button> : <button onClick={addClass}>Crear Clase</button>}
        
      </div>
      
    </div>
    </>

  )

}
export default RegisterClass

