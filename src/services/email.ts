import nodemailer, { Transporter } from 'nodemailer';

interface MailAttachment {
    filename: string;
    content: Buffer | string;
    encoding?: string;
}

interface MailProps {
    email: string;
    subject: string;
    html: string;
    text?: string;
    cc?: string;
    attachments?: MailAttachment[];
}

export class EmailService {
    private transporter: Transporter;
    private from: string;

    constructor() {
        const user = process.env.SMTP_USER;
        const pass = process.env.SMTP_PASSWORD;
        const from = process.env.EMAIL_FROM;

        if (!user || !pass || !from) {
            throw new Error('SMTP_USER, SMTP_PASSWORD, or EMAIL_FROM not set in .env');
        }

        this.from = from;
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user,
                pass,
            },
        });
    }

    async send({ email, subject, html, text, cc, attachments }: MailProps) {
        const mailOptions = {
            from: this.from,
            to: email,
            subject,
            html,
            text,
            cc,
            attachments: attachments || [],
        };

        try {
            await this.transporter.sendMail(mailOptions);
        } catch (error) {
            console.error('Error sending mail:', error);
            throw error;
        }
    }
}
