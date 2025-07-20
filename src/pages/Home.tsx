import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Loading from '../components/Loading';
import './css/Home.css';
import supabase from '../supabase/supabaseClient';
import supabaseUpdate from '../lib/supabaseUpdate';
import supabaseDelete from '../lib/supabaseDelete';
import supabaseGet from '../lib/supabaseGet';
import Swal from 'sweetalert2';
import { useUser } from '../hooks/useUserContext';
import GlassCard from '../components/GlassCard';




// cmd + d to select all instances of the same variable
// option + cmd to increase the size of the cursor

const INSCRIPTIONLIMIT = 4;

// This variables are for the color of the buttons
const buttonColors = {
    1: "#FF5733", // Red
    2: "#33FF57", // Green
    3: "#3357FF", // Blue
    4: "#FF33A1", // Pink
    5: "#FFA533" , // Orange
    6: "#FF33FF"  // Purple
};


const Home = () => {
    const { logout, user } = useUser();
    const [id, setId] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [disableClasses, setDisableClasses] = useState<{ [key: number]: boolean }>({
        11: false,
        12: false,
        13: false,
        14: false,
        15: false,
        16: false,
        17: false,
    });
    const [ classID, setClassID ] = useState<number[]>([]); // Variable to store the class ID
    const [ classCapacities, setClassCapacities ] = useState<number[]>([]); // Array to store class capacities
    const navigate = useNavigate();
    const [ fullInscription, setFullInscription ] = useState<boolean>(false);
    const [ seeScheduleButton, setSeeScheduleButton ] = useState<boolean>(false);
    const [userClassData, setUserClassData] = useState<unknown>(null);


    const checkInscriptions = (inscriptionHours: number[]) => {
        setLoading(true); // Start loading
        const newDisableClasses: { [key: number]: boolean } = {
        11: false,
        12: false,
        13: false,
        14: false,
        15: false,
        16: false,
        17: false,
        };

        // Desactiva los botones según las horas inscritas
        inscriptionHours.forEach((hour) => {
            if (newDisableClasses.hasOwnProperty(hour)) {
                newDisableClasses[hour] = true;
            }
        });

        // Si ya llegó al límite, desactiva todo
        if (inscriptionHours.length >= INSCRIPTIONLIMIT) {
            Object.keys(newDisableClasses).forEach((key) => {
                newDisableClasses[Number(key)] = true;
            });
            setFullInscription(true);
        }

        setDisableClasses(newDisableClasses);
        setLoading(false); // Stop loading
    };



    const goToArea = (time: number) => {
        navigate("/area", {
            state: {
                time: time,
            }});
    }

    /*
    Esta función es epecial. Obtiene todas las clases de un alumno en una hora determinada.
    Se usa para desactivar los botones de las clases a las que ya está inscrito.

    Además de eso, también me da la capacidad de cada clase.
    */

    const retrieveData = async (alumno_id: number) => {
        setLoading(true); 
        setId(user?.alumno_id);
        const { data, error } = await supabase
            .from("alumno_clase")
            .select("clase(fecha_hora, capacidad_clase, clase_id), alumno(alumno_name)")
            .eq("alumno_id", alumno_id)
        
        if (error) {
            console.log("Error al recuperar los datos: " + error.message);
            setLoading(false); 
            return;
        }

        if (data.length == 0){
            setLoading(false); 
            setSeeScheduleButton(false);
            return;
        } else {
            setSeeScheduleButton(true);
            console.log(data);
            setUserClassData(data);
        }


        if (data) {
        const times = data.map(row => {
            // row.clase se espera que sea un array
            if (row.clase) {
                // Extrae los dos dígitos después de la 'T'
                const match = row.clase.fecha_hora.match(/T(\d{2})/);
                return match ? Number(match[1]) : null;
            }
            return null;
            }).filter((hour): hour is number => hour !== null);
            checkInscriptions(times);

        const classCapacities = data.map(row =>
            row.clase ? row.clase.capacidad_clase : null
        ).filter((capacity): capacity is number => capacity !== null);
        setClassCapacities(classCapacities);

        const classIDs = data.map(row =>
            row.clase ? row.clase.clase_id : null
        ).filter((id): id is number => id !== null);
        setClassID(classIDs);
        setLoading(false); 
        }
    }
    


    const getOut = async () => {
        const result = await Swal.fire({
            text: "¿Segurx que deseas cerrar tu sesión?",
            icon: 'question',
            showCancelButton: true,
            cancelButtonText: 'No',
            confirmButtonText: 'Si'
        })
        if (result.isConfirmed) {
            await logout();
            navigate("/");
        }
    };

    const deleteInscription = async () => {
        const result = await Swal.fire({
            title: "¿Segurx que deseas borrar tu inscripcion?",
            text: "Esto no se puede deshacer, deberás volver a inscribirte.",
            icon: 'warning',
            showCancelButton: true,
            cancelButtonText: 'No',
            confirmButtonText: 'Si'
        })
        if (result.isConfirmed) {
            if (classID.length === 0) {
                Swal.fire({
                    title: "¡No tienes inscripciones!",
                    icon: "error"
                })
                return;
            }
            setLoading(true); // Start loading
            const newCapacities = [...classCapacities];
            for (let i = 0; i < newCapacities.length; i++) {
                newCapacities[i] = newCapacities[i] + 1;
            }
            for (let i = 0; i < classID.length; i++) {
            const { error } = await supabaseUpdate("clase", "clase_id", i, { capacidad_clase: newCapacities[i] });
            if (error) {
                alert("Error al actualizar la capacidad de la clase: " + error.message);
                return;
            }
            }
            const { error } = await supabaseDelete("alumno_clase", "alumno_id", id!);
            if (error) {
                alert(error.message);
                setLoading(false); // Stop loading on error
                return;
            }
            Swal.fire({
                    title: "Inscripción borrada correctamente.",
                    icon: "success"
                });
            setDisableClasses({
                11: false,
                12: false,
                13: false,
                14: false,
                15: false,
                16: false,
                17: false
            });
            setFullInscription(false);
            setSeeScheduleButton(false);
            setLoading(false); // Stop loading
    }}

    const goToSchedule = () =>
    {
        navigate("/schedule")
    }


useEffect(() => {
    retrieveData(user?.alumno_id);
}, [user]);


    return (
        <div>
            <button onClick={getOut} style={{ position: "absolute", top: "10px", left: "10px" }}>Cerrar Sesión</button>
            <button onClick={deleteInscription} style={{ position: "absolute", top: "10px", right: "10px" }} >Borrar inscripción</button>
            {loading ? (<Loading /> ) :
        
        <>
            <GlassCard>
                <img src="../../logo.webp" alt="Logo HiTec" style={{ position: "relative", top: "32px", width: "10%", }} />
                <h1>Bienvenidx</h1>
                <h2>Por favor, Selecciona un horario para tu clase</h2>
                {fullInscription && (
                    <div>
                        <p style={{ color: "red" }}>No puedes inscribirte a más de {INSCRIPTIONLIMIT} clases.</p>
                    </div>)}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <table style={{ borderCollapse: "collapse", textAlign: "center" }}>
                    <tbody>
                    <tr>
                    <td className="Time">
                        <button 
                        className="TimeButton" 
                        style={{ '--hover-bg-color': buttonColors[1] } as React.CSSProperties}
                        onClick={() => goToArea(13)}
                        disabled={disableClasses[13]}>
                        13:00</button>
                        </td>
                    <td className="Time">
                        <button 
                        className="TimeButton" 
                        style={{ '--hover-bg-color': buttonColors[2] } as React.CSSProperties}
                        onClick={() => goToArea(15)}
                        disabled={disableClasses[15]}>
                        15:00</button>
                        </td>
                    </tr>
                    <tr>
                    <td className="Time">
                        <button 
                        className="TimeButton" 
                        style={{ '--hover-bg-color': buttonColors[3] } as React.CSSProperties}
                        onClick={() => goToArea(16)}
                        disabled={disableClasses[16]}>
                        16:00</button>
                        </td>
                    <td className="Time">
                        <button 
                        className="TimeButton"
                        style={{ '--hover-bg-color': buttonColors[4] } as React.CSSProperties}
                        onClick={() => goToArea(17)}
                        disabled={disableClasses[17]}>
                        17:00</button>
                        </td>
                    </tr>
                    {/* <tr>
                    <td className="Time">
                        <button 
                        className="TimeButton" 
                        style={{ '--hover-bg-color': buttonColors[5] } as React.CSSProperties}
                        onClick={() => goToArea(15)}
                        disabled={disableClasses[15]}>
                        15:00</button>
                        </td>
                    <td className="Time">
                        <button 
                        className="TimeButton" 
                        style={{ '--hover-bg-color': buttonColors[6] } as React.CSSProperties}
                        onClick={() => goToArea(16)}
                        disabled={disableClasses[16]}>
                        16:00</button>
                        </td>
                    </tr> */}
                    </tbody>
                </table>
                </div>
                {seeScheduleButton ? 
                <button onClick={goToSchedule} >Ver mi horario</button> : <></>}
            </GlassCard>
            </>
        }
            
        </div>
    );
};

export default Home;
