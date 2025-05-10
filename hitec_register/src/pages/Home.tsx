import { useEffect, useState } from 'react'
import  supabaseGet  from '../lib/supabaseGet'
import {useLocation } from 'react-router-dom';
import useSupabaseRead from '../hooks/useSupabaseRead';

const Home = () => {
    const [id, setId] = useState<number | null >(null)
    const [name, setName] = useState<string | null>(null)
    const [phone, setPhone] = useState<number>(0)
    const location = useLocation()


    
    
    const getStudent = async () => {
        const { data, error }: { data: { alumno_id: number; alumno_name: string }[] | null; error: any } = await supabaseGet("alumno", "alumno_phone", phone);
        if (error) {
            alert("Mensaje de error!!! " + error.message);
            return;
        }
        if (data) {
            setId(data[0].alumno_id);
            setName(data[0].alumno_name);
        } else {
            alert("No se encontró el número de teléfono");
        }
    };

    const handleSubmit =  () => {
       alert("Datos enviados: " + id + " " + name + " " + phone)
    };

    const { data, error }: { data: Class[] | null; error: any } = useSupabaseRead("clase")
    if (error) {
        console.error('Error fetching data:', error)
    }

useEffect(() => {
       const query = new URLSearchParams(location.search);
       setPhone(Number(query.get("phone")));
       getStudent();
   }, [id, name, phone]);


    return (
        <>
        <div>
            <h1>Bienvenido {name}</h1>
            <h2>Por favor, verifica tus clases.</h2>
            <div>
            <select>
                <option value="">Selecciona una clase</option>
 {data?.map((Class, index) => (
                    <option key={`${Class.clase_id}-${index}`} value={Class.clase_id}>
                    profesor: {Class.instructor} <br></br>
                        nombre de la clase: {Class.nombre_clase} <br></br>
                        fecha y hora: {Class.fecha_hora} <br></br>
                        capacidad de la clase: {Class.capacidad_clase} <br></br>
                    </option>
                ))}

            </select>
            <br></br>
            <select>
               <option value="">Selecciona una clase</option>
 {data?.map((Class, index) => (
                    <option key={`${Class.clase_id}-${index}`} value={Class.clase_id}>
                    profesor: {Class.instructor} <br></br>
                        nombre de la clase: {Class.nombre_clase} <br></br>
                        fecha y hora: {Class.fecha_hora} <br></br>
                        capacidad de la clase: {Class.capacidad_clase} <br></br>
                    </option>
                ))}

            </select>
            <br></br>
            <select>
               <option value="">Selecciona una clase</option>
    {data?.map((Class, index) => (
                    <option key={`${Class.clase_id}-${index}`} value={Class.clase_id}>
                    profesor: {Class.instructor} <br></br>
                        nombre de la clase: {Class.nombre_clase} <br></br>
                        fecha y hora: {Class.fecha_hora} <br></br>
                        capacidad de la clase: {Class.capacidad_clase} <br></br>
                    </option>
                ))}

            </select>
            <br></br>
            <select>
               <option value="">Selecciona una clase</option>
         {data?.map((Class, index) => (
                    <option key={`${Class.clase_id}-${index}`} value={Class.clase_id}>
                    profesor: {Class.instructor} <br></br>
                        nombre de la clase: {Class.nombre_clase} <br></br>
                        fecha y hora: {Class.fecha_hora} <br></br>
                        capacidad de la clase: {Class.capacidad_clase} <br></br>
                    </option>
                ))}
            </select>
            <br></br>
            <select>
               <option value="">Selecciona una clase</option>
               {data?.map((Class, index) => (
                    <option key={`${Class.clase_id}-${index}`} value={Class.clase_id}>
                    profesor: {Class.instructor} <br></br>
                        nombre de la clase: {Class.nombre_clase} <br></br>
                        fecha y hora: {Class.fecha_hora} <br></br>
                        capacidad de la clase: {Class.capacidad_clase} <br></br>
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