const responseSchema = {
    type: "object",
    properties: {
        response: {
            type: "object",
            properties: {
                200: {
                    type: "object",
                    properties: {
                        products: { type: 'array' }
                    }
                }
            }
        }
    }
};

const postSchema = {
    type: "object",
    properties: {
        body: {
            type: "object",
            properties: {
                id: { type: 'number' },
                name: { type: 'string' }
            },
            required: ['id', 'name']
        },
        response: {
            type: "object",
            properties: {
                200: {
                    type: "object",
                    properties: {
                        status: { type: 'number' }
                    }
                }
            }
        }
    }
};

const putSchema = {
    type: "object",
    properties: {
        body: {
            type: "object",
            properties: {
                product: { type: 'object' }
            },
            required: ['product']
        },
        response: {
            type: "object",
            properties: {
                200: {
                    type: "object",
                    properties: {
                        status: { type: 'number' }
                    }
                }
            }
        }
    }
};

const deleteSchema = {
    type: "object",
    properties: {
        response: {
            type: "object",
            properties: {
                200: {
                    type: "object",
                    properties: {
                        status: { type: 'number' }
                    }
                }
            }
        }
    }
};

const productController = (fastify, options, done) => {

    fastify.get('/',{ schema: responseSchema } ,async(req,reply)=>{
       try{
        const [products] = await fastify.mysql.query('SELECT * FROM products');
        return {products};
       } catch (error) {
        return error;
       }
    
    });

    fastify.post('/' ,{ schema: postSchema, preValidation: fastify.authenticate },async (req,reply) => {
        
        const   {id ,name }  = req.body;
        
        try{
        await fastify.mysql.query(`
            INSERT INTO products (id , name) 
            VALUES (?, ?)
            `,[id, name]);
        return { status: 200};
        }catch (error){
            return error;
        }
    });

    fastify.put('/:id',{ schema: putSchema, preValidation: fastify.authenticate }, async (req,reply)=>{
         const productId = req.params.id;
        const product = req.body.name;
        try{
        await fastify.mysql.query(`UPDATE products SET name =? WHERE id=?`,[product, productId]);
        return {status : 200};
        } catch(error){
            return error;
        }
    });

    fastify.delete('/:id', { schema: deleteSchema, preValidation: fastify.authenticate },async(req,reply)=>{
        try{
          await fastify.mysql.query(`DELETE FROM products WHERE id=?`,[req.params.id]);
            return {status : 200};
            }catch(error){
            return error;
        }
        });



    done();
};

export default productController;














// const responseSchema = {
    // response: {
        // 200: {
            // products: { type: 'array' }
        // }
    // }
// };
// 
// const postSchema = {
    // body: {
        // properties: {
            // id: { type: 'number'},
            // name: {type: 'string'}
// 
        // },
    //    required: ['id','name']
    // },
    // response: {
        // 200: {
            // status: {type: 'number'}
        // }
    // }
// };
// const putSchema = {
    // body: {
        // properties: {
            // product: { type: 'object'}
// 
        // },
        // required: ['product']
    // },
    // response: {
        // 200: {
            // status: {type: 'number'}
        // }
// }
// };
// 
// const deleteSchema = {
    // response: {
        // 200: {
            // status: { type: 'number' }
        // }
    // }
// }
