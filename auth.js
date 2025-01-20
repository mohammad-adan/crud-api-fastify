import fp from 'fastify-plugin';
import fastifyJwt from '@fastify/jwt';
import dotenv from 'dotenv';
dotenv.config();

 async function authPlugin(fastify, options) {
    fastify.register(fastifyJwt, {
      secret: process.env.SECRET_KEY
    });
  
    fastify.decorate("authenticate", async function (request, reply) {
      try {
        await request.jwtVerify();
      } catch (err) {
        reply.send(err);
      }
    });
  }
  export default fp(authPlugin);
  //module.exports.d = authPlugin;