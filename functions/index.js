const functions = require('firebase-functions');
const nodemailer = require('nodemailer');

const gmailEmail = 'everguardian06@gmail.com'; // Your Gmail address
const gmailPassword = 'everGuardian9021@53o4u2nvfe'; // Your Gmail password

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: gmailEmail,
    pass: gmailPassword,
  },
});

exports.sendWelcomeEmail = functions.auth.user().onCreate(async (user) => {
  const { email, displayName } = user;

  const mailOptions = {
    from: gmailEmail,
    to: email,
    subject: 'Welcome to everGuardian',
    text: `Hello ${displayName || ''}!\n\nWelcome to everGuardian. We're excited to have you on board.`,
  };

  await transporter.sendMail(mailOptions);
  return null;
});
