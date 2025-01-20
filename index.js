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
















// fastify.post('/login', async (request, reply) => {
    // const { username, password } = request.body;
//   
    // await fastify.mysql.query('SELECT * FROM users WHERE username=? & password=?');
// 
    // Validate username and password 
    // if (username === 'user' && password === 'password') {
    //   const token = fastify.jwt.sign({ username });
    //   return { token };
    // }
//   
    // reply.code(401).send({ message: 'Invalid username or password' });
//   });
  
  // Controllers
  fastify.register(productController, { prefix: '/products' });
  




// Controllers
//fastify.register(productController, {prefix: '/products'});





try{
fastify.listen({port: 3002});
}catch(error){
    fastify.log.error(error);
    process.exit(1);
}








//import greetingsController from './greetings-controller.js';

// fastify.register(greetingsController, {prefix: '/greetings'});


// import Fastify from 'fastify';
// import greetingsController from './greetings-controller.js';
 

// const fastify = Fastify({
//     logger: true
// });


// //our entire controller is prefixed under greetings
// fastify.register(greetingsController, {prefix: '/greetings'});



// try{
//     fastify.listen({ port: 3002});
// } catch (error) {
//     fastify.log.error(error);
//     process.exit(1);
// }















// fastify.route({
    // method: 'GET',
    // url: '/hello/:name',
    // schema: {
        // querystring: {
            // properties: {
                // lastname: {type: 'string'}
            // },
            // required: ['lastname']
        // },
// 
        // params: {
            // properties: {
                // name: { type: 'string' }
            // },
            // required: ['name']
        // },
        // response: {
            // 200: {
                // properties: {
                    // message: { type: 'string'}
                // },
                // required: ['message']
            // }
        // }
    // },
    // handler: (req,reply)=>{
        // return {
            // message: `Hello ${req.params.name} ${req.query.lastname}`
        // };
    // }
// });