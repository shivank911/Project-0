const NodeMailer = require("nodemailer");

const sendEmail = async (options) =>{
    const trasnporter = NodeMailer.createTransport({
        host:"smtp.gmail.com",
        port:465,
        service:process.env.SMTP_SERVICE,
        auth:{
            user:process.env.SMTP_MAIL,
            pass:process.env.SMTP_PASSWORD,
        }
    });
    const mailOptions = {
        from:process.env.SMTP_MAIL,
        to:options.email,
        message:options.subject,
        text:options.message,
    };

    await trasnporter.sendMail(mailOptions);
};

module.exports=sendEmail;