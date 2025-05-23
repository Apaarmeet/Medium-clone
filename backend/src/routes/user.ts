import { Hono } from "hono";
import { withAccelerate } from '@prisma/extension-accelerate'
import { jwt, sign, verify } from 'hono/jwt';
import { PrismaClient } from "../../generated/prisma/edge";
import { signinInput, signupInput } from "@apaarmeet/medium-common";



export const userRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string
        JWT_SECRET: string
    }
}>();

userRouter.post('/signup', async (c) => {

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const body = await c.req.json()
    const {success} = signupInput.safeParse(body)
    if(!success){
        c.status(411);
        return c.json({
            message:"Inputs not correct"
        })
    }
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

userRouter.post('/signin', async (c) => {

    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());

    const body = await c.req.json()
     const {success} = signinInput.safeParse(body)
    if(!success){
        c.status(411);
        return c.json({
            message:"Inputs not correct"
        })
    }
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