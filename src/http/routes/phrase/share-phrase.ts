import { z } from 'zod';
import nodemailer from 'nodemailer';
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

        const [, domain] = recipientEmail.split('@');

        const recipient = await prisma.user.findUnique({
          select: { id: true },
          where: { email: recipientEmail },
        });

        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: senderId.email,
            pass: 'suasenhaoudotoken',
          },
        });

        if (!recipient) {
          const mailOptions = {
            from: senderId.email,
            to: 'fort88.hug@gmail.com',
            subject: 'Usuário não encontrado',
            text: `O usuário ${!recipient ? 'recipient' : 'sender'} não foi encontrado.`,
            html: `<p>O usuário <strong>${!recipient ? 'recipient' : 'sender'}</strong> não foi encontrado.</p>`,
          };

          try {
            const info = await transporter.sendMail(mailOptions);
            console.log('E-mail enviado:', info.messageId);
          } catch (error) {
            console.error('Erro ao enviar o e-mail:', error);
          }
          throw new BadRequestError(
            'Recipient not found. We sent you an email.'
          );
        }

        const phrase = await prisma.phrase.create({
          data: {
            content: content,
            SharedPhrase: {
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
