
// El tipo de student es el que estaremos usando. El plan es migrar a User.
type Student = {
    alumno_id : number 
    alumno_name : string
    alumno_matricula : string
    alumno_phone : number
    alumno_class_1 : string
    alumno_class_2 : string
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
    alumno_id: number
    alumno_matricula: string
    alumno_class_1 : string // or maybe a time, the locked according to the mentor's class?
    alumno_class_2 : string // or maybe a time, the locked according to the mentor's class?
}