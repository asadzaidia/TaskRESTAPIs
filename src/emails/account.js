const sgMail = require('@sendgrid/mail');

const sendGridApiKey = process.env.EMAIL_CLIENT_KEY;

sgMail.setApiKey(sendGridApiKey);
function welcomeEmail(email,name) {
    sgMail.send({
        to : email,
        from : 'asadzaidi625@gmail.com',
        subject : 'Welcome to Task App!',
        text : `Hi! Thanks for signup ${name}`
    });
}

module.exports = welcomeEmail;