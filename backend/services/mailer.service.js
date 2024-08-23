import nodemailer from 'nodemailer'
import 'dotenv/config'

// costruisco il transporter, l'oggetto che nodemailer mi da per costruire 
// un collegamento col server smtp per l'invio delle mail
const transport = nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST,
    port: process.env.MAILTRAP_PORT,
    auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS
    }
});


export default transport