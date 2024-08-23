import express  from 'express'

// importo le funzioni dal controller
import { createPost, deleteSpecificPost, editSpecificPost, getSpecificPost, getAllPosts, patchSpecificPostCover } from '../controllers/posts.controller.js'
// importo cloudinary per l'upload delle immagini
import uploadCloudinary from '../middlewares/uploadCloudinary.js'

const router = express.Router()


// tutti i posts
router.get('/', getAllPosts)

// get specifico post
router.get('/:id', getSpecificPost)

// create post
router.post('/', createPost)

// edit specifico post
router.put('/:id', editSpecificPost)

// delete specifico post
router.delete('/:id', deleteSpecificPost)

// modifica cover post
// prima richiamo il middleware per effettuare l'upload della foto, poi faccio il salvataggio della cover sul db
router.patch('/:id/cover', uploadCloudinary.single('cover'), patchSpecificPostCover)

export default router