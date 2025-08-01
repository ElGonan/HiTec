import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Loading from '../components/Loading';
import './css/Home.css';
import supabase from '../supabase/supabaseClient';
import supabaseUpdate from '../lib/supabaseUpdate';
import supabaseDelete from '../lib/supabaseDelete';
import Swal from 'sweetalert2';
import { useUser } from '../hooks/useUserContext';
import GlassCard from '../components/GlassCard';
import supabaseGet from '../lib/supabaseGet';




// cmd + d to select all instances of the same variable
// option + cmd to increase the size of the cursor

const INSCRIPTIONLIMIT = 4;

// This variables are for the color of the buttons
const buttonColors = {
    1: "#b8eadf", // aquamarine
    2: "#ffd902", // yellow
    3: "#f7a305", // orange
    4: "#fd7a5c", // secondary orange
};


const Home = () => {
    const { logout, user } = useUser();
    const [id, setId] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [disableClasses, setDisableClasses] = useState<{ [key: number]: boolean }>({
        10: false,
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
        10: false,
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

    const setClassesDirectas = () => {
        const clases: string[] | undefined = [];
        if (!user) {
            return [];
        }
        clases.push(user?.alumno_class_1);
        clases.push(user?.alumno_class_2);

        const horas: string[] = clases
            .filter((hora): hora is string => typeof hora === 'string' && hora !== null)
            .map((hora) => hora.split(':')[0]);
        return horas;
    }
    /*
    Esta función es epecial. Obtiene todas las clases de un alumno en una hora determinada.
    Se usa para desactivar los botones de las clases a las que ya está inscrito.

    Además de eso, también me da la capacidad de cada clase.
    */

    const retrieveData = async (alumno_id: number) => {
        setLoading(true); 
        setId(user?.alumno_id);
        const horasDirectas = setClassesDirectas();
        // agarraremos ambas clases del alumno, las que son alumno_class_1 y alumno_class_2
        // para bloquearlas en la pantalla de inicio.

        const { data, error } = await supabase
            .from("alumno_clase")
            .select("clase(fecha_hora, capacidad_clase, clase_id), alumno(alumno_name)")
            .eq("alumno_id", alumno_id)
        
        if (error) {
            //console.log("Error al recuperar los datos: " + error.message);
            setLoading(false); 
            return;
        }

        if (data.length == 0){
            setLoading(false); 
            setSeeScheduleButton(false);
            checkInscriptions(horasDirectas.map(Number));
            return;
        } else {
            setSeeScheduleButton(true);
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
            //console.log("Horas de inscripción:", times);
            const totalTimes = horasDirectas.map(Number).concat(times);
            checkInscriptions(totalTimes);

        const classCapacities = data.map(row =>
            row.clase ? row.clase.capacidad_clase : null
        ).filter((capacity): capacity is number => capacity !== null);
        setClassCapacities(classCapacities);
        //console.log("Capacidades de las clases:", classCapacities);

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
        // obtener el valor de la clase secreta
        const {data, error} = await supabaseGet("alumno", "alumno_id", "1");
        if (error) {
            Swal.fire({
            title: "Error al intentar eliminar clases",
            text: error.message,
            icon: 'error',
            })
        }
        
        //console.log(data[0]?.alumno_class_1 !== null)

        if (data[0]?.alumno_class_1 !== null) {
            Swal.fire({
                title: "Eliminar clases bloqueado",
                text: "El espacio para eliminar clases ha sido cerrado. Acercate a un miembro de staff si tienes dudas.",
                icon: 'warning',
            })

            return;
        }



        const result = await Swal.fire({
            title: "¿Segurx que deseas borrar tu inscripcion?",
            text: "Esta acción no se puede deshacer. Si continúas, deberás volver a inscribirte manualmente. Además, recuerda que no puedes eliminar las clases de Mentoría y Academia.",
            icon: 'warning',
            showCancelButton: true,
            cancelButtonText: 'No',
            confirmButtonText: 'Si'
        })
        if (result.isConfirmed) {
            if (classID.length === 0) {
                Swal.fire({
                    title: "¡No tienes inscripciones!",
                    text: "Recuerda que las clases de Mentoría y Academia no se pueden eliminar.",
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
            const { error } = await supabaseUpdate("clase", "clase_id",classID[i], {capacidad_clase: newCapacities[i]});
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
                10: false,
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
            setClassID([]);
            const horasDirectas = setClassesDirectas();
            checkInscriptions(horasDirectas.map(Number));
            setLoading(false); // Stop loading
    }}

    const goToSchedule = () =>
    {
        navigate("/schedule")
    }


useEffect(() => {   

    if (user) {
    setClassesDirectas();
    retrieveData(user?.alumno_id);
    }
}, [user]);


    return (
        <div>
            {loading ? (<Loading /> ) :
            <div>
                <GlassCard>
                    <div style={{display: "flex", flexDirection:"column", alignItems: "center", margin: 0, padding:"10px"}}>
                    <img src="../../logo.webp" alt="Logo HiTec" style={{ width: "30%", }} />
                    <span style={{fontSize:'24px', fontWeight: 'bold'}}>Arma tu horario</span>
                    <p style={{ margin: 0, padding: 0}}>Selecciona el bloque que deseas inscribir</p>
                    </div>
                    
                    {fullInscription && (
                        <p style={{ color: "red",  margin: ".5rem", padding: 0}}>No puedes inscribirte a más de {INSCRIPTIONLIMIT} clases.</p>
                    )}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
                        {[10, 11, 12, 13].map((hour, index) => (
                            <button
                            key={hour}
                            className="TimeButton"
                            style={{ '--hover-bg-color': buttonColors[index + 1] } as React.CSSProperties}
                            onClick={() => goToArea(hour)}
                            disabled={disableClasses[hour]}
                            >
                        {`${hour}:00`}
                        </button>
                    ))}
                    </div>
                    {seeScheduleButton ? 
                    <a onClick={goToSchedule} style={{ color: "#ff8c24", textDecoration: "underline", cursor: "pointer", padding: "6px 0px",  display: "block", fontSize:"16px"}}>
                    Ver mi horario
                    </a> : null}
                </GlassCard>
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "20px", gap: "32px" }}>
                    <button onClick={getOut} style={{  fontSize:"14px", backgroundColor: "#ff8c24", color:"white"}}>Cerrar Sesión</button>
                    <button onClick={deleteInscription} style={{fontSize:"14px", backgroundColor: "#ff8c24", color:"white"}} >Borrar inscripción</button>
                </div>
            </div>
            }
        </div>
    );
};

export default Home;
