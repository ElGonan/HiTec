import { useEffect, useState } from 'react'
import  supabaseGet  from '../lib/supabaseGet'
import {useLocation, useNavigate } from 'react-router-dom';
import useSupabaseRead from '../hooks/useSupabaseRead';
import SupabaseInscription from '../lib/supabaseInscription';

const Home = () => {
    const [id, setId] = useState<number | null >(null)
    const [name, setName] = useState<string | null>(null)
    const location = useLocation()
    const [clase1, setClase1] = useState<number | null>(null)
    const [clase2, setClase2] = useState<number | null>(null)
    const [clase3, setClase3] = useState<number | null>(null)
    const [clase4, setClase4] = useState<number | null>(null)
    const [clase5, setClase5] = useState<number | null>(null)
    const [errorInscription, setErrorInscription] = useState<string | null>(null)
    const navigate = useNavigate()

    const getOut = () => {
        if (window.confirm("¿Seguro que deseas cerrar sesión?")) {
            navigate("/")
                }
    }

    const handleInscription = async (clase_id: number) => {
        const { data, error } = await SupabaseInscription(id!, clase_id);
        if (error) {
            setErrorInscription(error.message);
            return;
        }
        if (data) {
          return 1;
        }
    }

    const handleSubmit =  () => {
       if (window.confirm("Seguro que deseas inscribirte a las clases seleccionadas?"))
         {
          if (clase1) {
                handleInscription(clase1);
          }
          if (clase2) {
                handleInscription(clase2);
          }
          if (clase3) {
                handleInscription(clase3);
          }
          if (clase4) {
                handleInscription(clase4);
          }
          if (clase5) {
                handleInscription(clase5);
          }
          if (!errorInscription) {
            alert("Inscripción exitosa");
          } else {
            alert("Error en la inscripción: " + errorInscription);
          }
         }
    };

    const { data, error }: { data: Class[] | null; error: any } = useSupabaseRead("clase")    
    if (error) {
        console.error('Error fetching data:', error)
    }

useEffect(() => {
   const query = new URLSearchParams(location.search);
   const phoneFromQuery = Number(query.get("phone"));
   if (phoneFromQuery) {
       supabaseGet("alumno", "alumno_phone", phoneFromQuery).then(({ data, error }) => {
           if (error) {
               alert("Mensaje de error!!! " + error.message);
               return;
           }
           if (data && data.length > 0) {
               setId(data[0].alumno_id);
               setName(data[0].alumno_name);
           } else {
               alert("No se encontró el número de teléfono");
           }
       });
   }
}, [location.search]);



    return (
        <>
        <div>
          <div>
          <button onClick={getOut} style={{ position: "absolute", top: "10px", left: "10px" }} >Cerrar Sesión</button>
        </div>
            <h1>Bienvenido {name}</h1>
            <h2>Por favor, verifica tus clases.</h2>
            <div>
            <select value={clase1 ?? ""} onChange={(e) => setClase1(Number(e.target.value))}>
  <option value="">Selecciona una clase</option>
  {data?.map((Class, index) => (
    <option key={`${Class.clase_id}-${index}`} value={Class.clase_id}>
      {Class.nombre_clase} (Prof: {Class.instructor}) Fecha y hora: {Class.fecha_hora}
    </option>
  ))}
</select>
            <br></br>
           <select value={clase2 ?? ""} onChange={(e) => setClase2(Number(e.target.value))}>
  <option value="">Selecciona una clase</option>
  {data?.map((Class, index) => (
    <option key={`${Class.clase_id}-${index}`} value={Class.clase_id}>
      {Class.nombre_clase} (Prof: {Class.instructor}) Fecha y hora: {Class.fecha_hora}
    </option>
  ))}
</select>
            <br></br>
            <select value={clase3 ?? ""} onChange={(e) => setClase3(Number(e.target.value))}>
  <option value="">Selecciona una clase</option>
  {data?.map((Class, index) => (
    <option key={`${Class.clase_id}-${index}`} value={Class.clase_id}>
      {Class.nombre_clase} (Prof: {Class.instructor}) Fecha y hora: {Class.fecha_hora}
    </option>
  ))}
</select>
            <br></br>
          <select value={clase4 ?? ""} onChange={(e) => setClase4(Number(e.target.value))}>
  <option value="">Selecciona una clase</option>
  {data?.map((Class, index) => (
    <option key={`${Class.clase_id}-${index}`} value={Class.clase_id}>
      {Class.nombre_clase} (Prof: {Class.instructor}) Fecha y hora: {Class.fecha_hora}
    </option>
  ))}
</select>
            <br></br>
           <select value={clase5 ?? ""} onChange={(e) => setClase5(Number(e.target.value))}>
  <option value="">Selecciona una clase</option>
  {data?.map((Class, index) => (
    <option key={`${Class.clase_id}-${index}`} value={Class.clase_id}>
      {Class.nombre_clase} (Prof: {Class.instructor}) Fecha y hora: {Class.fecha_hora}
    </option>
  ))}
</select>
            <br></br>
            <br></br>
            <button onClick={handleSubmit}>Inscribirme a clase</button>
            </div>
        </div>
       
        </>
    )
}

export default Home