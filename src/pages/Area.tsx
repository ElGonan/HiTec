import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import supabaseGetTime from '../lib/supabaseGetTime';

const Area = () => {
    const location = useLocation();
    const [areas, setAreas] = useState<[]>([]);
    const { alumno_id, time } = location.state as { alumno_id: number; time: number };

    const getClases = async () => {
    
        const {data, error} = await supabaseGetTime(time);
        if (error) {
            alert(error.message);
            return;
        }
        if (data) {
            console.log(data);
            setAreas(data);
        }

        



    }
    useEffect(() => {
        getClases();
    }, []);

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h1 className="text-2xl font-bold mb-4">Seleccione una Área</h1>
            <div>
                {areas.map((areas, index) => (
                    <div key={index} className="bg-white shadow-md rounded-lg p-4 mb-4">
                        <button>{areas.area}</button>
                    </div>
                ))}
            </div>

        </div>
    )

}

export default Area