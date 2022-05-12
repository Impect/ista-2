const nodemailer = require('nodemailer');


//send email
function sendEmail(email, token) {
 
    var email = email;
    var token = token;
 
    var mail = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: "monhbat930@gmail.com",
            pass: "aamryazfclojswmm"
        }
    });
 
    var mailOptions = {
        from: 'monhbat930@gmail.com',
        to: email,
        subject: 'Нууц үг сэргээх хүсэлт',
        html: '<p><a href="http://localhost:4030/reset-password?token=' + token + '">Энд дарж нууц үгээ сэргээнэ үү.</a></p>'
 
    };
 
    mail.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(1)
        } else {
            console.log(0)
        }
    });
}


module.exports.sendEmail = sendEmail;
