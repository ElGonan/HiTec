import { useEffect, useState } from 'react'
import  supabaseGet  from '../lib/supabaseGet'
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [strPhone, setStrPhone] = useState<string | null>()
    const navigate = useNavigate();


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        if (value.length <= 10) {
            setStrPhone(value)
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!strPhone || strPhone.toString().length !== 10) {
            alert("Favor de llenar el valor de telefono, los telefonos tienen 10 digitos")
            return
        }
        const alumno_phone = Number(strPhone)

        if (isNaN(alumno_phone)){
            alert("El teléfono no es válido")
            return
        }

        const { data, error } = await supabaseGet("alumno", "alumno_phone", alumno_phone)
        if (error) {
            alert(error.message)
            return
        }if (data?.[0]?.alumno_id === 1) {
            navigate("/admin")
            return
        }

        if (!data || data.length === 0) {  
            if (window.confirm("No se encontró el número de teléfono \n¿Deseas registrarte?")) {
                navigate("/register?phone=" + strPhone);
            }
        }
        else{
            navigate("home?phone=" + strPhone, {state: { alumno_id: data[0].alumno_id }});
        }
    }
useEffect(() => {
    handleInputChange
}, [])

    return (
        <>
        <div>
            <h1>Bienvenido al Login de HiTec!</h1>
            <div>
                <h2>Por favor, ingresa con tu número de teléfono</h2>
                <form onSubmit={handleSubmit}>
                    <input type="number" placeholder="xxx-xxx-xxxx" name="phone" value={strPhone || ''} onChange={handleInputChange} ></input>
                    <br></br> <br></br>
                    <button type="submit">Enviar datos</button>
                </form>
            </div>
            <p style={{ fontSize: '8px' }}>Al iniciar sesión o registrarte aceptas nuestras <a href="/terms">condiciones de uso</a></p>
        </div>
        </>
    )
}

export default Login