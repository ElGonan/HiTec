import './css/Schedule.css'
import { useLocation } from 'react-router-dom'

const Schedule = () => {
    const location = useLocation();
    const { state } = location;
    const data = state.data;

    console.log(data)

    return(
        <>
        <h1>Aqui está tu horario krnal</h1>
            {data && (
                <pre>{JSON.stringify(data, null, 2)}</pre> // Muestra los datos
            )}
        </>
    )

}

export default Schedule;