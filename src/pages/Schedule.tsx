import './css/Schedule.css'
import { getSchedule } from '../lib/supabaseGetSchedule';
import { useUser } from '../hooks/useUserContext';
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Loading from '../components/Loading';
import GlassCard from '../components/GlassCard';



type Clase = {
    instructor: string;
    fecha_hora: string;
    nombre_clase: string;
    lugar: string;
};



const Schedule = () => {
    const { user } = useUser(); 
    const [data, setData] = useState<Clase[]>([])
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    
    const getData = async (id: string) => {
        setLoading(true);
        try {
        const result = await getSchedule(id);
        setData(result);
        setLoading(false);
        }
        catch (error) {
          console.error("Error fetching schedule:", error);
            setData([]); 
        setLoading(false);
        }
    }

    const goBack = () => {
        navigate("/home")
    }

    const transformTime = (date: string) => {
        const isoDate = date.replace(' ', 'T')
        const dateObj = new Date(isoDate)
        const options: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: 'UTC',
        hour12: false // Ensures 24-hour clock format
    }
    return dateObj.toLocaleString('es-MX', options)
    }

useEffect(() => {
    if (user){
        getData(user.alumno_id.toString())
    }
},[user]);

    return(
        <>
        <button onClick={goBack} style={{ position: "absolute", top: "10px", left: "10px" }}>Regresar</button>
        {loading ? <Loading /> : 
        <>
        <div>
            <h2 className="context">Toma una Screenshot de esto, es tu horario! Si tienes dudas acercate a cualquer miembro del staff</h2>
        </div>
        <GlassCard>
        <h1 className="title">Horario del usuario con ID: {user?.alumno_id}</h1>
                <GlassCard>

            <table className='table'>
                        <tr>
                            <th className='tableTitle'>Nombre de la clase</th>
                            <th className='tableTitleMid'>Lugar de la clase</th>
                            <th className='tableTitleMid'>Hora de la clase</th>
                            <th className='tableTitle'>Instructor de la clase</th>
                        </tr>
            {data.map((clase, index) => (
                        <tr key={index}>
                            <td className='tableEvent'>{clase.nombre_clase}</td>
                            <td className='tableEventMid'>{clase.lugar}</td>
                            <td className='tableEventMid'>{transformTime(clase.fecha_hora)}</td>
                            <td className='tableEvent'>{clase.instructor}</td>
                        </tr>
            ))}
            </table>
        </GlassCard>        
        </GlassCard>

        </>
        }
        
        </>
    )

}

export default Schedule;