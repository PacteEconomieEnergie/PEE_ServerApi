import { Request, Response, NextFunction } from 'express';
import nodemailer from 'nodemailer';


const smtpConfig = {
    host: 'smtp.pe-e.fr', // Replace with your SMTP host
    port: 587, // Common port for TLS/STARTTLS
    secure: false, // True for 465 (SSL), false for other ports like 587 (TLS/STARTTLS)
    auth: {
        user: 'contact@pe-e.fr', // Your email address
        pass: 'Toor270687', // Your email password or app-specific password
    },
    tls: {
        rejectUnauthorized: false // Bypasses the certificate validation
    }
};


const transporter = nodemailer.createTransport(smtpConfig);

interface CustomRequest extends Request {
    resetCode?: string; // Optional property for reset code
}


export const sendPasswordResetEmailMiddleware = async (email: string, code: string) => {
    // const { email } = req.body;
    // const { resetCode } = req; // Assume resetCode is set earlier in the middleware chain

    // if (!email || !resetCode) {
    //     return res.status(400).send('Email and reset code are required.');
    // }

    const mailOptions = {
        from: 'contact@pe-e.fr',
        to: email,
        subject: 'Your Password Reset Code',
        text: `Your password reset code is: ${code}. Please use this code to reset your password on our site.`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send password reset email');
    }
};