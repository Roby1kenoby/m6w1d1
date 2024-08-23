import express from 'express'

// importo dal controller le varie funzioni per le varie rotte
import { createSpecificAuthor, deleteSpecificAuthor, editSpecificAuthor, 
            getAllAuthors, getSpecificAuthor, getSpecificAuthorPosts,
            patchSpecificAuthorAvatar } from '../controllers/authors.controller.js'

// importo il middleware per l'upload dei file
import uploadCloudinary from '../middlewares/uploadCloudinary.js'

const router = express.Router()


// tutti gli authors
router.get('/', getAllAuthors)

// get specifico author
router.get('/:id', getSpecificAuthor)

// create specifico author
router.post('/', createSpecificAuthor)

// edit specifico author
router.put('/:id', editSpecificAuthor)

// delete specifico author
router.delete('/:id', deleteSpecificAuthor)

// get dei post di uno specifico author
router.get('/:id/blogPosts', getSpecificAuthorPosts)

// caricamento immagine autore specifico. Prima di effettuare la chiamata di salvataggio sul db, 
// uso il middleware per effettuare l'upload in cloud dell'avatar.
// single è un metodo della libreria multer per salvare una singola immagine
router.patch('/:id/avatar', uploadCloudinary.single('avatar'), patchSpecificAuthorAvatar)

export default router