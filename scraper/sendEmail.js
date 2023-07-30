const dotenv = require('dotenv');
dotenv.config();
const nodemailer = require("nodemailer");

async function sendEmail(from, to, subject, html, replyTo, bcc ) {
    let host, port, user, pass;

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });

    const result = await transporter.sendMail({ from, to, subject, html, replyTo, bcc });
    return result;
}

module.exports = sendEmail;