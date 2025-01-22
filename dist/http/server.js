"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("@fastify/cors"));
const fastify_1 = __importDefault(require("fastify"));
const jwt_1 = __importDefault(require("@fastify/jwt"));
const swagger_1 = __importDefault(require("@fastify/swagger"));
const swagger_ui_1 = __importDefault(require("@fastify/swagger-ui"));
const fastify_type_provider_zod_1 = require("fastify-type-provider-zod");
const create_account_1 = require("./routes/auth/create-account");
const authenticate_with_password_1 = require("./routes/auth/authenticate-with-password");
const reset_password_1 = require("./routes/auth/reset-password");
const request_password_recover_1 = require("./routes/auth/request-password-recover");
const get_phrase_1 = require("./routes/phrase/get-phrase");
const share_phrase_1 = require("./routes/phrase/share-phrase");
const get_received_phrases_1 = require("./routes/phrase/get-received-phrases");
const send_invite_1 = require("./routes/phrase/send-invite");
const app = (0, fastify_1.default)().withTypeProvider();
app.register(swagger_1.default, {
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
    transform: fastify_type_provider_zod_1.jsonSchemaTransform,
});
app.register(swagger_ui_1.default, {
    routePrefix: '/docs',
});
app.setSerializerCompiler(fastify_type_provider_zod_1.serializerCompiler);
app.setValidatorCompiler(fastify_type_provider_zod_1.validatorCompiler);
app.register(jwt_1.default, {
    secret: process.env.JWT_SECRET || 'my-jwt-secret',
});
app.register(cors_1.default);
app.register(create_account_1.createAccount);
app.register(reset_password_1.resetPassword);
app.register(request_password_recover_1.requestPasswordRecover);
app.register(authenticate_with_password_1.authenticateWithPassword);
app.register(get_phrase_1.getPhrase);
app.register(share_phrase_1.sharePhrase);
app.register(get_received_phrases_1.getReceivedPhrases);
app.register(send_invite_1.sendInvite);
app.listen({ port: Number(process.env.PORT) }).then(() => {
    console.log(`HTTP server running in ${process.env.PORT}`);
});
