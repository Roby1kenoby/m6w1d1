import 'dotenv/config'
import multer from 'multer'
import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryStorage} from 'multer-storage-cloudinary'

// uso la libreria di appoggio cloudinary-multer per creare un oggetto che contiene i dati di base per il collegamento
// con il servizio in cloud
const cdStorage = new CloudinaryStorage({
    cloudinary,
    params:{
        folder: 'epicode/m6w2d4/authorsAvatars',
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    }
})

// creo tramite multer l'utility per effettuare lo storage e gli passo il config che specifica dove salvare
const uploadCloudinary = multer({
    storage: cdStorage
})

export default uploadCloudinary