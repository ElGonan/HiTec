import { useState, useEffect } from "react";
import Loading from "../components/Loading";
import { useLocation, useNavigate } from "react-router-dom";
import supabaseGetTimeAndArea from "../lib/supabaseGetTimeAndArea"
import SupabaseInscription from "../lib/supabaseInscription";
import "./css/Classes.css";
import Swal from 'sweetalert2'
import ClassCard from "../components/ClassCard";

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
                        alert(error.message);
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
            <div>
            {data?.map((item:any, index: number) => (
                <div key={index}>
                    <ClassCard 
                    className={item.nombre_clase} 
                    teacherName={item.instructor} 
                    onSign={() => handleInscription(item.clase_id)}
                    />
                </div>
            ))}
            </div>
        </div>
        </>
    );
}
export default Classes;

