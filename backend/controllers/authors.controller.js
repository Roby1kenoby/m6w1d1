// importo gli schema per l'autore e per i post
import Author from '../models/authorSchema.js'
import Post from '../models/postSchema.js'
// import servizio mailer
import transport from '../services/mailer.service.js'
// import libreria per crypt password
import bcrypt from 'bcrypt'


export const getAllAuthors = async (req,res) => {

    // parametri per la paginazione
    const page = req.query.page || 1
    const authorsPerPage = req.query.authorsPerPage || 3

    try {
        // da qui sto iniziando a costruire una query che al suo interno ha una promise.
        // se ci metto subito await davanti, lui esegue la query, quindi i passaggi successivi dedicati alla paginazione
        // non funzioneranno perchè il risultato della query è un Array, e il primo step successivo è il sort, che però
        // viene interpretato come sort di Javascript, e non come sort di mongoose (che avviene sul DB)
        const authorsListQuery = Author.find({})
        

        // qui sto ancora editando la query sul DB, facendo un sort
        authorsListQuery.sort({surname:1, name:1})
        // qui continuo l'edit della query per la paginazione ecc.
        // se siamo a pagina 1, page-1 = 0 e quindi non skippa niente, altrimenti salterà un tot di record
        authorsListQuery.skip((page-1)*authorsPerPage)
        // fornisco gli autori, ma al massimo quanti sono indicati in authorsPerPage
        authorsListQuery.limit(authorsPerPage)

        // a questo punto, grazie all'await effettuo la query complessiva, e mi restituisce l'array con i risultati.
        const authorsList = await authorsListQuery

        // nr totale di authors
        const authorsNumber = await Author.countDocuments()
        const pages = Math.ceil(authorsNumber / authorsPerPage)

        // metodo alternativo per effettuare query su una sola "riga", l'await all'inizio la fa partire subito.
        // i punti concatenano le sucessive parti della query

        // const authorsList = await Author.find()
        //     .sort({surname:1, name:1})
        //     .skip((page-1)*authorsPerPage)
        //     .limit(authorsPerPage)
        
        // const authorsNumber = await Author.countDocuments()

        const data = {
            authorsList,
            authorsNumber,
            pages
        } 

        res.send(data)
    } catch (error) {
        console.log(error)
        res.status(400).send(error)
    }
}

export const getSpecificAuthor = async (req, res) => {
    const id = req.params.id
    try {
        const foundAuthor = await Author.findOne({_id: id})
        res.status(200).send(foundAuthor)
    } catch (error) {
        console.log('Author not found')
        res.status(404).send('Author not found')
    }
}

export const createSpecificAuthor = async (req,res) => {
    // nel body ci sarà l'oggetto da creare
    const data = req.body

    // uso la exists per cercare se esiste già qualcosa nel db con quella mail.
    // se esiste, eviterò di fare la insert, così gestisco l'errore a monte, e non a valle dell'inserimento, che è più complicato.
    const authorExists = await Author.exists({email: data.email})
    // se esiste già l'autore
    if (authorExists){
        // restituisco un conflitto e dico che c'è già l'oggetto
        console.log(`l'email ${data.email} esiste già nel db`)
        res.status(409).send(`Email ${data.email} already exists in DB`)
        return
    }
    // se non esiste, tento l'inserimento.
    try {
        const newAuthor = new Author({
            name: data.name,
            surname: data.surname,
            email: data.email,
            //effettuo l'hash della password 10 volte
            password: await bcrypt.hash(data.password, 10),
            birthDate: data.birthDate,
            avatar: data.avatar,
            createdAt: Date.now()
        })
        const createdAuthor = await newAuthor.save()
        res.status(201).send(createdAuthor)
    } catch (error) {
        console.log(error)
        res.status(400).send(error)
    }
}

export const editSpecificAuthor = async (req,res) => {
    const id = req.params.id
    const data = req.body

    try {
        // verifico se l'utente esiste già tramite l'id
        const authorExists = await Author.exists({_id:id})
        // se non esiste
        if(!authorExists){
            return res.status(404).send(`L'id ${id} non esiste nel DB`)
        }
        // verifico anche che non ci sia già un utente che abbia la stessa mail
        // devo escludere però l'utente stesso (grazie all'id) perchè se non mi cambia l'email nella put, 
        // il db mi darebbe errore per mail già presente
        // l'operatore $ne significa not equal.
        const mailAlreadyExists = await Author.exists({email:data.email, _id:{$ne: id}})
        if(mailAlreadyExists){
            return res.status(404).send(`È già presente la mail ${data.email} nel DB`)
        }

        // altrimenti cerco di modificare
        const updatedAuthor = await Author.findByIdAndUpdate(id, data, { new: true })
        await updatedAuthor.save()
        res.status(202).send(updatedAuthor)

    } catch (error) {
        console.log(error)
        res.status(400).send(error)
    }
}

export const deleteSpecificAuthor = async (req,res) => {
    const id = req.params.id
    try {
        const authorExists = await Author.exists({_id:id})
        // se non esiste
        if(!authorExists){
            return res.status(404).send(`L'id ${id} non esiste nel DB`)
        }
        // per farmi restituire l'utente appena eliminato, devo usare le opzioni e chiedere new:true
        const deletedAuthor = await Author.findByIdAndDelete(id, {new: true})
        res.status(202).send(deletedAuthor)
    } catch (error) {
        console.log(error)
        res.status(400).send(error)
    }
}

export const getSpecificAuthorPosts = async (req,res) => {
    const {id} = req.params
    try {
        const authorExists = await Author.exists({_id:id})
        // se non esiste
        if(!authorExists){
            return res.status(404).send(`L'id ${id} non esiste nel DB`)
        }
        // pagination
        const totalPosts = await Post.countDocuments();
        const actualPage = req.query.page || 1;
        const postsPerPage = req.query.perPage || 2;
        const totalPages = Math.ceil(totalPosts / postsPerPage);
        
        // query with pagination
        const authorPostsList = await Post.find({authorId:id})
            .skip((actualPage - 1) * postsPerPage)
            .limit(postsPerPage)

        const data = {
            data: authorPostsList,
            totalPosts,
            postsPerPage,
            actualPage
        }

        res.status(202).send(data)
    } catch (error) {
        console.log(error)
        res.status(400).send(error)
    }
}

export const patchSpecificAuthorAvatar = async (req,res) => {
    const {id} = req.params
    const filePath = req.file.path
    try {
        const authorExists = await Author.exists({_id:id})
        // se non esiste
        if(!authorExists){
            return res.status(404).send(`L'id ${id} non esiste nel DB`)
        }
        // se esiste, lo cerco tramite id, e poi sostituisco la voce avatar con il file path che mi è arrivato da 
        // cloudinary dopo l'inserimento.
        const updatedAuthor = await Author.findByIdAndUpdate(id, {avatar:filePath}, { new: true })
        await updatedAuthor.save()
        
        // richiamo servizio per invio mail, per dare conferma avatar cambiato
        await transport.sendMail({
            from: 'Roby1kenoby@asd.it',
            // mail presa direttamente dalla richiesta
            to: req.body.email,
            subject: "Avatar Changed!",
            text: "Congrats, you changed your avatar!",
            html: "<b>Congrats!</b> You changed your avatar!"
        })
        res.status(202).send(updatedAuthor)
    }
    catch(error){
        console.log(error)
        res.status(400).send(error)
    }
}