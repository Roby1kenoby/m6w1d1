import { createContext, useEffect, useState } from "react";
import { Me } from "../../data/LoginCRUDs";
export const LoginContext = createContext()

export function LoginContextProvider({ children }) {
    const [loggedUser, setLoggedUser] = useState(null)
    const [token, setToken] = useState(null)
    
    const manageToken = function (){
        // recupero l'eventuale token dall'url (ricevuto da un login oauth)
        const objUrlParams = new URLSearchParams(window.location.search)
        const urlToken = objUrlParams.get('token')
        // verifico se è presente un token nel localstorage
        const storageToken = localStorage.getItem('token')

        // se c'è il token nell'url, è il più recente e uso quello perchè è di sicuro il più recente
        if(urlToken){
            setToken(urlToken)
            localStorage.setItem('token', urlToken)
        }

        // se non c'è nell'url, ma c'è nello storage, allora considero quello
        if(!urlToken && storageToken){
            setToken(storageToken)
        }
    }
    

    const value = {loggedUser, setLoggedUser, token, setToken}

    // funzione per recuperare i dati dell'utente dopo aver ricevuto un token
    const getAuthorData = async function(token){
        // se non c'è token, esco
        if(!token) return
        
        // se no, lo suo per recuperare i dati dell'utente loggato  
        try {
            const authorData = await Me(token)
            
            // se non mi viene restituito un utente, allora vuol dire che il token non è valido
            // lancio l'errore, così viene intercettato sotto e pulisco il localStorage
            if(!authorData) throw Error('Token non valido')

            // e li metto nello stato
            setLoggedUser(authorData)
            // e inserisco nel local storage il token
            // gestire l'errore in caso di author non trovato
            localStorage.setItem("token", token)    
        } catch (error) {
            console.log(error)
            // pulisco la cache in modo che vengano ripresentate le schermate di login
            setToken('')
            localStorage.clear()
        }
    }



    // useeffect che richiama la funzione soprastante ogni volta che cambia il token
    useEffect(() => {getAuthorData(token)}, [token])

    useEffect(manageToken, [])


    return (
        <LoginContext.Provider value={value}>
            {children}
        </LoginContext.Provider>
    );
}
