const URI = 'http://localhost:3001/blogPosts/'

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