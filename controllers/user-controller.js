const userServices = require('../services/user-services')

const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: async (req, res, next) => {
    try {
      const { name, email, password, passwordCheck } = req.body
      if (!name || !email || !password || !passwordCheck) throw new Error('所有欄位都是必填！')
      if (password !== passwordCheck) throw new Error('密碼與確認密碼不相符！')

      await userServices.signUp(req, (err, data) => {
        if (err) return next(err)
        req.flash('success_messages', '成功註冊帳號！')
        return res.redirect('/admin/index')
      })
    } catch (err) {
      req.flash('error_messages', err.message)
      console.log(err)
    }
  },
  // signUp: (req, res, next) => {
  //   userServices.signUp(req, (err, data) => {
  //     if (err) return next(err)
  //     req.flash('success_messages', '成功註冊帳號！')
  //     return res.redirect('/admin/index')
  //   })
  // },
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
  },
  deleteUser: (req, res, next) => {
    userServices.deleteUser(req, (err, data) => {
      if (err) return next(err)
      req.flash('success_messages', '成功刪除使用者！')
      return res.redirect('/admin/users')
    })
  }
}
module.exports = userController
