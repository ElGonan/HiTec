import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import supabaseGet from '../lib/supabaseGet';
import supabaseDelete from '../lib/supabaseDelete';
import supabaseUpdate from '../lib/supabaseUpdate';
import Loading from '../components/Loading';
import './css/Home.css';

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
    const [id, setId] = useState<number | null>(null);
    const [name, setName] = useState<string | null>(null);
    const [errorInscription, setErrorInscription] = useState<string | null>(null);
    const [isSelected, setIsSelected] = useState(false);
    const [loading, setLoading] = useState(false); // New loading state
    const navigate = useNavigate();
    const location = useLocation();
    const [clases, setClases] = useState<{ [key: number]: number | null }>({
        1: null,
        2: null,
        3: null,
        4: null,
        5: null
    });
    const [capacidades, setCapacidades] = useState<{ [key: number]: number }>({
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0
    });

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
        const { data, error } = await supabaseGet("alumno_clase", "alumno_id", alumno_id);
        if (error) {
            alert(error.message);
            setLoading(false); // Stop loading on error
            return;
        }
        if (data) {
            
        }
        setLoading(false); // Stop loading after data is fetched
    };

    const getOut = () => {
        if (window.confirm("¿Seguro que deseas cerrar sesión?")) {
            navigate("/");
        }
    };

    const deleteInscription = async () => {
        if (window.confirm("¿Seguro que deseas borrar la inscripción?")) {
            setLoading(true); // Start loading
            for (let i = 1; i <= 5; i++) {
                const claseId = clases[i];
                const capacidad = capacidades[i];
                if (claseId !== null) {
                    const newCapacity = capacidad + 1;
                    const { error } = await supabaseUpdate("clase", "clase_id", claseId, { capacidad_clase: newCapacity });
                    if (error) {
                        alert(error.message);
                        setLoading(false); // Stop loading on error
                        return;
                    }
                }
            }
            const { error } = await supabaseDelete("alumno_clase", "alumno_id", id!);
            if (error) {
                alert(error.message);
                setLoading(false); // Stop loading on error
                return;
            }
            alert("Inscripción borrada correctamente");
            setIsSelected(false);
            setClases({ 1: null, 2: null, 3: null, 4: null, 5: null });
            setCapacidades({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });
            setLoading(false); // Stop loading after deletion
        }
    };

    const tryLoad = () => {
        setLoading(true); // Start loading
        setTimeout(() => {
            setLoading(false); // Stop loading after 2 seconds
        }
        , 2000);
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

        if (location.state) {
            retrieveData(location.state.alumno_id);
        }

    }, [location.search, location.state, isSelected]);

    return (
        <div>
            {loading && (
                <Loading />
            )}
            <>
            <button onClick={getOut} style={{ position: "absolute", top: "10px", left: "10px" }}>Cerrar Sesión</button>
            <button onClick={deleteInscription} style={{ position: "absolute", top: "10px", right: "10px" }} disabled={!isSelected || loading}>Borrar inscripción</button>
            <img src="../../logo.webp" alt="Logo HiTec" style={{ position: "relative", top: "32px", width: "10%", }} />

            <h1>Bienvenido {name}</h1>
            <h2>Por favor,Selecciona un horario.</h2>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <table style={{ borderCollapse: "collapse", textAlign: "center" }}>
                <tbody>
                <tr>
                <td className="Date">
                    <button 
                    className="DateButton" 
                    style={{ '--hover-bg-color': buttonColors[1] } as React.CSSProperties}
                    onClick={() => goToArea(11)}>
                    11:00</button>
                    </td>
                <td className="Date">
                    <button 
                    className="DateButton" 
                    style={{ '--hover-bg-color': buttonColors[2] } as React.CSSProperties}
                    onClick={() => goToArea(12)}>
                    12:00</button>
                    </td>
                </tr>
                <tr>
                <td className="Date">
                    <button 
                    className="DateButton" 
                    style={{ '--hover-bg-color': buttonColors[3] } as React.CSSProperties}
                    onClick={() => goToArea(13)}>
                    13:00</button>
                    </td>
                <td className="Date">
                    <button 
                    className="DateButton"
                    style={{ '--hover-bg-color': buttonColors[4] } as React.CSSProperties}
                    onClick={() => goToArea(14)}>
                    14:00</button>
                    </td>
                </tr>
                <tr>
                <td className="Date">
                    <button 
                    className="DateButton" 
                    style={{ '--hover-bg-color': buttonColors[5] } as React.CSSProperties}
                    onClick={() => goToArea(15)}>
                    15:00</button>
                    </td>
                <td className="Date">
                    <button 
                    className="DateButton" 
                    style={{ '--hover-bg-color': buttonColors[6] } as React.CSSProperties}
                    onClick={() => goToArea(16)}>
                    16:00</button>
                    </td>
                </tr>
                </tbody>
            </table>
            </div>
            <button onClick={ tryLoad }> Prueba del Loading! </button>
            </>
        </div>
    );
};

export default Home;
