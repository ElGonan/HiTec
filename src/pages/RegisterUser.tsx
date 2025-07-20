import supabase from '../supabase/supabaseClient'
import { useEffect, useState } from 'react'
import {useLocation, useNavigate  } from 'react-router-dom';




const RegisterUser = () => {
    const [name, setName] = useState<string>("")
    const [matricula, setMatricula] = useState<string>("")
    const [phone, setPhone] = useState<number>(0)
    const location = useLocation()
    const navigate = useNavigate();



  const addUser = async (e : any) => {
    
    e.preventDefault()


    if (!name || !matricula) {
      alert("Favor de llenar el valor de Nombre completo y Matrícula")
      return
    }

    const alumno_name = name
    const alumno_matricula = matricula
    const alumno_phone = phone


    const Student = { alumno_name, alumno_matricula, alumno_phone }


    console.log(Student)

    if (window.confirm("¿Estas seguro de que quieres crear tu cuenta?")) {


    const { data, error } = await supabase
    .from("alumno")
    .insert([Student])
    .select()

    if(error)
    {
      if(error.code = "400")
      {
        if (error.message.includes('duplicate key value violates unique constraint "alumno_alumno_matricula_key"'))
        {
          alert("La matrícula ya está registrada")
          return
        }
        alert("Error en alguna regla!!")
        console.log(error)
        return
      }
      alert(error.message)
    }
    
    if(data)
    {
      alert("Usuario creado correctamente")
      navigate("/home?phone=" + alumno_phone)
    }

  }

  }
useEffect(() => {
       const query = new URLSearchParams(location.search);
       setPhone(Number(query.get("phone")));
   }, [name, phone]);

  return(

    <>
    <div>
      <h1>Registro de Usuario</h1>
      <div>
        <h3>Nombre completo:</h3>
        <input type="text" id="name" name="name" value={name} onChange={(e) => setName(e.target.value)} placeholder='Jose Luis Slobotzky'></input>
        <h3>Matrícula (Empezando con A)</h3>
        <input type="text" id="matricula" name="matrcula" value={matricula} onChange={(e) => setMatricula(e.target.value)} placeholder='AXXXXXXXX'></input>
        <h3>Número de teléfono:</h3>
        <input type="text" id="phone" name="phone" value={phone} onChange={(e) => setPhone(Number(e.target.value))} placeholder='xxx-xxx-xxxx' disabled={true}></input>
        <br></br>
        <br></br>
        <button onClick={(e) => addUser(e)}>¡Darme de alta!</button>
      </div>
        <p style={{ fontSize: '8px' }}>Recuerda que al iniciar sesión o registrarte aceptas nuestras <a href="/terms">condiciones de uso</a></p>
    </div>
    </>

  )

}
export default RegisterUser

