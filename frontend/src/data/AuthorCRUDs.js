// file che contiene tutte le operazioni CRUD usate dall'app per le questioni di login
const URI = 'http://localhost:3001/authors'

// se devo passare dei file, devo avercelo come argomento
export const NewAuthor = async (authorData, file) => {
    try {
        // formData è un tipo di dati che permette il passaggio di file
        const formData = new FormData()
        // per ogni elemento dell'oggetto, devo fare append al formData creato, compreso il file
        // potrei fare un automatismo, ma rischio poi di permettere l'inserimento di valori in più
        // sul db da attori malevoli, rispetto a quelli che mi aspetto io
        formData.append('email', authorData.email)
        formData.append('password', authorData.password)
        formData.append('name', authorData.name)
        formData.append('surname', authorData.surname)
        formData.append('birthDate', authorData.birthDate)
        formData.append('avatar', file)
        
        const resp = await fetch(URI,{
            // non è necessario specificare il content-type perchè se non indico io json in automatico è 
            // multipart/formdata
            // headers:{
            //     "Content-type": "application/json"
            // },
            method: 'POST',
            body: formData
        })
        const data = await resp.json()
        console.log(data)

        if(!resp.ok) throw new Error(resp)
        
        return data
    } catch (error) {
        console.log(error)
    }
}