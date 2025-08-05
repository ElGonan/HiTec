/*
The table Alumno has now the alumno_class_1 and alumno_class_2
since those are the classes we WONT be modifying
*/


CREATE TABLE Alumno (
  alumno_ID BIGINT PRIMARY KEY,
  alumno_name TEXT NOT NULL,
  alumno_matricula TEXT NOT NULL UNIQUE,
  alumno_phone BIGINT UNIQUE NOT NULL CHECK (alumno_phone BETWEEN 1000000000 AND 9999999999),
  alumno_class_1 time,
  alumno_class_2 time
);


create TABLE Clase (
  clase_ID SERIAL PRIMARY KEY,
  instructor TEXT NOT NULL,
  fecha_hora date NOT NULL,
  area TEXT NOT NULL,
  lugar TEXT NOT NULL,
  capacidad_Clase int NOT NULL CHECK (capacidad_Clase >= 0),
  nombre_clase TEXT NOT NULL
);


create TABLE Alumno_Clase (
  inscripcion_ID SERIAL PRIMARY KEY,
  alumno_ID INT NOT NULL REFERENCES Alumno(alumno_ID),
  clase_ID INT NOT NULL REFERENCES Clase(clase_ID),
  UNIQUE (alumno_id, clase_id)
);


/*
To avoid vulnerabilities, all varchars where replaced with TEXT

*/


/*
Other queries
*/

CREATE OR REPLACE FUNCTION decrementar_capacidad(p_clase_id int)
RETURNS json AS $$
DECLARE
  capacidad_actual int;
BEGIN
  SELECT capacidad_clase INTO capacidad_actual
  FROM clase WHERE clase_id = p_clase_id FOR UPDATE;
  
  IF capacidad_actual > 0 THEN
    UPDATE clase SET capacidad_clase = capacidad_clase - 1
    WHERE clase_id = p_clase_id;
    RETURN json_build_object('success', true);
  ELSE
    RETURN json_build_object('error', 'No hay cupo');
  END IF;
END;
$$ LANGUAGE plpgsql;





CREATE OR REPLACE FUNCTION increment() 
RETURNS integer AS $$
BEGIN
  RETURN 1; -- Retorna +1 para sumar 1 a capacidad_clase
END;
$$ LANGUAGE plpgsql;




CREATE OR REPLACE FUNCTION decrement() 
RETURNS integer AS $$
BEGIN
  RETURN -1; -- Retorna -1 para restar 1 a capacidad_clase
END;
$$ LANGUAGE plpgsql;


