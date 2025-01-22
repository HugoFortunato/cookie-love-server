"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const fastify_plugin_1 = require("fastify-plugin");
const unauthorized_error_1 = require("../routes/_errors/unauthorized-error");
exports.auth = (0, fastify_plugin_1.fastifyPlugin)(async (app) => {
    app.addHook('preHandler', async (request) => {
        //@ts-ignore
        request.getCurrentUserId = async () => {
            try {
                //@ts-ignore
                const { sub } = await request.jwtVerify();
                return sub;
            }
            catch {
                throw new unauthorized_error_1.UnauthorizedError('Invalid token');
            }
        };
    });
});
