const nodeMailer = require('nodemailer')

async function sendEmail(userEmail, subject, htmlTemplate) {
  try {
    let transporter = nodeMailer.createTransport({
      service: 'gmail',
      auth:{
        user:'testacount4053@gmail.com' ,
        pass: 'mqplvwonttspbhrw'
      }
    })

    let mailOptions ={
      to: userEmail,
      from:'testacount4053@gmail.com',
      subject,
      html: htmlTemplate
    }

    await transporter.sendMail(mailOptions)
  } catch (error) {
    console.log(error);
  }
}


module.exports = sendEmail