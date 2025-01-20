import { z } from 'zod';

import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';

import { prisma } from '../../../lib/prisma';
import { auth } from '../../middleware/auth';
import { BadRequestError } from '../../../http/routes/_errors/bad-request-error';

export async function getPhrase(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/phrase',
      {
        schema: {
          tags: ['Phrase'],
          summary: 'Get your phrase',
          response: {
            200: z.object({
              content: z.string(),
            }),
          },
        },
      },

      async (request, reply) => {
        //@ts-ignore
        const userId = await request.getCurrentUserId();

        const user = await prisma.user.findUnique({
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
          throw new BadRequestError('User not found.');
        }

        const phrase = await prisma.phrase.findFirst({
          orderBy: {
            id: 'asc',
          },
          skip: Math.floor(Math.random() * (await prisma.phrase.count())),
        });

        if (!phrase) {
          throw new BadRequestError('No phrases available.');
        }

        return reply.status(201).send({ content: phrase.content });
      }
    );
}
