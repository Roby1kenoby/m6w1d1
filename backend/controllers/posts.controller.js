// importo gli schema per l'autore, per i post e per i commenti
import Post from '../models/postSchema.js'
import Authors from '../models/authorSchema.js'
import Comments from '../models/commentSchema.js'

// import servizio mailer
import transport from '../services/mailer.service.js'

export const getAllPosts = async (req,res) => {

    // parametri per la paginazione
    const page = req.query.page || 1
    const commentsPerPage = req.query.commentsPerPage || 999

    try {
        // mettere dentro find req.query.title ? 
        const postsListQuery = Post.find(req.query.title? {title: {$regex: req.query.title ,$options: "i"}}: {})
        
        postsListQuery.sort({surname:1, name:1})
        postsListQuery.skip((page-1)*commentsPerPage)
        postsListQuery.limit(commentsPerPage)

        const postsList = await postsListQuery

        const postsNumber = await Post.countDocuments()
        const pages = Math.ceil(postsNumber / commentsPerPage)

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
    const filePath = req.file.path ? req.file.path : "https://picsum.photos/400/600"

    console.log(data)
    console.log(filePath)

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
        const newPost = new Post({
            category: data.category,
            title: data.title,
            cover:filePath,
            readTime: JSON.parse(data.readTime),
            authorId: data.authorId,
            content: data.content
        })
        const createdPost = await newPost.save()
        // devo cercarmi l'autore tramite l'id, per recuperare l'email
        const foundAuthor = await Authors.findById(data.authorId)
        

        // richiamo servizio per invio mail, per dare conferma post inserito
        await transport.sendMail({
            from: 'Roby1kenoby@asd.it',
            to: foundAuthor.email,
            subject: "Post Created!",
            text: "Congrats, you've created a new post!",
            html: "<b>Congrats!</b> you've created a new post!"
        })

        res.status(201).send(createdPost)
    } catch (error) {
        console.log(error)
        res.status(400).send(error)
    }
}

export const editSpecificPost = async (req,res) => {
    const id = req.params.id
    const data = req.body
    const filePath = req.file.path ? req.file.path : "https://picsum.photos/400/600"

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
        const editedPost = {
            category: data.category,
            title: data.title,
            cover:filePath,
            readTime: JSON.parse(data.readTime),
            authorId: data.authorId,
            content: data.content
        }

        console.log(editedPost)
        const updatedPost = await Post.findByIdAndUpdate(id, editedPost, { new: true })
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
        // importante, è necessario sempre fare anche un save, se no l'elemento non viene davvero rimosso
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

// gestione dei commenti

export const createPostComment = async (req,res) => {
    const data = req.body

    try {
        const newComment = new Comments(data)
        const createdComment = await newComment.save()
        res.status(201).send(createdComment)
    } catch (error) {
        console.log(error)
        res.status(400).send(error)
    }
}

export const getAllPostComments = async (req,res) => {
    const id = req.params.id

    // parametri per la paginazione
    const page = req.query.page || 1
    const commentsPerPage = req.query.commentsPerPage || 999

    try {
        const commentsListQuery = Comments.find({postId: id})
        
        commentsListQuery.skip((page-1)*commentsPerPage)
        commentsListQuery.limit(commentsPerPage)

        const commentsList = await commentsListQuery

        const commentsNumber = commentsList.length
        const pages = Math.ceil(commentsNumber / commentsPerPage)

        const data = {
            commentsList,
            commentsNumber,
            pages
        } 

        res.send(data)
    } 
    catch (error) {
        console.log(error)
        res.status(400).send(error)
    }
}

export const getSpecificPostComment = async (req,res) => {
    const commentId = req.params.commentId
    try {
        const foundComment = await Comments.findById(commentId)
        console.log(foundComment)
        res.status(200).send(foundComment)
    } catch (error) {
        console.log('Post not found')
        res.status(404).send('Post not found')
    }
}

export const editSpecificPostComment = async (req, res) => {
    const commentId = req.params.commentId
    const data = req.body

    try {
        // verifico se il commento esiste già tramite l'id
        const commentExists = await Comments.exists({_id:commentId})
        // se non esiste
        if(!commentExists){
            return res.status(404).send(`L'id ${id} non esiste nel DB`)
        }
        // altrimenti cerco di modificare
        const updatedComment = await Comments.findByIdAndUpdate(commentId, data, { new: true })
        await updatedComment.save()
        res.status(202).send(updatedComment)

    } catch (error) {
        console.log(error)
        res.status(400).send(error)
    }
}

export const deleteSpecificPostComment = async (req, res) => {
    const commentId = req.params.commentId

    try {
        const commentExists = await Comments.exists({_id: commentId})
        if (!commentExists) {
            return res.status(404).send(`L'id ${commentId} non esiste nel DB`)
        }

        const deletedComment = await Comments.findByIdAndDelete(commentId, {new: true})
        res.status(202).send(deletedComment)

    } catch (error) {
        console.log(error)
        res.status(400).send(error)
    }
}