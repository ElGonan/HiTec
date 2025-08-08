/*
  @TODO
  Seccionar la lógica. Es insostenible este monolito de código, 
  hay que secccionarlo y revisar qué se sigue usando
 */


import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import supabaseGet from '../lib/supabaseGet'
import supabaseDelete from '../lib/supabaseDelete'
import exportToCSV from '../lib/exportCSV'
import transformDate from '../lib/transformDate'
import './css/Admin.css'
import Swal from 'sweetalert2'
import { useUser } from '../hooks/useUserContext'
import GlassCard from '../components/GlassCard'
import { importStudentsCSV } from '../lib/importStudentsCSV'
import { importClassesCSV } from '../lib/importClassesCSV'
import supabaseUpdate from '../lib/supabaseUpdate'

const Admin = () => {
    const { logout, user } = useUser();
    const [clases, setClases] = useState<Class[]>([])
    const [, setError] = useState<string | null>(null)
    const navigate = useNavigate()
    const fileInputRefStudent = useRef<HTMLInputElement>(null);
    const fileInputRefClase = useRef<HTMLInputElement>(null);

    const getOut = async () => {
        const result = await Swal.fire({
            text: "¿Estás segurx de que quieres cerrar sesión?",
            icon: "question",
            showCancelButton: true,
            cancelButtonText: "No",
            confirmButtonText: "Si"
                })

        if (result.isConfirmed) {
            await logout();
            navigate("/")
        }
    }

    const csvExport = async () => {
            const result = await Swal.fire({
            text: "¿Estás segurx de que deseas exportar la base de datos a CSV?",
            icon: "question",
            showCancelButton: true,
            cancelButtonText: "No",
            confirmButtonText: "Si"
                })

        if (result.isConfirmed) {
        exportToCSV()
        }
    }

    const handleImportClick = () => {
      fileInputRefStudent.current?.click();
    };

    const handleImportClickClasses = () => {
      fileInputRefClase.current?.click();
    }

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      
      await importStudents(file);
      e.target.value = "";
    };

    const handleFileClassChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      
      await importClases(file);
      e.target.value = "";
    };

    const importStudents = async (file: File) => {
      try {
        const result = await importStudentsCSV(file, (progress) => {
          Swal.fire({
            title: "Importando estudiantes...",
            text: `Progreso: ${progress}%`,
            didOpen: () => {
              Swal.showLoading();
            },
          });
        });
        Swal.close(); // Cierra el loading cuando termina
        setTimeout(() => {
          Swal.fire({
            title: "Importación completada",
            text: `Total: ${result.total}, Insertados o actualizados: ${result.updated}`,
            icon: "success",
          });
        }, 500); // Espera un segundo para mostrar el mensaje final
      } catch (error) {
        Swal.fire({
          title: "Error al importar",
          text: (error as Error).message,
          icon: "error",
        });
      }
    }

    const importClases = async (file: File) => {
      try {
        const result = await importClassesCSV(file, (progress) => {
          Swal.fire({
            title: "Importando clases...",
            text: `Progreso: ${progress}%`,
            didOpen: () => {
              Swal.showLoading();
            },
          });
        });
        Swal.close(); // Cierra el loading cuando termina
        setTimeout(() => {
          Swal.fire({
            title: "Importación completada",
            text: `Total: ${result.total}, Insertados o actualizados: ${result.updated}`,
            icon: "success",
          });
        }, 500); // Espera un segundo para mostrar el mensaje final
      } catch (error) {
        Swal.fire({
          title: "Error al importar",
          text: (error as Error).message,
          icon: "error",
        });
      }
    }

    const editClass = (clase_id: number) => {
        navigate("/registerClass", { state: { clase_id } })
    }

    const createClass = () => {
            navigate("/registerClass") 
    }


    const deleteClass = async (clase_id: number) => {
            const result = await Swal.fire({
            text: "¿Estás segurx de que deseas eliminar la clase?",
            icon: "question",
            showCancelButton: true,
            cancelButtonText: "No",
            confirmButtonText: "Si"
                })

        if (result.isConfirmed) {
            const { error } = await supabaseDelete("clase", "clase_id", clase_id);
    
            if (error) {
                setError(error.message);
                Swal.fire({
                    title: "Error! Pasale este mensaje a Alan o a algún encargado",
                    text: error.message,
                    icon: "error"
                })
                return;
                }
                Swal.fire({
                    title: "Clase eliminada correctamente.",
                    icon: "success"
                })
            getClases(); 
        }
    };


    const getClases = async () => {
        const { data, error } = await supabaseGet("clase")
        if (error) {
            setError(error.message)
                Swal.fire({
                    title: "Error! Pasale este mensaje a Alan o a algún encargado",
                    text: error.message,
                    icon: "error"
                })
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

    const blockInscriptions = async () => {
      // Este codigo debe bloquear todas las inscripciones en el sistema. Un valor de la DB modificable unicamente
      // por el admin

      // puedo añadirle al admin un valor a una clase, si el campo es NULL, todo es modificable, de lo contrario,
      // no


      // Primero revisemos si tenemos algo
      const {data} = await supabaseGet("alumno", "alumno_id", "1");

      if (data[0]?.alumno_class_1 !== null) {
        const result = await Swal.fire({
          title: "El borrar clases está bloqueado actualmente",
          text: "¿Quieres desactivar el bloqueo? Los alumnos podrán borrar sus inscripciones actuales.",
          icon: 'question',
          showCancelButton: true,
          cancelButtonText: 'No',
          confirmButtonText: 'Si'
        })

        // si si hay datos, significa que las clases estan bloqueadas, por lo que damos la oportunidad de
        // desbloquearlas
        if (result.isConfirmed) {
          const updates = {alumno_class_1 : null}
          const {data, error} = await supabaseUpdate("alumno", "alumno_id", "1", updates);

          if (error) {
            Swal.fire({
              title: "Error! Pasale este mensaje a Alan o a algún encargado",
              text: error.message,
              icon: "error"
            })
          }

          if (data) {
          Swal.fire({
          title: "Borrar clases desbloqueado",
          icon: "success"
        })
      }

        }
      } else {

        // Si aun no se bloquean las clases
        const result = await Swal.fire({
          title: "¿Quieres bloquear el borrar clases?",
          text: "Esto evitará que los alumnos borren su inscripcion, sin embargo les permite seguir inscribiendo clases si tienen espacio.",
          icon: 'question',
          showCancelButton: true,
          cancelButtonText: 'No',
          confirmButtonText: 'Si'
        })

        if (result.isConfirmed) {

      const {data, error} = await supabaseUpdate("alumno", "alumno_id", "1", {alumno_class_1 : "11:00:00"})
      
      if (error) {
      Swal.fire({
        title: "Error! Pasale este mensaje a Alan o a algún encargado",
        text: error.message,
        icon: "error"
      
      })
      }

      if (data) {
          Swal.fire({
          title: "Borrar clases bloqueado",
          icon: "success"
        })
      }

    }}
    }

     const goToAdminUsers = () => {
        navigate("/adminUsers");
    }


    useEffect(() => {
      // verificación sencilla de que el usuario es el admin
      if (user?.alumno_id !== 1) {
        navigate("/")
      }
      else{
        getClases()
      }
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
          className="logoutButton"
          >
          Cerrar sesión
        </button>

  <div className="csvArea">
    <input
        type="file"
        accept=".csv"
        ref={fileInputRefStudent}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <button
        style={{ marginLeft: "5px", marginRight: "5px" }}
        onClick={handleImportClick}
      >
        Importar usuarios desde CSV
      </button>
    <input
        type="file"
        accept=".csv"
        ref={fileInputRefClase}
        onChange={handleFileClassChange}
        style={{ display: 'none' }}
      />
      <button
        style={{ marginLeft: "5px", marginRight: "5px" }}
        onClick={handleImportClickClasses}
      >
        Importar clases desde CSV
      </button>
    <button style={{ marginLeft: "5px", marginRight: "5px" }}
      onClick={csvExport}
    >
      Exportar tabla de alumno y clase a CSV
    </button>
  </div>
  <GlassCard style={{ padding: "1rem", marginTop: "100px" }}>
  <img
    src="../../logo.webp"
    alt="Logo HiTec"
    style={{ width: "150px", height: "150px", marginBottom: "-40px" }}
  />

  <h1 style={{ textAlign: "center", marginTop: "60px" }}>
    Hola miembro de Staff de Hitec!
  </h1>


  <div style={{ display: "flex", flexDirection: "column", alignItems:"center", gap:"16px"  }} >
    <button onClick={goToAdminUsers}>
    Ver listas de alumnos
    </button>
  
    <button onClick={createClass}>
      Crear Clase
    </button>
    <button onClick={blockInscriptions}>
      Bloquear inscripciones
    </button>
  </div>

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
  </GlassCard>
</div>


)
}


export default Admin
