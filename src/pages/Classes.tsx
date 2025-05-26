import { useState, useEffect } from "react";
import Loading from "../components/Loading";
import { useLocation, useNavigate } from "react-router-dom";
import supabaseGetTimeAndArea from "../lib/supabaseGetTimeAndArea"
import SupabaseInscription from "../lib/supabaseInscription";
import "./css/Classes.css";

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
            console.log(data);
            setData(data);
            setLoading(false);
        }
    }

    const handleInscription = (clase_id: number) => {
        console.log(alumno_id, clase_id);
        if ( window.confirm("Seguro que deseas inscribirte a la clase?"))
        {
                setLoading(true);
                SupabaseInscription(alumno_id, clase_id).then(({ error }) => {
                    if (error) {
                        alert(error.message);
                        setLoading(false);
                        return;
                    }
                    alert("Inscripción exitosa");
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
                        {data?.map((item: any, index: number) => (
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