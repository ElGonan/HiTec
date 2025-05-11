import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import supabaseGet from '../lib/supabaseGet'
import supabaseDelete from '../lib/supabaseDelete'
import exportToCSV from '../lib/exportCSV'

const Admin = () => {
    const [clases, setClases] = useState<Class[]>([])
    const [error, setError] = useState<string | null>(null)
    const navigate = useNavigate()

    const transformDate = (date: string) => {
        const dateObj = new Date(date)
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        }
        const formattedDate = dateObj.toLocaleString('es-MX', options)
        return formattedDate
    }

    const getOut = () => {
        if (window.confirm("¿Seguro que deseas cerrar sesión?")) {
            navigate("/")
        }
    }

    const csvExport = () => {
        if (window.confirm("¿Seguro que deseas exportar a CSV?")) {
        exportToCSV()
    }
    }

    const editClass = (clase_id: number) => {
        navigate("/registerClass", { state: { clase_id } })
    }

    const createClass = () => {
            navigate("/registerClass") 
    }


    const deleteClass = async (clase_id: number) => {
  if (window.confirm("¿Seguro que deseas eliminar la clase?")) {
    const { error } = await supabaseDelete("clase", "clase_id", clase_id);
    
    if (error) {
      setError(error.message);
      alert(error.message);
      return;
    }

    alert("Clase eliminada");
    getClases(); // <-- actualiza la lista
  }
};


    const getClases = async () => {
        const { data, error } = await supabaseGet("clase")
        if (error) {
            setError(error.message)
            alert(error.message)
            return
        }
       if (data) {
    const formatted = data.map((clase: Class) => ({
        ...clase,
        fecha_hora: transformDate(clase.fecha_hora)
    }))
    setClases(formatted)
}
    }

    useEffect(() => {
        getClases()
    }, [])

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <button onClick={getOut} style={{ position: "absolute", top: "10px", left: "10px" }}>Cerrar sesión</button>
            <button onClick={csvExport} style={{ position: "absolute", top: "10px", right: "10px" }}>Exportar a csv</button>
            <h1>Hola miembro de Staff de Hitec!</h1>
            <button onClick={createClass}>Crear Clase</button>
            <p>Estas son las clases:</p>
            <table style={{ border: "2px solid black", width: "100%", borderCollapse: "collapse", margin: "64px"  }}>
  <thead>
    <tr style={{ backgroundColor: "#982000", textAlign: "center" }}>
      <th style={{ border: "1px solid black" }}>ID</th>
      <th style={{ border: "1px solid black" }}>Nombre de la clase</th>
      <th style={{ border: "1px solid black" }}>Instructor</th>
      <th style={{ border: "1px solid black" }}>Fecha y hora</th>
      <th style={{ border: "1px solid black" }}>Capacidad</th>
      <th style={{ border: "1px solid black" }}>Acción</th>
    </tr>
  </thead>
  <tbody>
    {clases.map((clase) => (
      <tr key={clase.clase_id} style={{ textAlign: "center", backgroundColor: "#d42d00" }}>
        <td style={{ border: "1px solid black" }}>{clase.clase_id}</td>
        <td style={{ border: "1px solid black" }}>{clase.nombre_clase}</td>
        <td style={{ border: "1px solid black" }}>{clase.instructor}</td>
        <td style={{ border: "1px solid black" }}>{clase.fecha_hora}</td>
        <td style={{ border: "1px solid black" }}>{clase.capacidad_clase}</td>
        <td style={{ border: "1px solid black" }}>
            <button style={{ margin: "8px"}} onClick={() => editClass(clase.clase_id)}>Editar</button>
          <button style={{ margin: "8px"}} onClick={() => deleteClass(clase.clase_id)}>Eliminar</button>
          <br />
        </td>
      </tr>
    ))}
  </tbody>
</table>

        </div>
    )
}


export default Admin