const { Resend } = require('resend');
require('dotenv').config()

const resend = process.env.API_KEY_RESEND
    ? new Resend(process.env.API_KEY_RESEND)
    : null

async function sendCode(email, code){
    if(!resend){
        console.log(`Your code is ${code}`)
        return
    }

    resend.emails.send({
        from: 'onboarding@resend.dev',
        to: 'rayanmihani@gmail.com',
        subject: 'Code',
        text: `Your code is ${code}`
    })
}

module.exports = sendCode