"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendInvite = sendInvite;
const zod_1 = require("zod");
const nodemailer_1 = __importDefault(require("nodemailer"));
const prisma_1 = require("../../../lib/prisma");
const auth_1 = require("../../middleware/auth");
const bad_request_error_1 = require("../../../http/routes/_errors/bad-request-error");
async function sendInvite(app) {
    app
        .withTypeProvider()
        .register(auth_1.auth)
        .post('/send-invite', {
        schema: {
            tags: ['Invite'],
            summary: 'Send an invite to a new user',
            body: zod_1.z.object({
                subject: zod_1.z.string(),
                message: zod_1.z.string(),
                email: zod_1.z.string().email(),
            }),
        },
    }, async (request, reply) => {
        const { message, subject, email } = request.body;
        //@ts-ignore
        const senderId = await request.getCurrentUserId();
        const sender = await prisma_1.prisma.user.findUnique({
            select: { id: true },
            where: { id: senderId },
        });
        if (!sender) {
            throw new bad_request_error_1.BadRequestError('Sender not found.');
        }
        //https://mailtrap.io/sending/domains/4bda756a-0b83-4326-ba1d-d9c69506fa2e?current_tab=smtp_settings&stream=transactional
        const transporter = nodemailer_1.default.createTransport({
            host: 'live.smtp.mailtrap.io',
            port: 587,
            auth: {
                user: 'smtp@mailtrap.io',
                pass: '9f3834b93e1dd8426478aaad5c0a2da9',
            },
        });
        const mailOptions = {
            from: 'info@demomailtrap.com',
            to: email,
            subject: subject,
            text: message,
            html: `<p>${message}</p>`,
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Erro ao enviar o e-mail:', error);
                throw new bad_request_error_1.BadRequestError('Error sending invite.');
            }
            else {
                console.log('E-mail enviado:', info.messageId);
                return reply
                    .status(201)
                    .send({ message: 'Invite sent successfully.' });
            }
        });
        return reply.status(201).send({ message: 'Invite sent successfully.' });
    });
}
