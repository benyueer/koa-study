import * as Koa from 'koa'

const app = new Koa()

app.use(async (ctx) => {
  ctx.body = 'hello koa'
})

console.log(123)

app.listen(3000)
