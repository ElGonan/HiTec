CREATE TABLE Alumno (
  alumno_ID BIGINT PRIMARY KEY,
  alumno_name TEXT NOT NULL,
  alumno_matricula TEXT NOT NULL UNIQUE,
  alumno_phone BIGINT UNIQUE NOT NULL CHECK (alumno_phone BETWEEN 1000000000 AND 9999999999)
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