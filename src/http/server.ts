import fastifyCors from '@fastify/cors';
import fastify from 'fastify';
import fastifyJwt from '@fastify/jwt';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUI from '@fastify/swagger-ui';

import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod';

import { createAccount } from './routes/auth/create-account';
import { authenticateWithPassword } from './routes/auth/authenticate-with-password';
import { resetPassword } from './routes/auth/reset-password';
import { requestPasswordRecover } from './routes/auth/request-password-recover';
import { getPhrase } from './routes/phrase/get-phrase';
import { sharePhrase } from './routes/phrase/share-phrase';
import { getReceivedPhrases } from './routes/phrase/get-received-phrases';
import { sendInvite } from './routes/phrase/send-invite';

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Next.js SaaS',
      description: 'Full-stack SaaS with multi-tenant & RBAC.',
      version: '1.0.0',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  transform: jsonSchemaTransform,
});

app.register(fastifySwaggerUI, {
  routePrefix: '/docs',
});

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);

app.register(fastifyJwt, {
  secret: process.env.JWT_SECRET || 'my-jwt-secret',
});

app.register(fastifyCors);

app.register(createAccount);
app.register(resetPassword);
app.register(requestPasswordRecover);
app.register(authenticateWithPassword);

app.register(getPhrase);
app.register(sharePhrase);
app.register(getReceivedPhrases);
app.register(sendInvite);

app.listen({ port: Number(process.env.PORT) }).then(() => {
  console.log(`HTTP server running in ${process.env.PORT}`);
});
