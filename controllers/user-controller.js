const userServices = require('../services/user-services')

const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res, next) => {
    userServices.signUp(req, (err, data) => {
      if (err) return next(err)
      return res.redirect('/admins/index')
    })
  },
  logInPage: (req, res) => {
    res.render('login')
  },
  logIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/')
  },
  logout: (req, res) => {
    req.flash('success_messages', '成功登出！')
    req.logout()
    res.redirect('/login')
  },
  getUsers: (req, res, next) => {
    userServices.getUsers(req, (err, data) => {
      if (err) return next(err)
      return res.render('admin/users', data)
    })
  },
  patchUser: (req, res, next) => {
    userServices.patchUser(req, (err, data) => {
      if (err) return next(err)
      req.flash('success_messages', '成功更新權限！')
      return res.redirect('/admin/users')
    })
  }
}
module.exports = userController
