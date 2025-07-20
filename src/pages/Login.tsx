import { useState, useEffect } from 'react'
import { useUser } from '../hooks/useUserContext';
import { useNavigate } from 'react-router-dom';
import GlassCard from '../components/GlassCard';


const Login = () => {
const [inputId, setInputId] = useState('');
const { login, isLoading, user } = useUser();
const navigate = useNavigate();


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try{
            console.log(inputId)
            await login(inputId);
        } catch(error) {
            alert((error as Error).message)
        }

    };

useEffect(() => {
if (user){
        if(user.alumno_id === 1) {navigate("/admin");}
        else{navigate("/Home");}
        
    }
},[navigate, user])

    return (
        <>
        <GlassCard>
            <div>
                <h1>Bienvenido al Login de HiTec!</h1>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <img src="../../logo.webp" alt="Logo HiTec" style={{ width: "25%" }} />
                </div>
                <div>
                    <h2>Por favor, ingresa con tu código identificador</h2>
                    <form onSubmit={handleSubmit}>
                        <input type="number" placeholder="xxxx" name="id" value={inputId} onChange={(e) => setInputId(e.target.value)} required></input>
                        <br></br> <br></br>
                        <button disabled={isLoading} type="submit">Entrar</button>
                    </form>
                </div>
            </div>
        </GlassCard>
        </>
    )
}

export default Login
