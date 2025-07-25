import { useState, useEffect } from 'react'
import { useUser } from '../hooks/useUserContext';
import { useNavigate } from 'react-router-dom';
import LoginCard from '../components/LoginCard';


const Login = () => {
const [inputMatricula, setInputMatricula] = useState('');
const { login, isLoading, user } = useUser();
const navigate = useNavigate();


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try{
            await login(inputMatricula);
        } catch(error) {
            alert((error as Error).message)
        }

    }; useEffect(() => {
if (user){
        console.log(user);
        if(user.alumno_id === 1) {navigate("/admin");}
        else{navigate("/Home");}
        
    }
},[navigate, user])

    return (
        <>
        <LoginCard>
            <div  style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}> 
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <img src="../../logo.webp" alt="Logo HiTec" style={{ width: "35%" }} />
                </div>
                <span style={{fontSize:'2rem', fontWeight: 'bold'}}>Bienvenid@</span>
                <span>HITEC 2025</span>
                <div style={{paddingTop:'2rem'}}>
                    <div style={{paddingBottom:'1rem'}}>
                        <span>Por favor, ingresa tu matrícula</span>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <input type="string" placeholder="A0000000" name="id" value={inputMatricula} onChange={(e) => setInputMatricula(e.target.value)} required></input>
                        <br/>
                        <br/>
                        <button disabled={isLoading} type="submit" style={{backgroundColor:"white", color:`rgba(16,18,60,1)`, border: 'none', fontSize: '14px'}}>Entrar</button>
                    </form>
                </div>
            </div>
        </LoginCard>
        </>
    )
}

export default Login
