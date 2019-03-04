const nodemailer = require('nodemailer');

const sendMail = (dest, title, message) => {
  const transporter = nodemailer.createTransport({
    host: 'mail-student.le-101.fr',
    port: 25,
    secure: false,
  });
  const mailOptions = {
    from: '"Hypertube official 📺" <hypertube@le-101.fr>',
    to: dest,
    subject: `Hypertube - ${title}`,
    text: `You received a new message!\n\n${message}\n\n\nThank you for using Hypertube!`,
  };
  console.log(`Mail sent to ${dest} + ${message}`);
  return transporter.sendMail(mailOptions);
};

module.exports = sendMail;
