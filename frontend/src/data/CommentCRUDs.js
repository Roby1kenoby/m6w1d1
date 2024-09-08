import { jwtDecode } from "jwt-decode";

const URI = 'http://localhost:3001/blogPosts/'

export const getPostComments = async function(id, token){
    try {
        const resp = await fetch(URI+id+'/comments',{   
            headers:{
                Authorization: `Bearer ${token}`
            },
            method: 'GET'
        })
        const data = await resp.json()
        return data.commentsList;
    } catch (error) {
        console.log(error)
    }
} 

export const savePostComment = async function(id, postData, token){
    // recupero l'id dell'utente dal token
    const idUtente = jwtDecode(token)["userId"]
    postData.authorId = idUtente
    postData.postId = id
    console.log(postData)
    try {
        const resp = await fetch(URI + id + '/comments',{
            headers:{
                Authorization: 'Bearer ' + token,
                'Content-type': 'Application/json'
            },
            method:'POST',
            body:JSON.stringify(postData)
        })

        const data = await resp.json()
        if(!data) throw Error('Errore nel salvataggio del commento')
        console.log(data)
        return data

    } catch (error) {
        console.log(error)
    }
}

export const editPostComment = async function(id, postData, token){
    try {
        const resp = await fetch(URI + id + '/comments/' + postData._id,{
            headers:{
                Authorization: 'Bearer ' + token,
                'Content-type': 'Application/json'
            },
            method:'PUT',
            body:JSON.stringify(postData)
        })

        const data = await resp.json()
        if(!data) throw Error('Errore nella modifica del commento')
        console.log(data)
        return data

    } catch (error) {
        console.log(error)
    }
}

export const deletePostComment = async function(id, commentId, token){
    console.log(id, commentId)
    try {
        const resp = await fetch(URI + id + '/comments/' + commentId,{
            headers:{
                Authorization: 'Bearer ' + token,
                'Content-type': 'Application/json'
            },
            method:'DELETE'
        })

        const data = await resp.json()
        return data
    } catch (error) {
        console.log(error)
    }
}