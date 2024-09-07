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