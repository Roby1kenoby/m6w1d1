import express from 'express'
import authorsRouter from './routes/authors.router.js'
import postsRouter from './routes/posts.router.js'
// import environment
import 'dotenv/config'
// import per il DB
import mongoDbConnection from './db.js'
// import librerie per le chiamate api
import morgan from 'morgan'
import helmet from 'helmet'
import cors from 'cors'

//creo il server
const server = express()
// recupero la porta dal file env
const port = process.env.PORT || 3001


// per poter dialogare usando i json
server.use(express.json())

// utilizzo il middleware cors per specificare a chi rispondere
// così risponde a chiunque.
server.use(cors())
server.use(morgan('dev'))
server.use(helmet())
server.use(cors())
// collegamento al mongoDB, se non uso un file esterno
// mongoose.connect(connectionString).then(() => {
//     console.log('connessione al db ok')
//     }).catch((err) => {
//     console.log(err)
//     })




// collegamento al mongoDB se uso il file importato
mongoDbConnection()

// prefisso authors che verrà usato su tutte le rotte sottostanti
// definite nel file route apposito
server.use('/authors', authorsRouter)
server.use('/blogPosts', postsRouter)

server.listen(port, () => {
    console.log(`Server attivo sulla porta ${port}`)
})

