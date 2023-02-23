const nodeMailer = require('nodemailer')
require('dotenv').config()

async function sendEmail(userEmail, subject, htmlTemplate) {
  try {
    let transporter = nodeMailer.createTransport({
      service: 'gmail',
      auth:{
        user:process.env.SENDER_EMAIL ,
        pass: process.env.EMAIL_PASS
      }
    })

    let mailOptions ={
      to: userEmail,
      from:process.env.SENDER_EMAIL,
      subject,
      html: htmlTemplate
    }

    await transporter.sendMail(mailOptions)
  } catch (error) {
    console.log(error);
  }
}


module.exports = sendEmail