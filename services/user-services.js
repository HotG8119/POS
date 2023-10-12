const bcrypt = require('bcryptjs')
const { User } = require('../models')

const userServices = {
  signUp: async (req, cb) => {
    console.log(req.body)
    try {
      if (req.body.password !== req.body.passwordCheck) throw new Error('兩次密碼輸入不同！')

      const user = await User.findOne({ where: { email: req.body.email } })
      if (user) throw new Error('信箱已註冊！')

      const hash = await bcrypt.hash(req.body.password, 10)
      await User.create({
        name: req.body.name,
        email: req.body.email,
        password: hash,
        isAdmin: !!req.body.admin
      })

      //   req.flash('success_messages', '成功註冊帳號！')
      return cb(null)
    } catch (err) {
      return cb(err)
    }
  }
}

module.exports = userServices
