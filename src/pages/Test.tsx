
import { useState } from 'react';
import supabase from '../supabase/supabaseClient';


const Test = () => {
  const [claseId, setClaseId] = useState<number>(1);
  const [requests, setRequests] = useState<number>(5);
  const [results, setResults] = useState<Array<{ success: boolean; message: string }>>([]);
  const [capacity, setCapacity] = useState<number | null>(null);

  // 1. Función para probar la inscripción concurrente
  const testConcurrency = async () => {
    setResults([]);
    
    // Obtener capacidad inicial
    const { data: initialData } = await supabase
      .from('clase')
      .select('capacidad_clase')
      .eq('clase_id', claseId)
      .single();
      
    setCapacity(initialData?.capacidad_clase || 0);

    // Simular 'requests' inscripciones simultáneas
    const promises = Array.from({ length: requests }).map(async (_, i) => {
      try {
        const { data, error } = await supabase
          .rpc('decrementar_capacidad', { p_clase_id: claseId });

        if (error) {
          return { success: false, message: `Error en solicitud ${i + 1}: ${error.message}` };
        }

        return data?.error 
          ? { success: false, message: `Solicitud ${i + 1}: ${data.error}` }
          : { success: true, message: `Solicitud ${i + 1}: ¡Éxito!` };
      } catch (err) {
        return { success: false, message: `Error crítico en ${i + 1}: ${err instanceof Error ? err.message : String(err)}` };
      }
    });

    // Esperar todas las respuestas
    const results = await Promise.all(promises);
    setResults(results);

    // Obtener capacidad final
    const { data: finalData } = await supabase
      .from('clase')
      .select('capacidad_clase')
      .eq('clase_id', claseId)
      .single();
      
    setCapacity(finalData?.capacidad_clase);
  };

  // 2. Resetear capacidad (para pruebas repetidas)
  const resetCapacity = async (newCapacity: number) => {
    await supabase
      .from('clase')
      .update({ capacidad_clase: newCapacity })
      .eq('clase_id', claseId);
      
    setCapacity(newCapacity);
    setResults([]);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px' }}>
      <h2>Prueba de Concurrencia</h2>
      
      <div style={{ marginBottom: '15px' }}>
        <label>
          ID de Clase: 
          <input 
            type="number" 
            value={claseId}
            onChange={(e) => setClaseId(Number(e.target.value))}
            style={{ marginLeft: '10px' }}
          />
        </label>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label>
          N° de Solicitudes: 
          <input 
            type="number" 
            value={requests}
            onChange={(e) => setRequests(Number(e.target.value))}
            min="1"
            style={{ marginLeft: '10px' }}
          />
        </label>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <button 
          onClick={testConcurrency}
          style={{ marginRight: '10px', padding: '8px 15px' }}
        >
          Probar Concurrencia
        </button>
        
        <button 
          onClick={() => resetCapacity(40)}
          style={{ padding: '8px 15px' }}
        >
          Resetear Capacidad a 40
        </button>
      </div>

      {capacity !== null && (
        <p>
          <strong>Capacidad actual:</strong> {capacity}
        </p>
      )}

      <div style={{ marginTop: '20px' }}>
        <h3>Resultados:</h3>
        <ul>
          {results.map((result, index) => (
            <li 
              key={index}
              style={{ color: result.success ? 'green' : 'red' }}
            >
              {result.message}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Test


/*
 <div>
      <h1>Hitec Register</h1>
      <p>Welcome to the Hitec Register app!</p>
      <p>Check the console for Supabase client details.</p>
      <div className="Alumnos">
        {data?.map((alumno, index) => (
          <div key={`${alumno.alumno_id}-${index}`}>
            <p>Nombre del alumno: {alumno.alumno_name}</p>
            <p>Teléfono del alumno: {alumno.alumno_phone}</p>
          </div>
        ))}
      </div>
      <div className="Clases">
        {clases?.map((clase,index) => (
          <div key={`${clase.id}-${index}`}>
            <p>Instructor de la clase: {clase.instructor}</p>
            <p>Fecha y hora de la clase: {clase.fecha_hora}</p>
            <p>Capacidad de la clase: {clase.capacidad_clase}</p>
            <p>Nombre de la clase: {clase.nombre_clase}</p>
          </div>
        ))}
      </div>

      <div className="AddAlumno">
        <h1>Favor de llenar los campos del alumno:</h1>
        <div>
        {error && (<h2>Error: {error?.toString()}</h2>)}        
      </div>
      <label>phone: </label>
        <input type="text" id="Student_phone" name="phone" value={strPhone} onChange={(e) => setStrPhone(e.target.value)}></input>
        <br></br>
        <label>Full name: </label>
        <input type="text" id="Student_name" name="Nombre" value={alumno_name} onChange={(e) => setName(e.target.value)}></input>
        <br></br>
        <button onClick={(e) => addStudent(e)}>Enviar datos</button>
      
      </div>
    </div>

* */






// Just while I do testing, I'll comment the whole page out

/*
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
*/
