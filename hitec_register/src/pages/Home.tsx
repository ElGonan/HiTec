import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import supabaseGet from '../lib/supabaseGet';
import supabaseDelete from '../lib/supabaseDelete';
import supabaseUpdate from '../lib/supabaseUpdate';
import SupabaseInscription from '../lib/supabaseInscription';
import useSupabaseRead from '../hooks/useSupabaseRead';
import transformDate from '../lib/transformDate';

const Home = () => {
    const [id, setId] = useState<number | null>(null);
    const [name, setName] = useState<string | null>(null);
    const [errorInscription, setErrorInscription] = useState<string | null>(null);
    const [isSelected, setIsSelected] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const [clases, setClases] = useState<{[key: number]: number | null}>({
        1: null,
        2: null,
        3: null,
        4: null,
        5: null
    });
    const [capacidades, setCapacidades] = useState<{[key: number]: number}>({
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0
    });

    const retrieveData = async (alumno_id: number) => {
        const { data, error } = await supabaseGet("alumno_clase", "alumno_id", alumno_id);
        if (error) {
            alert(error.message);
            return;
        }
        if (data) {
            const claseIds = data.map((item: any) => item.clase_id);
            claseIds.forEach((claseId, index) => {
                const claseKey = index + 1;
                setClases((prev) => ({ ...prev, [claseKey]: claseId }));
                // Fetch the corresponding clase capacity
                supabaseGet("clase", "clase_id", claseId).then(({ data, error }) => {
                    if (error) return alert(error.message);
                    if (data) {
                        const capacidad = data[0].capacidad_clase || 0;
                        setCapacidades((prev) => ({ ...prev, [claseKey]: capacidad }));
                    }
                });
            });
            if (claseIds.length > 0) {
                setIsSelected(true);
            }
        }
    };

    const getOut = () => {
        if (window.confirm("¿Seguro que deseas cerrar sesión?")) {
            navigate("/");
        }
    };

     const deleteInscription = async () => {
        if (window.confirm("¿Seguro que deseas borrar la inscripción?")) {
            for (let i = 1; i <= 5; i++) {
                const claseId = clases[i];
                const capacidad = capacidades[i];
                if (claseId !== null) {
                    const newCapacity = capacidad + 1;
                    const { error } = await supabaseUpdate("clase", "clase_id", claseId, { capacidad_clase: newCapacity });
                    if (error) {
                        alert(error.message);
                        return;
                    }}}}
                   const { error } = await supabaseDelete("alumno_clase", "alumno_id", id!);
            if (error) {
                alert(error.message);
                return;
            }
            alert("Inscripción borrada correctamente");
            setIsSelected(false);
            setClases({ 1: null, 2: null, 3: null, 4: null, 5: null });
            setCapacidades({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });
        }

    const handleInscription = async (clase_id: number) => {
        const { data, error } = await SupabaseInscription(id!, clase_id);
        if (error) {
            setErrorInscription(error.message);
            return;
        }
        return data ? 1 : 0;
    };

    const handleSubmit = async () => {
        if (window.confirm("Seguro que deseas inscribirte a las clases seleccionadas?")) {
            for (let i = 1; i <= 5; i++) {
                const claseId = clases[i];
                if (claseId) {
                    await handleInscription(claseId);
                }
            }
            if (!errorInscription) {
                alert("Inscripción exitosa");
                setIsSelected(true);
            } else {
                alert("Error en la inscripción: " + errorInscription);
            }
        }
    };

    const { data, error }: { data: Class[] | null; error: any } = useSupabaseRead("clase");
    if (error) {
        console.error('Error fetching data:', error);
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
            retrieveData(location.state.clase_id);
        }

    }, [location.search, location.state]);

    return (
       <div>
    <button onClick={getOut} style={{ position: "absolute", top: "10px", left: "10px" }}>Cerrar Sesión</button>
    <button onClick={deleteInscription} style={{ position: "absolute", top: "10px", right: "10px" }} disabled={!isSelected}>Borrar inscripción</button>
    <img src="../../logo.webp" alt="Logo HiTec" style={{ position: "relative", top: "32px", width: "10%", }} />

    <h1>Bienvenido {name}</h1>
    <h2>Por favor, verifica tus clases.</h2>
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {Array.from({ length: 5 }, (_, i) => (
            <select
                value={clases[i + 1] ?? ""}
                onChange={(e) => {
                    const claseId = Number(e.target.value);
                    // Verifica si la clase ya fue seleccionada en otro select
                    const isDuplicate = Object.entries(clases).some(([key, value]) => {
                        return parseInt(key) !== i + 1 && value === claseId;
                    });

                    if (!claseId || !isDuplicate) {
                        setClases((prev) => ({ ...prev, [i + 1]: claseId || null }));
                    } else {
                        alert("Esta clase ya ha sido seleccionada. Por favor elige otra.");
                    }
                }}
            >
                <option value="">Selecciona una clase</option>
                {data?.map((Class) => {
                    const isAlreadySelected = Object.entries(clases).some(
                        ([key, value]) => parseInt(key) !== i + 1 && value === Class.clase_id || Class.capacidad_clase === 0
                    );
                    return (
                        <option
                            key={Class.clase_id + i}
                            value={Class.clase_id}
                            disabled={isAlreadySelected}
                        >
                            {Class.nombre_clase} | Prof: {Class.instructor} | Fecha y hora: {transformDate(Class.fecha_hora)}
                        </option>
                    );
                })}
            </select>
        ))}
    </div>
    <br></br>
    <button onClick={() => handleSubmit()} disabled={isSelected}>Inscribirme!</button>
</div>

    );
};

export default Home;
