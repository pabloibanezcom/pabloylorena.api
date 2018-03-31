const nodemailer = require('nodemailer');
const mg = require('nodemailer-mailgun-transport');

const service = {}

const auth = {
    auth: {
        api_key: process.env.MAILGUN_KEY,
        // domain: process.env.MAILGUN_DOMAIN
    }
}

const transporter = nodemailer.createTransport(mg(auth));

service.sendEmail = (to, subject, htmlBody) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: to,
        subject: subject,
        html: htmlBody
    };

    transporter.sendMail(mailOptions)
    .then(res => console.log('NODEMAILER SUCCESS: ', res))
    .catch(err => console.log('NODEMAILER ERROR: ', err));
}

module.exports = service;