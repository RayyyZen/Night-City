const { Resend } = require('resend');
require('dotenv').config()

const resend = new Resend(process.env.API_KEY_RESEND);

async function sendCode(email, code){
    resend.emails.send({
        from: 'onboarding@resend.dev',
        to: 'rayanmihani@gmail.com',
        subject: 'Code',
        text: `Your code is ${code}`
    })
}

module.exports = sendCode