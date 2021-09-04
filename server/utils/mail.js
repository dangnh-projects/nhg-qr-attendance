const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
dotenv.config();

let transporter = nodemailer.createTransport({
  host: "smtp.office365.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  },
  tls: {
    ciphers: "SSLv3"
  },
  debug: process.env.NODE_ENV === "development"
});

class MailUtil {
  async sendEmail(email, subject, content, attachments = []) {
    let info = await transporter.sendMail({
      to: email, // list of receivers
      subject, // Subject line
      html: content, // html body
      attachments
    });

    // console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  }
}

module.exports = new MailUtil();
