
// This type STUDENT is deprecated
type Student = {
    alumno_id : number 
    alumno_name : string
    alumno_matricula : string
    alumno_phone : number
}

type Class = {
    clase_id : number
    instructor : string
    fecha_hora : string
    capacidad_clase : number
    nombre_clase : string
    area : string
    lugar : string
}

// this is the new type used
type User = {
    alumno_id : number
    alumno_number : number // The new ID given by the excel, can be replaced by alumno_id?
    alumno_clase1_id : number // or maybe a time, the locked according to the mentor's class?
    alumno_clase2_id : number // or maybe a time, the locked according to the mentor's class?
}