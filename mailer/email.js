const nodemailer = require('nodemailer');



async function sendMail({to, subject, text}) {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        auth: {
            user: process.env.MAIL_USERNAME,
            pass: process.env.MAIL_PASSWORD
        }
    });
    
    try {
        // send mail with defined transport object
        await transporter.sendMail({
            from: process.env.MAIL_FROM,
            to: to ?? "to-example@email.com",
            subject: subject ?? "Subject",
            text: text ?? "Hello SMTP Email"
        }, function (err, info) {
            if (err) {
                console.log("Email send failed!",err);
            } else {
                console.log("Email sent: %s", info.messageId);
            }
        });
    } catch (error) {
        console.log(error);
    }
}

module.exports = sendMail;