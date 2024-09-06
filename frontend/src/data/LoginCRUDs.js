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

        const data = await resp.json()
        console.log('data from crud' + data)
        return data;
    } catch (error) {
        console.log(error)
    }
}