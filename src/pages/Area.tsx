/* eslint-disable react-hooks/exhaustive-deps */
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import supabaseGetTime from '../lib/supabaseGetTime';
import Loading from '../components/Loading';
import './css/Area.css';
import GlassCard from '../components/GlassCard';

type AreaType = { 
    area: string; [key: string]: unknown 
};


const Area = () => {
const location = useLocation();
const navigate = useNavigate();
const [areas, setAreas] = useState<AreaType[]>([]);
const { time } = location.state as { time: number };
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
            setAreas(data);
            setLoading(false); 
        }
    }

    const goToClasses = (area: string) => {
        // console.log(alumno_id, area);
        navigate("/clases", {
            state: {
                time: time,
                area: area,
            }});
    }

    const goBack = () => {
        navigate("/home")

    }

    useEffect(() => {
        getClases();
    }, []);

    return (
        <div>
            <button className='goBack' onClick={goBack}>Regresar</button>
            {loading ? 
            (<Loading />)
            : 
            <GlassCard>
                <h2 className="text-md font-bold mb-4">Seleccione una Area</h2>
            <div className="Area">
                {areas.map((areas, index) => (
                    <div key={index}  >
                        <button className="AreaButton"
                            onClick={() => goToClasses(areas.area)}
                        >{areas.area}</button>
                    </div>
                ))}
        </div>
        </GlassCard>}
        </div>
    )

}

export default Area