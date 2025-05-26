import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import supabaseGetTime from '../lib/supabaseGetTime';
import Loading from '../components/Loading';
import './css/Area.css';

type AreaType = { 
    area: string; [key: string]: any 
};


const Area = () => {
const location = useLocation();
const navigate = useNavigate();
const [areas, setAreas] = useState<AreaType[]>([]);
const { alumno_id, time } = location.state as { alumno_id: number; time: number };
const [loading, setLoading] = useState(false);


    const getClases = async () => {
        setLoading(true); 
        const {data, error} = await supabaseGetTime(time);
        if (error) {
            alert(error.message);
            setLoading(false); 
            return;
        }
        if (data) {
            console.log(data);
            setAreas(data);
            setLoading(false); 
        }
    }

    const goToClasses = (area: string) => {
        console.log(alumno_id, area);
        navigate("/clases", {
            state: {
                alumno_id: alumno_id,
                time: time,
                area: area,
            }});
    }

    useEffect(() => {
        getClases();
    }, []);

    return (
        <div>
            {loading && (<Loading />)}
        <div className="cristalCard">
            <h1 className="text-2xl font-bold mb-4">Seleccione una Area</h1>
            <div className="Area">
                {areas.map((areas, index) => (
                    <div key={index}  >
                        <button 
                            className="AreaButton"
                            onClick={() => goToClasses(areas.area)}
                        >{areas.area}</button>
                    </div>
                ))}
            </div>

        </div>
        </div>
    )

}

export default Area