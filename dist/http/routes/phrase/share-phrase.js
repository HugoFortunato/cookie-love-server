"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sharePhrase = sharePhrase;
const zod_1 = require("zod");
const prisma_1 = require("../../../lib/prisma");
const auth_1 = require("../../middleware/auth");
const bad_request_error_1 = require("../../../http/routes/_errors/bad-request-error");
async function sharePhrase(app) {
    app
        .withTypeProvider()
        .register(auth_1.auth)
        .post('/share-phrase', {
        schema: {
            tags: ['Phrase'],
            summary: 'Share a phrase with another user',
            body: zod_1.z.object({
                recipientEmail: zod_1.z.string().email(),
                content: zod_1.z.string(),
            }),
        },
    }, async (request, reply) => {
        const { recipientEmail, content } = request.body;
        //@ts-ignore
        const senderId = await request.getCurrentUserId();
        const sender = await prisma_1.prisma.user.findUnique({
            select: { id: true },
            where: { id: senderId },
        });
        if (!sender) {
            throw new bad_request_error_1.BadRequestError('Sender not found.');
        }
        const recipient = await prisma_1.prisma.user.findUnique({
            select: { id: true },
            where: { email: recipientEmail },
        });
        if (!recipient) {
            throw new bad_request_error_1.BadRequestError('Recipient not found.');
        }
        const phrase = await prisma_1.prisma.phrase.create({
            data: {
                content: content,
                sharedPhrase: {
                    create: {
                        senderId: senderId,
                        receiverId: recipient.id,
                    },
                },
            },
        });
        return reply
            .status(201)
            .send({ message: 'Phrase shared successfully.', phrase });
    });
}
