const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // Configure your email service (e.g., Gmail/SendGrid) [cite: 54]
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: 'Real Estate CRM <noreply@crm.com>',
        to: options.email,
        subject: options.subject,
        text: options.message
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;