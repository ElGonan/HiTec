import supabase from '../supabase/supabaseClient'
import { useState } from 'react'
import {useLocation, useNavigate  } from 'react-router-dom';

const RegisterUser = () => {
    const [matricula, setMatricula] = useState<string>("")
    const [firstClass, setFirstClass] = useState<Date | null>(null)
    const [secondClass, setSecondClass] = useState<Date | null>(null)
    const location = useLocation()
    const navigate = useNavigate();

    // Función para manejar el cambio en el input de matrícula
    const handleMatriculaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Validar que empiece con A y tenga máximo 9 caracteres
        if (value.length <= 9) {
            // Opcional: validar que el primer carácter sea 'A'
            if (value === '' || (value.length === 1 && value.toUpperCase() === 'A') || 
                (value.length > 1 && value[0].toUpperCase() === 'A')) {
                setMatricula(value.toUpperCase());
            }
        }
    }

    const addUser = async (e: any) => {
        e.preventDefault()

        // Validación adicional por si acaso
        if (matricula.length !== 9) {
            alert("La matrícula debe tener exactamente 9 caracteres comenzando con A");
            return;
        }

        if (!matricula || !firstClass || !secondClass) {
            alert("Favor de llenar el valor de Matrícula, Primera hora o segunda hora")
            return
        }

        const alumno_matricula = matricula;
        const alumno_class_1 = firstClass;
        const alumno_class_2 = secondClass;

        const Student = { alumno_matricula, alumno_class_1, alumno_class_2}

        console.log(Student)

        if (window.confirm("¿Estas seguro de que quieres crear la cuenta?")) {
            const { data, error } = await supabase
                .from("alumno")
                .insert([Student])
                .select()

            if(error) {
                if(error.code = "400") {
                    if (error.message.includes('duplicate key value violates unique constraint "alumno_alumno_matricula_key"')) {
                        alert("La matrícula ya está registrada")
                        return
                    }
                    alert("Error en alguna regla!!")
                    console.log(error)
                    return
                }
                alert(error.message)
            }
            
            if(data) {
                alert("Usuario creado correctamente")
                navigate("/adminUsers")
            }
        }
    }

    const goBack = () => {
      navigate(
        "/adminUsers"
      )
    }

    return(
        <>
            <div>
                <button 
                  className='goBack' 
                  onClick={() => navigate(-1)} 
                  style={{
                    position: 'absolute',
                    top: '20px',
                    left: '20px',
                    background: '#ff8c24',
                    color: 'white',
                    fontSize: '12px',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '8px 12px',
                    cursor: 'pointer'
                  }}
                >
                  Volver atrás
                </button>
                <h1>Registro de Usuario</h1>
                <div>
                    <h3>Matrícula (Empezando con A)</h3>
                    <input 
                        type="text" 
                        id="matricula" 
                        name="matricula" 
                        value={matricula} 
                        onChange={handleMatriculaChange} 
                        placeholder='AXXXXXXXX'
                        maxLength={9} // HTML attribute para limitar caracteres
                    />
                    <br></br>
                    <small>{matricula.length}/9 caracteres</small> {/* Contador opcional */}
                    <h3>Primera hora</h3>
                    <input type="time" id="firstClass" name="firstClass" value={firstClass} onChange={(e) => setFirstClass(e.target.value)} placeholder='11:00 am'></input>
                    <h3>Segunda hora</h3>
                    <input type="time" id="secondClass" name="secondClass" value={secondClass} onChange={(e) => setSecondClass(e.target.value)} placeholder='11:00 am'></input>
                    <br></br>
                    <br></br>
                    <button onClick={(e) => addUser(e)}>¡Darme de alta!</button>
                </div>
            </div>
        </>
    )
}

export default RegisterUser