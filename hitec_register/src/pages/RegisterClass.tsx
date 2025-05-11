import supabase from '../supabase/supabaseClient'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const RegisterClass = () => {
 const [instructor, setInstructor] = useState<string>("")
 const [fecha, setFecha] = useState<string>("")
 const [hora , setHora] = useState<string>("")
 const [capacidad_clase, setCapacidad] = useState<number>()   
 const [nombre_clase, setNombre] = useState<string>("")
  const navigate = useNavigate()


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
  }, [])

  return(

    <>
    <div>
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
        <button onClick={(e) => addClass(e)}>Enviar datos</button>
      </div>
      
    </div>
    </>

  )

}
export default RegisterClass

