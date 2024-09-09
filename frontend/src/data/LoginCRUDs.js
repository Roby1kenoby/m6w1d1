const URI = 'http://localhost:3001/auth/'

export const Login = async (loginData) => {
    try {
        // invio dati login
        const resp = await fetch(URI+'login', {
            headers: {
                'Content-type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(loginData)
        })

        const data = await resp.json()
        return data
    } catch (error) {
        console.log(error)
    }
}

export const Me = async(token) => {
    try {
        const resp = await fetch(URI+'me',{
            headers:{
                Authorization: `Bearer ${token}`,
                'Content-type': 'application/json'
            },
            method: 'GET'
        })
        // se non mi viene trovato l'autore, vuol dire che il token non è valido.
        // allora lancio un errore
        if(!resp.ok) throw Error('Token non valido')
        
        // altrimenti restituisco l'utente individuato
        const data = await resp.json()
        return data;

    } catch (error) {
        console.log(error)
    }
}

export const LoginWithGoogle = async function() {
    window.location.href='http://localhost:3001/auth/login-google'
    // try {
    //     const resp = await fetch(URI+'login-google', {
    //         method: 'GET',
    //     })
    //     console.log(resp)
    //     const data = await resp.json()
    //     console.log(data)
    //     return data
    // } catch (error) {
    //     console.log(error)
    // }
}