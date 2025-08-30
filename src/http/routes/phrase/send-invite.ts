// @ts-nocheck
import { z } from 'zod';
import { Resend } from 'resend';
import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';

import { prisma } from '../../../lib/prisma';
import { auth } from '../../middleware/auth';
import { BadRequestError } from '../../../http/routes/_errors/bad-request-error';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendInvite(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/send-invite',
      {
        schema: {
          tags: ['Invite'],
          summary: 'Send an invite to a new user',
          body: z.object({
            subject: z.string(),
            message: z.string(),
            email: z.string().email(),
          }),
        },
      },

      async (request, reply) => {
        const { message, subject, email } = request.body;

        const senderId = await request.getCurrentUserId();

        const sender = await prisma.user.findUnique({
          select: { id: true },
          where: { id: senderId },
        });

        if (!sender) {
          throw new BadRequestError('Sender not found.');
        }

        (async function () {
          const { data, error } = await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: [email],
            subject: subject,
            html: `<strong>${message}</strong>`,
          });

          if (error) {
            return console.error({ error });
          }
        })();

        return reply.status(201).send({ message: 'Invite sent successfully.' });
      }
    );
}
