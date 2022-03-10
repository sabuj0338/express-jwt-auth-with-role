const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD
    }
});

message = {
    from: process.env.MAIL_FROM,
    to: "to-example@email.com",
    subject: "Subject",
    text: "Hello SMTP Email"
}


function sendMail({to, subject, text}) {
    
    message = {...message, to, subject, text};
    
    try {
        transporter.sendMail(message, function (err, info) {
            if (err) {
                console.log(err)
            } else {
                console.log(info);
            }
        });
    } catch (error) {
        console.log(error);
    }
}

module.exports = sendMail;