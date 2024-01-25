import { SentMessageInfo } from "nodemailer";

const nodemailer = require("nodemailer");

const sendEmail = async (options: {
  email: string;
  subject: string;
  message: string;
}) => {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: "Nabin Khnal <boiinventer@gmail.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  transporter.sendMail(
    mailOptions,
    function (error: Error, info: SentMessageInfo) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    }
  );
};

export default sendEmail;
