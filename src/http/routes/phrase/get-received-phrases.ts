import { z } from 'zod';

import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';

import { prisma } from '../../../lib/prisma';
import { auth } from '../../middleware/auth';
import { BadRequestError } from '../../../http/routes/_errors/bad-request-error';

export async function getReceivedPhrases(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/get-received-phrases',
      {
        schema: {
          tags: ['Phrase'],
          summary: 'Get your received phrases',
          response: {
            200: z.object({
              phrases: z.array(
                z.object({
                  id: z.string(),
                  phrase: z.string(),
                })
              ),
            }),
          },
        },
      },
      async (request, reply) => {
        //@ts-ignore
        const userId = await request.getCurrentUserId();

        const userPhrases = await prisma.user.findUnique({
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
          throw new BadRequestError('User phrases not found.');
        }

        const correctedPhrases = userPhrases.receivedPhrases.map((item) => {
          const phraseId = item.phrase?.id || '';
          const correctedPhrase = item.phrase?.content;

          return { phrase: correctedPhrase, id: phraseId };
        });

        return reply.status(200).send({ phrases: correctedPhrases });
      }
    );
}
