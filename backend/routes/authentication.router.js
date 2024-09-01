import express from 'express'
import {loginUser, getUserData} from '../controllers/authentication.controller.js'
import authentication from '../middlewares/authentication.js'

const authRouter = express.Router()

authRouter.post('/login', loginUser)
// prima di dare i dettagli dell'utente loggato, verifico che il token 
// sia a posto.
authRouter.get('/me', authentication, getUserData)

export default authRouter