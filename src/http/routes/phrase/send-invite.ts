import { z } from 'zod';
import nodemailer from 'nodemailer';

import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { prisma } from '../../../lib/prisma';
import { auth } from '../../middleware/auth';
import { BadRequestError } from '../../../http/routes/_errors/bad-request-error';

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

        //@ts-ignore
        const senderId = await request.getCurrentUserId();

        const sender = await prisma.user.findUnique({
          select: { id: true },
          where: { id: senderId },
        });

        if (!sender) {
          throw new BadRequestError('Sender not found.');
        }

        //https://mailtrap.io/sending/domains/4bda756a-0b83-4326-ba1d-d9c69506fa2e?current_tab=smtp_settings&stream=transactional

        const transporter = nodemailer.createTransport({
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
            throw new BadRequestError('Error sending invite.');
          } else {
            console.log('E-mail enviado:', info.messageId);
            return reply
              .status(201)
              .send({ message: 'Invite sent successfully.' });
          }
        });

        return reply.status(201).send({ message: 'Invite sent successfully.' });
      }
    );
}
