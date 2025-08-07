/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import Loading from "../components/Loading";
import { useLocation, useNavigate } from "react-router-dom";
import supabaseGetTimeAndArea from "../lib/supabaseGetTimeAndArea"
import SupabaseInscription from "../lib/supabaseInscription";
import "./css/Classes.css";
import Swal from 'sweetalert2'
import { useUser } from "../hooks/useUserContext";
import GlassCard from "../components/GlassCard";
import { useMediaQuery } from "react-responsive";
import ClassCard from "../components/ClassCard";

const Classes = () => {
    const { user } = useUser();
    const location = useLocation();
    const isMobile = useMediaQuery({ maxWidth: 768 })
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const { time, area } = location.state as { time: number; area: string };
    const [data, setData] = useState<Class[] | null>(null);
    const alumno_id = user?.alumno_id;

    const getClases = async () => {
        setLoading(true);
        const { data, error } = await supabaseGetTimeAndArea(time, area);
        if (error) {
            alert(error.message);
            setLoading(false);
            return;
        }
        if (data) {
            //console.log(data);
            setData(data);
            setLoading(false);
        }
    }

    const handleInscription = async (clase_id: number) => {
        // console.log(alumno_id, clase_id);
        const result = await Swal.fire({
                text: "Segurx que deseas inscribirte a esta clase?",
                icon: "question",
                showCancelButton: true,
                cancelButtonText: "No",
                confirmButtonText: "Si"
            })
            if (result.isConfirmed) {
                setLoading(true);
                SupabaseInscription(alumno_id, clase_id).then(({ data, error }) => {
                    // console.log(data);
                    if (error) {
                        Swal.fire({
                    title: "No hay más lugares para esta clase!",
                    icon: "error"
                            })
                        setLoading(false);
                        return;
                    }
                    if (data) {
                    Swal.fire({
                        title: "Inscripción exitosa.",
                        icon: "success"
                    })
                    setLoading(false);
                    navigate("/home", {
                        state: {
                            alumno_id: alumno_id,
                        }
                    });
                }});
        }
    }

    const goBack = () =>
    {
        navigate("/area", {
            state: {
                time: time,
            }});
    }

useEffect(()=> {
    if (!user) {
        navigate("/");
        return;
    }
    getClases();
},[])
    return (
        <>
        <button onClick={goBack} style={{ position: "absolute", top: "20px", left: "20px", background:"#ff8c24",color:"white", fontSize: "12px"}}>Regresar</button>
        {loading ? (<Loading />) :
        <div>
            {isMobile ?
            <div>
                <GlassCard style={{ display:"flex", flexDirection: "column", gap:"12px", marginTop:"4em" }}>
                     <span style={{fontSize:'24px', fontWeight: 'bold'}}>Por favor, seleccione la clase de su interés</span>
                {data?.filter(item => item.capacidad_clase > 0)
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .map((item: any, index: number) => (
                <ClassCard id={index} className={item.nombre_clase} teacherName={item.instructor} onSign={() =>handleInscription(item.clase_id)} classPlace={item.lugar}/>
                ))}
                </GlassCard>
            </div>
            :
            <div>
                <GlassCard>
                    <span style={{fontSize:'24px', fontWeight: 'bold'}}>Por favor, seleccione la clase de su interés</span>
                    <div
                    className="DBtable" style={{
                        overflowX: "auto",
                        width: "fit-screen",
                        marginTop: "10px"}}>
                        <table
                        style={{
                            borderCollapse: "collapse",
                            width: "100%",
                            minWidth: "600px"
                            }}>
                            <thead>
                                <tr>
                                    <th className="Title">Nombre</th>
                                    <th className="Title">Instructor</th>
                                    <th className="Title">Lugar</th>
                                    <th className="Title">Inscribirse</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data?.filter(item => item.capacidad_clase > 0)
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                .map((item: any, index: number) => (
                                    <tr key={index}>
                                        <td className="Text">{item.nombre_clase}</td>
                                        <td className="Text">{item.instructor}</td>
                                        <td className="Text">{item.lugar}</td>
                                        <td className="Text ">
                                            <button
                                                className="bg-blue-500 text-white px-4 py-2 rounded"
                                                onClick={() => {
                                                    handleInscription(item.clase_id);}}
                                            >
                                                Inscribirse
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        
                    </div>
                </GlassCard>
            </div>
            }
            </div>
        }
        
    
        </>
    );
}
export default Classes;

