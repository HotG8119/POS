const userServices = require('../services/user-services')

const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res) => {
    userServices.signUp(req, (error, data) => {
      if (error) {
        // req.flash('error_messages', error.message)
        return res.redirect('/signup')
      }
      //   req.flash('success_messages', data)
      return res.redirect('/signin')
    })
  }
}
module.exports = userController
