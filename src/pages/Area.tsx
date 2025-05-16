import { useLocation, useNavigate } from 'react-router-dom';

const Area = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { alumno_id, time } = location.state as { alumno_id: number; time: number };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h1 className="text-4xl font-bold mb-4">Area</h1>
            <p className="text-lg">This is the Area page.</p>
            <p className="text-lg">Alumno ID: {alumno_id}</p>
            <p className="text-lg">Time: {time}</p>
        </div>
    )

}

export default Area