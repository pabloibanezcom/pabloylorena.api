const nodemailer = require('nodemailer');

const service = {}

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

service.sendEmail = (to, subject, htmlBody) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: to,
        subject: subject,
        html: htmlBody
    };

    transporter.sendMail(mailOptions);
}

module.exports = service;