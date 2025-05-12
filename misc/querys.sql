create TABLE Alumno (
  alumno_ID SERIAL PRIMARY KEY,
  alumno_name VARCHAR(100) NOT NULL,
  alumno_phone UNIQUE BIGINT NOT NULL CHECK (alumno_phone BETWEEN 1000000000 AND 9999999999)
);

create TABLE Clase (
  clase_ID SERIAL PRIMARY KEY,
  instructor varchar(50) NOT NULL,
  fecha_hora date NOT NULL,
  capacidad_Clase int NOT NULL CHECK (capacidad_Clase >= 0),
  nombre_clase varchar(100) NOT NULL
);


create TABLE Alumno_Clase (
  inscripcion_ID SERIAL PRIMARY KEY,
  alumno_ID INT NOT NULL REFERENCES Alumno(alumno_ID),
  clase_ID INT NOT NULL REFERENCES Clase(clase_ID),
  UNIQUE (alumno_id, clase_id)
);
