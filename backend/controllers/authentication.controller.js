import Author from "../models/authorSchema.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import 'dotenv/config'

export const loginUser = async (req,res) => {
    const data = req.body
    
    //ricerco l'utente tramite la mail
    const author = await Author.findOne({email: data.email})
    
    // se non esiste l'autore, errore
    if(!author) return res.status(400).send('Unauthorized Access')

    // se esiste, verifico la password. Uso compareSync perché se uso invece comapre
    // restituisce una Promise, e quindi devo usare then o async \ await
    const correctPassword = bcrypt.compareSync(data.password, author.password)
    // se errata, restituisco errore.
    if(!correctPassword) return res.status(400).send('Unauthorized Access')
    
    // se siamo arrivati fin qui, rilascio il token jwt
    jwt.sign(
    // payload (utile per recuperare l'id dell'utente)
    {
        userId: author.id
    },
    // secret per firmare il token 
    process.env.JWT_SECRET,
    // opzioni (durata del token)
    {
        expiresIn: '1h'
    },
    // callback (non posso usare async await)
    (err, jwtToken) => {
        if(err) return res.status(500).send('Server error')
        res.send({
            token: jwtToken
        })
    }
)

    

    
}   

export const getUserData = (req,res) => {
    return res.send(req.loggedUser);
}