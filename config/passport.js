const passport = require('passport')
const LocalStrategy = require('passport-local')
const passportJWT = require('passport-jwt')
const JwtStrategy = passportJWT.Strategy
const ExtractJwt = passportJWT.ExtractJwt

const bcrypt = require('bcryptjs')
const { User } = require('../models')

// set up Passport strategy
passport.use(new LocalStrategy(
  // customize user field
  {
    // usernameField: 'email',
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
  },
  // authenticate user
  (req, username, password, cb) => {
    console.log('username: ', username)
    console.log('password: ', password)
    User.findOne({ where: { email: username } })
      .then(user => {
        if (!user) return cb(null, false, { code: 500, message: '帳號或密碼輸入錯誤！' })
        // if (!user) return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！'))
        bcrypt.compare(password, user.password).then(res => {
          if (!res) return cb(null, false, { code: 500, message: '帳號或密碼輸入錯誤！' })
          // if (!res) return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！'))
          return cb(null, user)
        })
      })
  }
))

// set up Passport JWT opts & strategy
const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET_ACCESS_TOKEN
}

passport.use(new JwtStrategy(opts, (jwtPayload, cb) => {
  User.findByPk(jwtPayload.id)
    .then(user => cb(null, user))
    .catch(err => cb(err, false))
}))

// serialize and deserialize user
passport.serializeUser((user, cb) => {
  cb(null, user.id)
})
passport.deserializeUser((id, cb) => {
  User
    .findByPk(id)
    .then(user => {
      user = user.toJSON()
      return cb(null, user)
    })
})
module.exports = passport
