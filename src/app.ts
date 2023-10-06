import express, { type Request, type Response } from 'express'
import handlebars from 'express-handlebars'
import path from 'path'

const app = express()
const port = 3000

app.engine('hbs', handlebars({ defaultLayout: 'main', extname: '.hbs' }))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs')

// app.use(pages)

app.get('/', (req: Request, res: Response) => {
  res.render('home')
})

app.listen(port, () => {
  console.log(`server is listening at http://localhost:${port}`)
})
