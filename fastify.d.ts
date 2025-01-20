import 'fastify';

declare module 'fastify' {
  export interface FastifyRequest {
    getCurrentUserId(): Promise<string>;
    jwtVerify<T = unknown>(): Promise<T>;
  }

  export interface FastifyReply {
    jwtSign<T = unknown>(payload: T, options?: any): Promise<string>;
  }
}
