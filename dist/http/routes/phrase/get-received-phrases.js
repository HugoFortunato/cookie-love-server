"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReceivedPhrases = getReceivedPhrases;
const zod_1 = require("zod");
const prisma_1 = require("../../../lib/prisma");
const auth_1 = require("../../middleware/auth");
const bad_request_error_1 = require("../../../http/routes/_errors/bad-request-error");
async function getReceivedPhrases(app) {
    app
        .withTypeProvider()
        .register(auth_1.auth)
        .get('/get-received-phrases', {
        schema: {
            tags: ['Phrase'],
            summary: 'Get your received phrases',
            response: {
                200: zod_1.z.object({
                    phrases: zod_1.z.array(zod_1.z.object({
                        id: zod_1.z.string(),
                        phrase: zod_1.z.string(),
                    })),
                }),
            },
        },
    }, async (request, reply) => {
        //@ts-ignore
        const userId = await request.getCurrentUserId();
        const userPhrases = await prisma_1.prisma.user.findUnique({
            select: {
                id: true,
                receivedPhrases: {
                    select: {
                        phrase: {
                            select: {
                                content: true,
                                id: true,
                            },
                        },
                    },
                },
            },
            where: {
                id: userId,
            },
        });
        if (!userPhrases) {
            throw new bad_request_error_1.BadRequestError('User phrases not found.');
        }
        const correctedPhrases = userPhrases.receivedPhrases.map((item) => {
            const phraseId = item.phrase?.id || '';
            const correctedPhrase = item.phrase?.content;
            return { phrase: correctedPhrase, id: phraseId };
        });
        return reply.status(200).send({ phrases: correctedPhrases });
    });
}
