// importo gli schema per l'autore e per i post
import Post from '../models/postSchema.js'
import Authors from '../models/authorSchema.js'
// import servizio mailer
import transport from '../services/mailer.service.js'

export const getAllPosts = async (req,res) => {

    // parametri per la paginazione
    const page = req.query.page || 1
    const postsPerPage = req.query.postsPerPage || 5

    try {
        const postsListQuery = Post.find({})
        
        postsListQuery.sort({surname:1, name:1})
        postsListQuery.skip((page-1)*postsPerPage)
        postsListQuery.limit(postsPerPage)

        const postsList = await postsListQuery

        const postsNumber = await Post.countDocuments()
        const pages = Math.ceil(postsNumber / postsPerPage)

        const data = {
            postsList,
            postsNumber,
            pages
        } 

        res.send(data)
    } 
    catch (error) {
        console.log(error)
        res.status(400).send(error)
    }
}

export const getSpecificPost = async (req, res) => {
    const id = req.params.id
    try {
        const foundPost = await Post.findOne({_id: id})
        res.status(200).send(foundPost)
    } catch (error) {
        console.log('Post not found')
        res.status(404).send('Post not found')
    }
}

export const createPost = async (req,res) => {
    // nel body ci sarà l'oggetto da creare
    const data = req.body

    // uso la exists per cercare se esiste già qualcosa con lo stesso titolo e content
    // se esiste, eviterò di fare la insert, così gestisco l'errore a monte, e non a valle dell'inserimento, che è più complicato.
    const postExists = await Post.exists({title: data.title, content: data.content})
    // se esiste già lq'autore
    if (postExists){
        // restituisco un conflitto e dico che c'è già l'oggetto
        console.log(`Un post con questo titolo e contenuto è già presente nel db`)
        res.status(409).send(`Post già presente nel DB`)
        return
    }
    // se non esiste, tento l'inserimento.
    try {
        const newPost = new Post(data)
        const createdPost = await newPost.save()
        res.status(201).send(createdPost)
    } catch (error) {
        console.log(error)
        res.status(400).send(error)
    }
}

export const editSpecificPost = async (req,res) => {
    const id = req.params.id
    const data = req.body

    try {
        // verifico se il post esiste già tramite l'id
        const postExists = await Post.exists({_id:id})
        // se non esiste
        if(!postExists){
            return res.status(404).send(`L'id ${id} non esiste nel DB`)
        }
        // verifico che non ci sia un post con stesso titolo e content, ma scritto da altri (altro id)
        const postAlreadyExists = await Post.exists({title: data.title, content: data.content, _id:{$ne: id}})
        if(postAlreadyExists){
            return res.status(404).send(`È già presente un post con lo stesso titolo e content nel DB`)
        }

        // altrimenti cerco di modificare
        const updatedPost = await Post.findByIdAndUpdate(id, data, { new: true })
        await updatedPost.save()
        res.status(202).send(updatedPost)

    } catch (error) {
        console.log(error)
        res.status(400).send(error)
    }
}

export const deleteSpecificPost = async (req,res) => {
    const id = req.params.id
    try {
        const postExists = await Post.exists({_id:id})
        // se non esiste
        if(!postExists){
            return res.status(404).send(`L'id ${id} non esiste nel DB`)
        }
        // per farmi restituire l'utente appena eliminato, devo usare le opzioni e chiedere new:true
        const deletedPost = await Post.findByIdAndDelete(id, {new: true})
        res.status(202).send(deletedPost)
    } catch (error) {
        console.log(error)
        res.status(400).send(error)
    }
}

export const patchSpecificPostCover = async (req,res) => {
    const {id} = req.params
    const filePath = req.file.path
    const readTime = JSON.parse(req.body.readTime)
    try {
        // verifico se il post esiste già tramite l'id
        const postExists = await Post.exists({_id:id})
        // se non esiste
        if(!postExists){
            return res.status(404).send(`L'id ${id} non esiste nel DB`)
        }
        
        // se il post esiste allora gli cambio l'immagine
        const updatedPost = await Post.findByIdAndUpdate(id, {cover:filePath, readTime:readTime}, { new: true })
        await updatedPost.save()

        // devo recuperare i dati dell'autore, per potergli inviare una mail di conferma
        // cambio cover dell'album
        const authorId = req.body.authorId
        const foundAuthor = await Authors.findById(authorId)
        const authorMail = foundAuthor.email
        
        
        await transport.sendMail({
            from: 'Roby1kenoby@asd.it',
            // mail presa direttamente dalla richiesta
            to: authorMail,
            subject: "Post Cover Changed!",
            text: "Congrats, you changed your post' cover!",
            html: "<b>Congrats!</b> You changed your post' cover!"
        })

        res.status(202).send(updatedPost)
    } catch (error) {
        console.log(error)
        res.status(400).send(error)
    }

}