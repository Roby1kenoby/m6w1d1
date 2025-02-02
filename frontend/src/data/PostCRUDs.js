const URI = `${process.env.REACT_APP_API_URL}/blogPosts/`

export const getAllPosts = async function(searchString, token){
    // se c'è la searchString allora la aggiungo all'url
    const urlSearch = searchString && `?title=${searchString}`
    const requestUrl =  URI + urlSearch

    try {
        const resp = await fetch(requestUrl, {
            headers:{
                Authorization: 'Bearer ' + token
            }
        })

        if(!resp.ok) throw Error('Problema nel recuperare i post')
        const data = await resp.json()
        return(data)

    } catch (error) {
        console.log(error)
    }
}

export const getPostData = async function(id, token){
    try {
        const resp = await fetch(URI+id,{   
            headers:{
                Authorization: `Bearer ${token}`
            },
            method: 'GET'
        })
        const data = await resp.json()
        return data;
    } catch (error) {
        console.log(error)
    }
} 

export const createNewPost = async function (postData, token, file){
    try {
        const formData = new FormData()
        formData.append('category', postData.category)
        formData.append('title', postData.title)
        formData.append('readTime', JSON.stringify(postData.readTime))
        formData.append('authorId', postData.authorId)
        formData.append('content', postData.content)
        formData.append('cover', file)

        const resp = await fetch(URI,{
            headers:{
                Authorization: 'Bearer ' + token
            },
            method: 'POST',
            body: formData
        })

        if(!resp.ok) throw Error('Salvataggio del post fallito')
        
        const data = await resp.json()
        return(data)

    } catch (error) {
        console.log(error)
        alert("Attenzione, compilare tutti i campi obbligatori!")
    }
}

export const editPost = async function(id, postData, token, file){
    try {
        const formData = new FormData()
        formData.append('category', postData.category)
        formData.append('title', postData.title)
        formData.append('readTime', JSON.stringify(postData.readTime))
        formData.append('authorId', postData.authorId)
        formData.append('content', postData.content)
        formData.append('cover', file)

        const resp = await fetch(URI + '/' + id,{
            headers:{
                Authorization: 'Bearer ' + token
            },
            method: 'PUT',
            body: formData
        })

        if(!resp.ok) throw Error('Modifica del post fallita')
        
        const data = await resp.json()
        return(data)

    } catch (error) {
        console.log(error)
        alert("Attenzione, compilare tutti i campi obbligatori!")
    }
}

export const deletePost = async function(id, token){
    try {
        const resp = await fetch(URI + '/' + id,{
            headers:{
                Authorization: 'Bearer ' + token
            },
            method: 'DELETE'
        })

        if(!resp.ok) throw Error('Eliminazione del post fallita')
        
        const data = await resp.json()
        return(data)
    } catch (error) {
        console.log(error)
    }
}