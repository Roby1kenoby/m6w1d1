import jwt from 'jsonwebtoken'
import Author from '../models/authorSchema.js'
import 'dotenv/config'

export default (req, res, next) => {
    const authData = req.headers.authorization
    if(!authData) return res.status(400).send("Unauthorized access")
    // recupero i dati dall'header di authorization
    const authParts = authData.split(' ')
    // controllo che ci siano 2 argomenti
    if(authParts.length != 2) return res.status(400).send("Unauthorized access 2")
    // controllo che il primo sia bearer
    if(authParts[0] != 'Bearer') return res.status(400).send("Unauthorized access 3")
    
    const token = authParts[1]
    
    // verifico il token ed estraggo eventualmente il payload
    jwt.verify(token, 
        // secret per lo sbustamento della firma
        process.env.JWT_SECRET, 
        // funzione di callback per gestire il risultato dello sbustamento
        async (err, payload) => {
            if(err) return res.status(500).send('Server Error' + err)
            // recupero l'autore, ma non ci metto dentro la password.
            const author = await Author.findById(payload.userId).select('-password')
            // se non trovo l'utente
            if(!author) return res.status(400).send('Unauthorized access')
            // altrimenti invio i dati individuati dell'autore
            req.loggedUser = author
            // passo al prossimo middleware.
            next()
    })
}
