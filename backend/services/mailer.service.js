import nodemailer from 'nodemailer'

// costruisco il transporter, l'oggetto che nodemailer mi da per costruire 
// un collegamento col server smtp per l'invio delle mail
// const transport = nodemailer.createTransport({
//     host: process.env.MAILTRAP_HOST,
//     port: process.env.MAILTRAP_PORT,
//     auth: {
//         user: process.env.MAILTRAP_USER,
//         pass: process.env.MAILTRAP_PASS
//     }
// });

// sembra che non funzioni recuperando le variabili dall'env
const transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: "04ab41d6c61a41",
        pass: "d0db9e6342bc6b"
    }
});

export default transport