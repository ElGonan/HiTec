import { useEffect, useState } from 'react'
import  supabaseGet  from '../lib/supabaseGet'
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

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
            Swal.fire({
                title: "Por favor, ingresa mínimo 10 dígitos.",
                icon: "error"
            })
            return
        }
        const alumno_phone = Number(strPhone)

        if (isNaN(alumno_phone)){
            Swal.fire({
                title: "El teléfono no es válido.",
                icon: "error"
            })
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
            const result = await Swal.fire({
                text: "No se encontró el número de teléfono. ¿Deseas registrarte?",
                icon: "question",
                showCancelButton: true,
                cancelButtonText: "No",
                confirmButtonText: "Si"


            })
            if (result.isConfirmed) {
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
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <img src="../../logo.webp" alt="Logo HiTec" style={{ width: "25%" }} />
            </div>
            <div>
                <h2>Por favor, ingresa con tu código</h2>
                <form onSubmit={handleSubmit}>
                    <input type="number" placeholder="xxx-xxx-xxxx" name="phone" value={strPhone || ''} onChange={handleInputChange} ></input>
                    <br></br> <br></br>
                    <button type="submit">Iniciar sesión</button>
                </form>
            </div>
        </div>
        </>
    )
}

export default Login
