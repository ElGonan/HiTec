import { useState, useEffect } from "react";
import Loading from "../components/Loading";
import { useLocation, useNavigate } from "react-router-dom";
import supabaseGetTimeAndArea from "../lib/supabaseGetTimeAndArea"
import SupabaseInscription from "../lib/supabaseInscription";
import "./css/Classes.css";
import Swal from 'sweetalert2'

const Classes = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const { alumno_id, time, area } = location.state as { alumno_id: number; time: number; area: string };
    const [data, setData] = useState<Class[] | null>(null);

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
        console.log(alumno_id, clase_id);
        const result = await Swal.fire({
                text: "Segurx que deseas inscribirte a esta clase?",
                icon: "question",
                showCancelButton: true,
                cancelButtonText: "No",
                confirmButtonText: "Si"
            })
            if (result.isConfirmed) {
                setLoading(true);
                SupabaseInscription(alumno_id, clase_id).then(({ error }) => {
                    if (error) {
                        Swal.fire({
                    title: "No hay más lugares para esta clase!",
                    icon: "error"
                            })
                        setLoading(false);
                        return;
                    }
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
                });
        }}

useEffect(()=> {
    getClases();
},[])
    return (
        <>
        {loading && (<Loading />)}
        <div className="cristalCard">
            <h1 className="text-4xl font-bold mb-4">Por favor, seleccione la clase de su interés</h1>
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
        </div>
        </>
    );
}
export default Classes;

