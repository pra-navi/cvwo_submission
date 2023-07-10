import nodemailer from 'nodemailer';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create a transporter using your email service credentials
const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'jesus.will@ethereal.email',
        pass: 'TnJtNFBjmvZTh8zWbh',
    },
    secure: true,
    tls: {
        rejectUnauthorized: false,
        ca: [
            readFileSync(join(__dirname, '../certificates/localhost.crt'))
        ],
    },
});

// Function to send the verification email
const sendVerificationEmail = (email, verificationLink) => {
  const mailOptions = {
    from: 'pranavikiran@gmail.com',
    to: email,
    subject: 'Email Verification',
    html: `<p>Please verify your email address by clicking the link below:</p><a href="${verificationLink}">Verify Email</a>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
};

export default sendVerificationEmail;