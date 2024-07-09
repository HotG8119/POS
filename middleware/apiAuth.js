const passport = require('../config/passport')

// const authenticated = passport.authenticate('jwt', { session: false })

const authenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err || !user) {
      console.error(err)
      // return res.status(401).json({ status: 'error', message: 'Unauthorized' })
      return res.status(200).json({
        success: true,
        message: '權限不足！'
      })
    }
    req.user = user
    return next()
  })(req, res, next)
}

const authenticatedAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    return next()
  }
  return res.status(200).json({
    success: false,
    message: '權限不足！'
  })
}

module.exports = {
  authenticated,
  authenticatedAdmin
}
