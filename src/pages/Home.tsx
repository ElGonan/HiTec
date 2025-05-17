import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import supabaseGet from '../lib/supabaseGet';
import Loading from '../components/Loading';
import './css/Home.css';

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

const timeInscription : any = []
const Home = () => {
    const [id, setId] = useState<number | null>(null);
    const [name, setName] = useState<string | null>(null);
    const [loading, setLoading] = useState(false); // New loading state
    const [disableClasses, setDisableClasses] = useState<{ [key: number]: boolean }>({
        11: false,
        12: false,
        13: false,
        14: false,
        15: false,
        16: false
    });
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state as LocationState;


    const checkInscriptions = (timeInscription : number[]) => {
        if (timeInscription.length >= INSCRIPTIONLIMIT ) {
            alert("Ya tienes 5 inscripciones");
        }

        const newDisableClasses = { ...disableClasses };
        timeInscription.forEach((time : number) => {
        if (newDisableClasses.hasOwnProperty(time)) {
            newDisableClasses[time] = true;
        }
        });

        setDisableClasses(newDisableClasses);
    };


    const goToArea = (time: number) => {
        console.log(id, time);
        navigate("/area", {
            state: {
                alumno_id: id,
                time: time,
            }});
    }

    const retrieveData = async (alumno_id: number) => {
        setLoading(true); // Start loading
        const { data, error } = await supabaseGet("alumno", "alumno_id", alumno_id);
        if (error) {
            alert(error.message);
            setLoading(false); // Stop loading on error
            return;
        }
        if (data) {
            setId(data[0].alumno_id);
            setName(data[0].alumno_name);
        }
        setLoading(false); // Stop loading after data is fetched
    };

    const getOut = () => {
        if (window.confirm("¿Seguro que deseas cerrar sesión?")) {
            navigate("/");
        }
    };




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
        const { alumno_id, time } = location.state;

        // Ejecuta la lógica de recuperación
        if (alumno_id) {
            retrieveData(alumno_id);
        }

        // Si viene el valor de "time"
        if (time !== undefined) {
            const stored = localStorage.getItem("timeInscription");
            let parsed: number[] = stored ? JSON.parse(stored) : [];

            // Si no está repetido
            if (!parsed.includes(time)) {
                parsed.push(time);
                localStorage.setItem("timeInscription", JSON.stringify(parsed));
                checkInscriptions(parsed);
            } else {
                checkInscriptions(parsed); // solo actualizar botones
            }
        }
    } else {
        // Paso 3: Si no hay `location.state`, carga directamente del localStorage
        const stored = localStorage.getItem("timeInscription");
        if (stored) {
            const parsed = JSON.parse(stored);
            checkInscriptions(parsed);
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

            <h1>Bienvenido {name}</h1>
            <h2>Por favor,Selecciona un horario.</h2>
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
