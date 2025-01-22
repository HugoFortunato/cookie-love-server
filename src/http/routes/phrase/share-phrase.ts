import { z } from 'zod';

import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { prisma } from '../../../lib/prisma';
import { auth } from '../../middleware/auth';
import { BadRequestError } from '../../../http/routes/_errors/bad-request-error';

export async function sharePhrase(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/share-phrase',
      {
        schema: {
          tags: ['Phrase'],
          summary: 'Share a phrase with another user',
          body: z.object({
            recipientEmail: z.string().email(),
            content: z.string(),
          }),
        },
      },

      async (request, reply) => {
        const { recipientEmail, content } = request.body;

        //@ts-ignore
        const senderId = await request.getCurrentUserId();

        const sender = await prisma.user.findUnique({
          select: { id: true },
          where: { id: senderId },
        });

        if (!sender) {
          throw new BadRequestError('Sender not found.');
        }

        const recipient = await prisma.user.findUnique({
          select: { id: true },
          where: { email: recipientEmail },
        });

        if (!recipient) {
          throw new BadRequestError('Recipient not found.');
        }

        const phrase = await prisma.phrase.create({
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
      }
    );
}
