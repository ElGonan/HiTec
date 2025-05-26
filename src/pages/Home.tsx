import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import supabaseGet from '../lib/supabaseGet';
import Loading from '../components/Loading';
import './css/Home.css';
import supabase from '../supabase/supabaseClient';
import supabaseUpdate from '../lib/supabaseUpdate';
import supabaseDelete from '../lib/supabaseDelete';

// cmd + d to select all instances of the same variable
// option + cmd to increase the size of the cursor

let INSCRIPTIONLIMIT = 5;

// This variables are for the color of the buttons
const buttonColors = {
    1: "#FF5733", // Red
    2: "#33FF57", // Green
    3: "#3357FF", // Blue
    4: "#FF33A1", // Pink
    5: "#FFA533" , // Orange
    6: "#FF33FF"  // Purple
};

type LocationState = {
  alumno_id?: number;
  time?: number;
};

const Home = () => {
    const [id, setId] = useState<number | null>(null);
    const [name, setName] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [disableClasses, setDisableClasses] = useState<{ [key: number]: boolean }>({
        11: false,
        12: false,
        13: false,
        14: false,
        15: false,
        16: false
    });
    const [ classID, setClassID ] = useState<number[]>([]); // Variable to store the class ID
    const [ classCapacities, setClassCapacities ] = useState<number[]>([]); // Array to store class capacities
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state as LocationState;
    const [ fullInscription, setFullInscription ] = useState<boolean>(false);


    const checkInscriptions = (inscriptionHours: number[]) => {
        setLoading(true); // Start loading
        const newDisableClasses: { [key: number]: boolean } = {
        11: false,
        12: false,
        13: false,
        14: false,
        15: false,
        16: false
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
        console.log(id, time);
        navigate("/area", {
            state: {
                alumno_id: id,
                time: time,
            }});
    }

    /*
    Esta función es epecial. Obtiene todas las clases de un alumno en una hora determinada.
    Se usa para desactivar los botones de las clases a las que ya está inscrito.

    Además de eso, también me da la capacidad de cada clase.
    */

    const retrieveData = async (alumno_id: number) => {
        setLoading(true); // Start loading
        setId(alumno_id);
        const { data, error } = await supabase
            .from("alumno_clase")
            .select("clase(fecha_hora, capacidad_clase, clase_id)")
            .eq("alumno_id", alumno_id)
        
        if (error) {
            alert("Error al recuperar los datos: " + error.message);
            setLoading(false); // Stop loading
            return;
        }

        if (data) {
    const times = data.map(row => {
    if (row.clase && typeof row.clase.fecha_hora === "string") {
        // Extrae los dos dígitos después de la 'T'
        const match = row.clase.fecha_hora.match(/T(\d{2})/);
        return match ? match[1] : null;
        }
        return null;
    }).filter((hour): hour is string => hour !== null);
    checkInscriptions(times);

        const classCapacities = data.map(row =>
            row.clase ? row.clase.capacidad_clase : null
            ).filter((capacity): capacity is number => capacity !== null)
        setClassCapacities(classCapacities);

        const classIDs = data.map(row =>
            row.clase ? row.clase.clase_id : null
            ).filter((id): id is number => id !== null)
        setClassID(classIDs);
        setLoading(false); // Stop loading
        }
    }


    const getOut = () => {
        if (window.confirm("¿Seguro que deseas cerrar sesión?")) {
            navigate("/");
        }
    };

    const deleteInscription = async () => {
        if (window.confirm("¿Seguro que deseas borrar la inscripción?")) {
            if (classID.length === 0) {
                alert("No tienes inscripciones!!! mañoso");
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
            alert("Inscripción borrada correctamente");
            setDisableClasses({
                11: false,
                12: false,
                13: false,
                14: false,
                15: false,
                16: false
            });
            setFullInscription(false);
            setLoading(false); // Stop loading
    }}

useEffect(() => {
    const query = new URLSearchParams(location.search);
    const phoneFromQuery = Number(query.get("phone"));

    // Paso 1: Si viene el teléfono en la query
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

    // Paso 2: Si viene algo en location.state
    if (location.state) {
        const { alumno_id } = location.state;

        // Ejecuta la lógica de recuperación
        if (alumno_id) {
            retrieveData(alumno_id);
        }

    }
}, [location.search, location.state]);


    return (
        <div>
            {loading && (
                <Loading />
            )}
            <>
            <button onClick={getOut} style={{ position: "absolute", top: "10px", left: "10px" }}>Cerrar Sesión</button>
            <img src="../../logo.webp" alt="Logo HiTec" style={{ position: "relative", top: "32px", width: "10%", }} />
            <button onClick={deleteInscription} style={{ position: "absolute", top: "10px", right: "10px" }} >Borrar inscripción</button>
            <h1>Bienvenidx {name}</h1>
            <h2>Por favor,Selecciona un horario.</h2>
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
                    onClick={() => goToArea(11)}
                    disabled={disableClasses[11]}>
                    11:00</button>
                    </td>
                <td className="Time">
                    <button 
                    className="TimeButton" 
                    style={{ '--hover-bg-color': buttonColors[2] } as React.CSSProperties}
                    onClick={() => goToArea(12)}
                    disabled={disableClasses[12]}>
                    12:00</button>
                    </td>
                </tr>
                <tr>
                <td className="Time">
                    <button 
                    className="TimeButton" 
                    style={{ '--hover-bg-color': buttonColors[3] } as React.CSSProperties}
                    onClick={() => goToArea(13)}
                    disabled={disableClasses[13]}>
                    13:00</button>
                    </td>
                <td className="Time">
                    <button 
                    className="TimeButton"
                    style={{ '--hover-bg-color': buttonColors[4] } as React.CSSProperties}
                    onClick={() => goToArea(14)}
                    disabled={disableClasses[14]}>
                    14:00</button>
                    </td>
                </tr>
                <tr>
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
                </tr>
                </tbody>
            </table>
            </div>
            </>
        </div>
    );
};

export default Home;
