/*  Get the context of the user, to avoid many
    calls to the API.
*/

import { createContext, useContext, useState } from "react";
import supabaseGet from "../lib/supabaseGet";
import Swal from "sweetalert2";

type UserContextType = {
  user: Student | User| null;
  login: (id: string) => Promise<void>; // Encapsula la lógica de fetch
  logout: () => void;
  isLoading: boolean;
};

// eslint-disable-next-line react-refresh/only-export-components
export const userContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children:React.ReactNode }) => {

    const [user, setUser] = useState<Student | User | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const login = async (id: string) => {
        setIsLoading(true);
        try {
            const { data, error } = await supabaseGet("alumno", "alumno_id", id);
            // if there's no User
            if (error || !data){
                throw new Error("Algo falló" + error?.message || "No hay datos!");
            }
            if (data.length === 0){
            await Swal.fire({
            title: "El usuario ingresado no existe",
            text: "Por favor revisa el ID que ingresaste, debe ser el que se te brindó en la bienvenida. De otra forma no podrás hacer tu horario",
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

// eslint-disable-next-line react-refresh/only-export-components
export const useUser = () => {
    const context = useContext(userContext);
    if (!context) throw new Error('useUser debe ser usado con un UserProvider');
    return context;
};