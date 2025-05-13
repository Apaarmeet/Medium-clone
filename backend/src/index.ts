import { Hono } from 'hono'
import { PrismaClient } from '../generated/prisma/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { Bindings } from 'hono/types'
import { jwt, sign, verify } from 'hono/jwt';



const app = new Hono<{
  Bindings: {
    DATABASE_URL: string
    JWT_SECRET: string
  }
}>()

app.use('/api/v1/blog/*', async (c, next) => {

  const header: any = c.req.header("Authorization")

  const response = await verify(header, c.env.JWT_SECRET)

  if (response.id) {
    next()
  }
  else {
    c.status(403)
    return c.json({ error: "unauthorized" })
  }

})

app.post('/api/v1/user/signup', async (c) => {


  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())

  const body = await c.req.json()
  try {

    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: body.password,
        name: body.name,
      },
    });

    const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
    return c.json({ jwt });


  } catch (e) {
    console.log(e);
    c.status(403);
    return c.json({ error: "email alredy exists" })

  }
})

app.post('/api/v1/user/signin', async (c) => {

  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json()

  try {
    const user = await prisma.user.findFirst({
      where: {
        email: body.email,
        password: body.password
      }
    })

    if (!user) {
      c.status(403)
      return c.json({ error: "user not found" })
    }

    const jwt = await sign({ id: user.id }, c.env.JWT_SECRET)
    return c.json({ jwt });


    } catch (e) {

    console.log(e);
    c.status(411);
    return c.text("Invalid Credentials")

  }
  
})

app.post('/api/v1/blog', (c) => {
  return c.text('Blog!')
})

app.put('/api/v1/blog', (c) => {
  return c.text('signin route')
})

app.get('/api/v1/blog/:id', (c) => {
  const id = c.req.param('id')
  return c.text('get Blog route')
})
export default app
