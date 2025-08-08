import supabase from '../supabase/supabaseClient'
import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import supabaseGet from '../lib/supabaseGet'
import supabaseUpdate from '../lib/supabaseUpdate'
import transformDate from '../lib/transformDate'
import './css/Register.css'
import Swal from 'sweetalert2';
import GlassCard from '../components/GlassCard'
import { useUser } from '../hooks/useUserContext';

const RegisterClass = () => {
  const { user } = useUser();
const [id, setId] = useState<number | null>(null)
 const [instructor, setInstructor] = useState<string>("")
 const [fecha, setFecha] = useState<string>("")
 const [hora , setHora] = useState<string>("")
 const [area, setArea] = useState<string>("")
 const [lugar, setLugar] = useState<string>("")
 const [capacidad_clase, setCapacidad] = useState<number>(40)   
 const [nombre_clase, setNombre] = useState<string>("")
const navigate = useNavigate()
const location = useLocation();

  const retrieveClass = async (clase_id: number) => {
    const { data, error } = await supabaseGet("clase", "clase_id", clase_id)
    if (error) {
      alert(error.message)
      return
    }
    if (data) {
      //console.log(data)
      setId(data[0].clase_id)
      setInstructor(data[0].instructor)
      setFecha(data[0].fecha_hora.split("T")[0])
      setHora(transformDate(data[0].fecha_hora).split(" ")[1])
      setCapacidad(data[0].capacidad_clase)
      setNombre(data[0].nombre_clase)
      setArea(data[0].area)
      setLugar(data[0].lugar)
    }
  }


  const editClass = async (e : any) => {
    e.preventDefault()

    if (!instructor || !fecha || !hora || !capacidad_clase || !nombre_clase)
    {
        Swal.fire({
            title: "Favor de llenar el valor de Instructor, Fecha, Hora, Capacidad y/o Nombre de la clase!",
            icon: "error"
        })
      return
    }
    const result = await Swal.fire({
        text: "¿Estás segurx de que quieres editar la clase?",
        icon: "question",
        showCancelButton: true,
        cancelButtonText: "No",
        confirmButtonText: "Si"
            })
 
    if (result.isConfirmed) {
      
    const Clase = { instructor, fecha_hora: fecha + " " + hora, capacidad_clase, nombre_clase, area, lugar}
  
    if (id === null) {
        Swal.fire({
            text: "ID de la clase no válido.",
            icon: "error"
        })
      return
    }
    const { data, error } = await supabaseUpdate("clase", "clase_id", id, Clase)
    if (error) {
      alert(error.message)
      return
    }
    if (data) {
        Swal.fire({
            text: "Clase editada correctamente.",
            icon: "success"
        })
        navigate("/admin") 
        }
    }

  }


  const addClass = async (e : any) => {
    e.preventDefault()


    if (!instructor || !fecha || !hora || !capacidad_clase || !nombre_clase)
    {
        Swal.fire({
            text: "Favor de llenar el valor de Instructor, Fecha, Hora, Capacidad y/o Nombre de la clase!",
            icon: "error"
        })
      
      return
    }

    
    const Clase = { instructor, fecha_hora: fecha + " " + hora, capacidad_clase, nombre_clase, area, lugar}


    console.log(Clase)
    const result = await Swal.fire({
        text: "¿Estas segurx de que quieres crear la clase?",
        icon: "question",
        showCancelButton: true,
        cancelButtonText: "No",
        confirmButtonText: "Si"
            })
 
    if (result.isConfirmed) {

    const { data, error } = await supabase
    .from("clase")
    .insert([Clase])
    .select()

    if(error)
    {
      if(error.code = "400")
      {
        Swal.fire({
            text: "Error en algúna regla!!",
            icon: "error"
        })
        return
      }
      alert(error.message)
    }
    
    if(data)
    {
        Swal.fire({
            text: "Clase creada correctamente.",
            icon: "success"
        })
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

    if (user?.alumno_id !== 1) {
        navigate("/")
      }

    if(location.state)
  {
    retrieveClass(location.state.clase_id)
  }

  }, [location.state])

  return(

    <>
    <div>
      <div style={{ position: "absolute", top: "10px", left: "10px" }}>
      <button onClick={() => navigate("/admin")}>Regresar</button>
      </div>
      <GlassCard>
      <img src="../../logo.webp" alt="Logo HiTec" style={{ position: "relative", top: "10px", width: "10%", }} />
      <h1>Registro de clases</h1>
      <p>Hola Snev o miembro del Staff. Por favor den de alta la clase que gusten</p>
      <div>
        <div className="Card">
          <h3 className="TitleText">Nombre del instructor</h3>
          <input className="FillText" type="text" id="instructor_name" name="instructor_name" value={instructor} onChange={(e) => setInstructor(e.target.value)} placeholder='Osito Snev'></input>
        </div>
        <div className="Card">
          <h3 className="TitleText">Fecha de la clase:</h3>
          <input className="FillText" type="date" id="fecha" name="fecha" value={fecha} onChange={(e) => setFecha(e.target.value)} placeholder='30/03/2003'></input>
        </div>
        <div className="Card">
          <h3 className="TitleText">Hora de la clase:</h3>
            <input className="FillText" type="time" id="hora" name="hora" value={hora} onChange={(e) => setHora(e.target.value)} placeholder='15:50'></input>
        </div>
        <div className="Card">
          <h3 className="TitleText">Area de la clase:</h3>
          <input className="FillText" type="text" id="area" name="area" value={area} onChange={(e) => setArea(e.target.value)} placeholder='Deportes'></input>
        </div>
        <div className="Card">
          <h3 className="TitleText">Lugar de la clase:</h3>
          <input className="FillText" type="text" id="lugar" name="lugar" value={lugar} onChange={(e) => setLugar(e.target.value)} placeholder='Salón 1'></input>
        </div>
        <div className="Card">
          <h3 className="TitleText">Capacidad de la clase:</h3>
          <input className="FillText" type="text" id="capacidad_clase" name="capacidad_clase" value={capacidad_clase} onChange={(e) => setCapacidad(Number(e.target.value))} placeholder='5132'></input>
        </div>
        <div className="Card">
          <h3 className="TitleText">Nombre de la clase:</h3>
          <input className="FillText"type="text" id="nombre_clase" name="nombre_clase" value={nombre_clase} onChange={(e) => setNombre(e.target.value)} placeholder='Odiamos Tecmed la vuelta'></input>
        </div>
          {id ? <button onClick={editClass}>Modificar Clase</button> : <button onClick={addClass}>Crear Clase</button>}
      
      </div>
      </GlassCard>
    </div>
    </>

  )

}
export default RegisterClass

