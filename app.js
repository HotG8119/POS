// if (process.env.NODE_ENV !== 'production') {
//   require('dotenv').config()
// }

// const path = require('path')
const express = require('express')
const handlebars = require('express-handlebars')
// const flash = require('connect-flash')
// const session = require('express-session')
// const passport = require('./config/passport')
// const methodOverride = require('method-override')

const handlebarsHelpers = require('./helpers/handlebars-helpers')
// const { getUser } = require('./helpers/auth-helpers')

// const { pages } = require('./routes')

const app = express()
const port = process.env.PORT || 3001
// const SESSION_SECRET = process.env.SESSION_SECRET

app.engine('hbs', handlebars({ defaultLayout: 'main', extname: '.hbs', helpers: handlebarsHelpers }))
app.set('view engine', 'hbs')
app.use(express.urlencoded({ extended: true }))

// app.use(session({ secret: SESSION_SECRET, resave: false, saveUninitialized: false }))
// app.use(passport.initialize())
// app.use(passport.session())
// app.use(flash())
// app.use(methodOverride('_method'))
// app.use('/upload', express.static(path.join(__dirname, 'upload')))
// app.use((req, res, next) => {
//   res.locals.success_messages = req.flash('success_messages')
//   res.locals.error_messages = req.flash('error_messages')
//   res.locals.user = getUser(req)
//   next()
// })

const orderController = require('./controllers/order-controller')
// app.use(pages)
app.get('/', orderController.getProduct)

app.listen(port, () => {
  console.info(`Example app listening on http://localhost:${port} !`)
})

module.exports = app
