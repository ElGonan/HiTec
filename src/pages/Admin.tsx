import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import supabaseGet from '../lib/supabaseGet'
import supabaseDelete from '../lib/supabaseDelete'
import exportToCSV from '../lib/exportCSV'
import transformDate from '../lib/transformDate'
import './css/Admin.css'

const Admin = () => {
    const [clases, setClases] = useState<Class[]>([])
    const [error, setError] = useState<string | null>(null)
    const navigate = useNavigate()

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
    getClases(); 
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
          const sorted = data.sort((a: Class, b: Class) => a.clase_id - b.clase_id); // orden ascendente
          const formatted = sorted.map((clase: Class) => ({
            ...clase,
            fecha_hora: transformDate(clase.fecha_hora)
            }));
          setClases(formatted);
        }
    }

    useEffect(() => {
        getClases()
    }, [])

    return (
       <div style={{
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "20px",
  width: "100%",
  boxSizing: "border-box"
}}>
  <button
    onClick={getOut}
    style={{ position: "absolute", top: "10px", left: "10px" }}
  >
    Cerrar sesión
  </button>

  <button
    onClick={csvExport}
    style={{ position: "absolute", top: "10px", right: "10px" }}
  >
    Exportar a csv
  </button>

  <img
    src="../../logo.webp"
    alt="Logo HiTec"
    style={{ position: "absolute", top: "10px", width: "80px" }}
  />

  <h1 style={{ textAlign: "center", marginTop: "60px" }}>
    Hola miembro de Staff de Hitec!
  </h1>

  <button onClick={createClass} style={{ marginBottom: "10px" }}>
    Crear Clase
  </button>

  <p>Estas son las clases:</p>

  <div className="DBtable" style={{
    overflowX: "auto",
    width: "100%",
    maxWidth: "1000px",
    marginTop: "10px"
  }}>
    <table style={{
      borderCollapse: "collapse",
      width: "100%",
      minWidth: "600px"
    }}>
      <thead>
        <tr style={{ textAlign: "center" }}>
          <th className="Title" style={{ width: "60px" }}>ID</th>
          <th className="Title">Nombre de la clase</th>
          <th className="Title">Instructor</th>
          <th className="Title">Área</th>
          <th className="Title">Lugar</th>
          <th className="Title">Fecha y hora</th>
          <th className="Title">Capacidad</th>
          <th className="Title" style={{ width: "160px" }}>Acción</th>
        </tr>
      </thead>
      <tbody>
        {clases.map((clase, index) => {
          const textClass = `Text ${index % 2 === 0 ? "Text-light" : "Text-dark"}`;
          return (
            <tr key={clase.clase_id} style={{ textAlign: "center" }}>
              <td className={textClass} style={{ width: "60px" }}>{clase.clase_id}</td>
              <td className={textClass}>{clase.nombre_clase}</td>
              <td className={textClass}>{clase.instructor}</td>
              <td className={textClass}>{clase.area}</td>
              <td className={textClass}>{clase.lugar}</td>
              <td className={textClass}>{clase.fecha_hora}</td>
              <td className={textClass}>{clase.capacidad_clase}</td>
              <td className={textClass} style={{ width: "160px", whiteSpace: "nowrap" }}>
                <button style={{ margin: "4px" }} onClick={() => editClass(clase.clase_id)}>Editar</button>
                <button style={{ margin: "4px" }} onClick={() => deleteClass(clase.clase_id)}>Eliminar</button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
</div>

    )
}


export default Admin