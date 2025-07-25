/* eslint-disable react-refresh/only-export-components */


/*  Obtiene el contexto del usuario para evitar multiples llamadas
    a la DB
*/

import { createContext, useContext, useState, useEffect } from "react";
import supabaseGet from "../lib/supabaseGet";
import Swal from "sweetalert2";

type UserContextType = {
  user: Student | User| null;
  login: (id: string) => Promise<void>; // Encapsula la lógica de fetch
  logout: () => void;
  isLoading: boolean;
};

export const userContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children:React.ReactNode }) => {

    const [isLoading, setIsLoading] = useState(false);

    // Obtenemos el usuario de localStorage si existe
    const [user, setUser] = useState<Student | User | null>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('user');
            return saved ? JSON.parse(saved) : null;
        }
        return null;
    })

    // Al cambio del usuario, lo guardamos en localstorage.
    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
        }
    }, [user])



    const login = async (matricula: string) => {
        setIsLoading(true);
        try {
            const { data, error } = await supabaseGet("alumno", "alumno_matricula", matricula);
            if (error || !data){
                throw new Error("Algo falló" + error?.message || "No hay datos!");
            }
            // En caso de que no haya usuario
            if (data.length === 0){
            await Swal.fire({
            title: "Matrícula no encontrada",
            text: "Por favor revisa la matrícula ingresada. De otra forma no podrás hacer tu horario",
            icon: 'error',
            })
            } else{
            setUser(Array.isArray(data) ? data[0] : data);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => setUser(null);

    return (
        <userContext.Provider value={{ user, login, logout, isLoading }}>
            {children}
        </userContext.Provider>
    );

};

export const useUser = () => {
    const context = useContext(userContext);
    if (!context) throw new Error('useUser debe ser usado con un UserProvider');
    return context;
};
