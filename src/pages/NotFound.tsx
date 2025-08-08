// pages/NotFound.jsx
import { useNavigate } from 'react-router-dom';

function NotFound() {
    const navigate = useNavigate(); 

    return (
        <div className="not-found" style={{
        textAlign: 'center',
        padding: '2rem',
        maxWidth: '600px',
        margin: '0 auto'
        }}>
        <h1>¡Ups!</h1>
        <h2>Página no encontrada</h2>
        <p>
            La página que estás buscando no existe o no está disponible.
        </p>
        <button 
            onClick={() => navigate('/home')}
            className="home-link"
        >
            Volver al inicio
        </button>
        </div>
    );
}

export default NotFound;