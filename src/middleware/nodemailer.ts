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

export const sendWelcomeEmail = async (email: string, password: string) => {
    const mailOptions = {
        from: 'contact@pe-e.fr',
        to: email,
        subject: 'Welcome to Our Platform!',
        text: `Welcome to PE-E!
        We're thrilled to have you on board. Your account has been successfully created, and you're now part of a community that values exceptional experiences.
        
        Account Information:
        
            Email: ${email}
            Password: ${password}
        
        Get started by exploring what we have to offer:https://www.pe-e.fr/ 
        
        If you have any questions or need assistance, our support team is here for you. Don't hesitate to contact us at contact@pe-e.fr .
        
        Thank you for joining us, and we look forward to providing you with an amazing experience.
        
        Best Regards,
        The PE-E Team`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Welcome email sent successfully');
    } catch (error) {
        console.error('Error sending welcome email:', error);
        throw new Error('Failed to send welcome email');
    }
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