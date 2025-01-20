import dotenv from 'dotenv';
import Fastify from 'fastify';
import fastifyMysql from '@fastify/mysql';
import productController from './product-controller.js';
import authPlugin from './auth.js'



dotenv.config();

const fastify = Fastify({
    logger: true
});

// Database Access
fastify.register(fastifyMysql, {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    promise: process.env.DB_PROMISE
    
});

fastify.register(authPlugin);
//register
fastify.post('/register', async(request, reply)=>{
    const {id,firstName,lastName,username, password} = request.body;
    try{
        await fastify.mysql.query(`
            INSERT INTO users (id,firstName,lastName,username, password)
            VALUES (?, ?,?,?,?)
            `,[id,firstName,lastName,username, password]);
        return { status: 200};

    }catch(error){
        return error;
    }
})


fastify.post('/login', async (request, reply) => {
  const { username, password } = request.body;

  // Query to find the user by username
  const [user] = await fastify.mysql.query('SELECT * FROM users WHERE username = ?', [username]);

  // Check if user exists and password matches
  if (user && password == user[0].password) {
    
    const token = fastify.jwt.sign({ username });
    return { token };
  }

  // Send error if login fails
  reply.code(401).send({ message: 'Invalid username or password' });
});


  fastify.register(productController, { prefix: '/products' });
  

try{
fastify.listen({port: 3002});
}catch(error){
    fastify.log.error(error);
    process.exit(1);
}
