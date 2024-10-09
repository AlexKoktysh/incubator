import nodemailer from "nodemailer";
import { secretsConfig } from "../config";
import { NodemailerDto } from "../utils";

export const nodemailerService = {
    async sendEmail({ email, subject, message }: NodemailerDto) {
        try {
            const transport = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false,
                auth: {
                    user: secretsConfig.GMAIL_USER,
                    pass: secretsConfig.GMAIL_PASSWORD,
                },
            });
            await transport.sendMail({
                from: `Alex <${secretsConfig.GMAIL_USER}>`,
                to: email,
                subject,
                html: message,
            });
        } catch (error) {
            console.error("Error sending email:", error);
        }
    },
};
