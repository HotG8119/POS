import express from 'express'
import handlebars from 'express-handlebars'
import path from 'path'

import handlebarsHelpers from './helpers/handlebars-helpers'

import router from './routes'

const app = express()
const port = 3000

app.engine('hbs', handlebars({ defaultLayout: 'main', extname: '.hbs', helpers: handlebarsHelpers }))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs')

app.use(router)

app.listen(port, () => {
  console.log(`server is listening at http://localhost:${port}`)
})
