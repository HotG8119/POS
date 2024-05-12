if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const path = require('path')
const http = require('http')
const { Server } = require('socket.io')
const session = require('express-session')
const cors = require('cors')
const passport = require('./config/passport')
const methodOverride = require('method-override')
const flash = require('connect-flash')
const handlebars = require('express-handlebars')
const handlebarsHelpers = require('./helpers/handlebars-helpers')
const { getUser } = require('./helpers/auth-helpers')
const { pages, apis } = require('./routes')

const app = express()
const server = http.createServer(app)

// CORS 配置 for HTTP and Socket.IO
const corsOptions = {
  origin: process.env.FRONTEND_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}
app.use(cors(corsOptions))

// Socket.IO setup with CORS
const io = new Server(server, { cors: corsOptions })
app.io = io

io.on('connection', socket => {
  console.log('A user connected')

  socket.on('completedItem', data => {
    io.emit('completedItem', data)
  })
  socket.on('completedOrder', itemId => {
    io.emit('completedOrder', itemId)
  })
  socket.on('disconnect', () => {
    console.log('User disconnected')
  })
})

// Session configuration
const SESSION_SECRET = process.env.SESSION_SECRET || 'secret'
app.use(session({ secret: SESSION_SECRET, resave: false, saveUninitialized: true }))

// Passport and method override setup
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

// Static files and uploads
app.use(express.static('public'))
app.use('/upload', express.static(path.join(__dirname, 'upload')))

// View engine setup
app.engine('hbs', handlebars({ defaultLayout: 'main', extname: '.hbs', helpers: handlebarsHelpers }))
app.set('view engine', 'hbs')

// Body parser setup
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Flash messages middleware
app.use(flash())
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.user = getUser(req)
  next()
})

// Routes
app.use('/api', apis)
app.use(pages)

// Server start
const port = process.env.PORT || 3000
server.listen(port, () => {
  console.info(`Example app listening on http://localhost:${port}!`)
})

module.exports = app
