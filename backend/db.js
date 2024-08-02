import mongoose from "mongoose"
import 'dotenv/config'



const mongoDbConnection = async () => {
    // meglio qui la connectionString perchè così non diventa globale
    const connectionString = process.env.MONGODB_CONNECTION_STRING
    try {
        await mongoose.connect(connectionString)
        console.log('connessione al db ok')
    } catch (error) {
        console.log(error)
    }
}

export default mongoDbConnection