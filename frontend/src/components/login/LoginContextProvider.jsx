import { createContext, useEffect, useState } from "react";
import { Me } from "../../data/LoginCRUDs";
export const LoginContext = createContext()

export function LoginContextProvider({ children }) {
    const [loggedUser, setLoggedUser] = useState(null)
    // al caricamento, controllo nel local storage. Se c'è il token, allora ok. (TODO verificare il token prima di andare avanti)
    const [token, setToken] = useState(localStorage.getItem('token'))
    const value = {loggedUser, setLoggedUser, token, setToken}

    // funzione per recuperare i dati dell'utente dopo aver ricevuto un token
    const getAuthorData = async function(token){
        // se non c'è token, esco
        if(!token) return 
        
        // se no, lo suo per recuperare i dati dell'utente loggato 
        const authorData = await Me(token)
        // e li metto nello stato
        setLoggedUser(authorData)
        // e inserisco nel local storage il token
        // gestire l'errore in caso di author non trovato
        localStorage.setItem("token", token)
    }

    // useeffect che richiama la funzione soprastante ogni volta che cambia il token
    useEffect(() => {getAuthorData(token)}, [token])

    return (
        <LoginContext.Provider value={value}>
            {children}
        </LoginContext.Provider>
    );
}
