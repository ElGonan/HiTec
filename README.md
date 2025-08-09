<p align="center">
  <img src="public/logo.webp" width="200" height="200" alt="logo del grupo">
</p>


# ¡Bienvenido al repo de la app de gestión de eventos de Hi!Tec!

Esta aplicación permite que los asistentes al evento puedan inscibirse a varias actividades, automatizando la gestión de capacidades de las actividades y asegurando la sucesión de las mismas.

# Adminsitrador
Para poder importar tanto clases como alumnos, se necesitan importar CSVs con un formato muy específico. Las plantillas se encuentran en la ruta: "misc/csvs/". No hay límite en el tamaño de los eventos ni de los alumnos. Además de esto, el administrador tiene la capacidad de exportar un CSV con la tabla de alumno-clase, formateada de la siguiente forma:

Matrícula - clase 1 - clase 2

Esto regresará todos los usuarios inscritos. 

Además el administrador puede:
- Crear actividad
- Editar actividad
- Eliminar actividad
- Bloquear capacidad para eliminar horario del alumno
- Crear alumno
- Eliminar alumno

# Alumno
La aplicación cuenta con un sistema veloz de inicio de sesión con el cual únicamente con la matrícula el usuario podrá entrar. Esto con el fin de eliminar la fatiga de login y asegurar que todos los alumnos cuentan con las mismas posibilidades de inscribir todas las actividades al iniciar todos al mismo tiempo.

El alumno puede inscribir N cantidad de actvidades, a modificarse dentro del código, actualmente está limitado a 4. 2 de estas actividades NO SON BORRABLES ni elegidas por él, ya que son de mentoría y Directores. Por lo que cuenta con 2 actividades de las cuales puede elegir.

Las actividades están organizadas por hora -> área -> actividad. Lo que permite que el alumno inscriba unicamente 1 activicad por hora.

Una vez cuente con las actividades inscritas, el alumno puede consultar su horario, junto con un mapa del campus. También cuenta con la capacidad de eliminar sus inscripciones, siempre y cuando el administrador no haya bloqueado el botón.
#
### Frameworks
- Backend:
    - Supabase
- Framework:
    - React
- Deployment:
    - Vercel

### Ejecutar en local
Clona o copia el repo, después ejecuta
```
npm install
npm run dev
```

### FIGMA
https://www.figma.com/design/FfjcxLFsMTB4jrci0TcpmT/HiTec--Registro?node-id=0-1&t=eJ6ejWF8DIj8Xy8u-1#

###### *Nota, el Figma está desactualizado


### Dependencias
- npm
- dotenv
- supabase-js
- postgres
- react-router-dom
- react-spinners
- sweetalert2
- react-responsive
- papaparse
