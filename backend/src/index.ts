import { Hono } from 'hono'
import { PrismaClient } from '../generated/prisma/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { Bindings } from 'hono/types'
import { jwt, sign, verify } from 'hono/jwt';



const app = new Hono<{
	Bindings: {
		DATABASE_URL: string
    JWT_SECRET:string
	}
}>()

app.use('/api/v1/blog/*', async(c,next)=>{
  
  const header:any = c.req.header("Authorization")

  const response = await verify(header,c.env.JWT_SECRET)
  
  if(response.id){
     next()
  }
  else{
    c.status(403)
    return c.json({error:"unauthorized"})
  }

})

app.post('/api/v1/user/signup',async (c) => {

  const prisma = new PrismaClient({

    datasourceUrl:c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const body  = await c.req.json()
    try{
    const user = await prisma.user.create({
      data:{
        email:body.email,
        password: body.password,
      },
    });
    const jwt  = await sign({id:user.id},c.env.JWT_SECRET);
    return c.json({jwt});
    }catch(e){
      c.status(403);
      return c.json({error:"error while signing up"})
    }
})

app.post('/api/v1/user/signin', async (c) => {
    const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL	,
	  }).$extends(withAccelerate());

    const body = await c.req.json()
    const user = await prisma.user.findUnique({
      where:{
        email:body.email
      }
    })

    if(!user){
      c.status(403)
      return c.json({error:"user not found"})
    }

    const jwt = await sign({id:user.id},c.env.JWT_SECRET)
    return c.json({jwt}); 

})

app.post('/api/v1/blog', (c) => {
  return c.text('Blog!')
})

app.put('/api/v1/blog',(c)=>{
  return c.text('signin route')
})

app.get('/api/v1/blog/:id', (c) => {
  const id = c.req.param('id')
  return c.text('get Blog route')
})
export default app
