"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPhrase = getPhrase;
const zod_1 = require("zod");
const prisma_1 = require("../../../lib/prisma");
const auth_1 = require("../../middleware/auth");
const bad_request_error_1 = require("../../../http/routes/_errors/bad-request-error");
async function getPhrase(app) {
    app
        .withTypeProvider()
        .register(auth_1.auth)
        .get('/phrase', {
        schema: {
            tags: ['Phrase'],
            summary: 'Get your phrase',
            response: {
                200: zod_1.z.object({
                    content: zod_1.z.string(),
                }),
            },
        },
    }, async (request, reply) => {
        //@ts-ignore
        const userId = await request.getCurrentUserId();
        const user = await prisma_1.prisma.user.findUnique({
            select: {
                id: true,
                name: true,
                email: true,
            },
            where: {
                id: userId,
            },
        });
        if (!user) {
            throw new bad_request_error_1.BadRequestError('User not found.');
        }
        const phrase = await prisma_1.prisma.phrase.findFirst({
            orderBy: {
                id: 'asc',
            },
            skip: Math.floor(Math.random() * (await prisma_1.prisma.phrase.count())),
        });
        if (!phrase) {
            throw new bad_request_error_1.BadRequestError('No phrases available.');
        }
        return reply.status(201).send({ content: phrase.content });
    });
}
