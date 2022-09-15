import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "outlook",
  auth: {
    user: process.env.TRANSPORTER_MAIL,
    pass: process.env.TRANSPORTER_MAIL_PASSWORD,
  },
});

const sendMail = (
  mailAddress = "targte-mail@mail.com",
  subject = "LightHouse Report",
  filePath
) => {
  const mailOptions = {
    from: process.env.TRANSPORTER_MAIL,
    to: mailAddress,
    subject,
    attachments: [
      {
        path: filePath,
      },
    ],
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

export default sendMail;
