import express  from 'express'

// importo le funzioni dal controller
import { createPost, deleteSpecificPost, editSpecificPost, getSpecificPost, 
        getAllPosts, patchSpecificPostCover, 
        // controller commenti
        createPostComment, getAllPostComments, getSpecificPostComment, 
        editSpecificPostComment, deleteSpecificPostComment } from '../controllers/posts.controller.js'
// importo cloudinary per l'upload delle immagini
import uploadCloudinary from '../middlewares/uploadCloudinary.js'
// import mw per gestire l'autenticazione
import authentication from '../middlewares/authentication.js'
const router = express.Router()


// da qui in avanti, le rotte hanno bisogno di avere un utente autenticato
router.use(authentication)

// tutti i posts
router.get('/', getAllPosts)

// get specifico post
router.get('/:id', getSpecificPost)

// create post
router.post('/', uploadCloudinary.single('cover'), createPost)

// edit specifico post
router.put('/:id', editSpecificPost)

// delete specifico post
router.delete('/:id', deleteSpecificPost)

// modifica cover post
// prima richiamo il middleware per effettuare l'upload della foto, poi faccio il salvataggio della cover sul db
router.patch('/:id/cover', uploadCloudinary.single('cover'), patchSpecificPostCover)




// rotte per la gestione dei commenti ai post
// tutti i commenti del post
router.get('/:id/comments', getAllPostComments)

// commento specifico del post
router.get('/:id/comments/:commentId', getSpecificPostComment)

// create comment
router.post('/:id/comments', createPostComment)

// edit specifico commento del post
router.put('/:id/comments/:commentId', editSpecificPostComment)

// delete specifico commento del post
router.delete('/:id/comments/:commentId', deleteSpecificPostComment)

export default router