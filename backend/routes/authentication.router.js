import express from 'express'
import {loginUser, getUserData, callbackGoogle} from '../controllers/authentication.controller.js'
import authentication from '../middlewares/authentication.js'
import passport from 'passport'

const authRouter = express.Router()

authRouter.post('/login', loginUser)
// prima di dare i dettagli dell'utente loggato, verifico che il token 
// sia a posto tramite middleware.
authRouter.get('/me', authentication, getUserData)

// su questa rotta richiamo passport, con la config google, e gli dico che mi interessano profile e email
// dalla risposta (questo è ciò che ho impostato come richiesta su cloud.google)
authRouter.get('/login-google', passport.authenticate('google',{
    scope: ['profile','email']
}))

// questa è la rotta che google mi chiamerà dopo aver fatto autenticazione corretta.

authRouter.get('/callback-google', passport.authenticate('google',{
    session:false
}), callbackGoogle)

export default authRouter