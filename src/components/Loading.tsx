import { ClipLoader } from "react-spinners";

const Loading = () => {
     return (
         <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                alignItems: 'center',
                zIndex: 1000
            }}>
                <div style={{
                backgroundColor: ' rgba(255, 255, 255, 0.42)',
                padding: '64px',
                borderRadius: '8px',
                boxShadow: '0 4px 8px rgba(255, 255, 255, 0.67)'
                }}>
                <ClipLoader color="#E78853" size={50} />
                <p style={{ color: 'white', marginTop: '10px' }}>Cargando...</p>
                </div>
            </div>
    );
}

export default Loading;