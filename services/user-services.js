const bcrypt = require('bcryptjs')
const { User } = require('../models')

const userServices = {
  signUp: async (req, cb) => {
    const { name, email, password, passwordCheck, admin } = req.body
    if (!name || !email || !password || !passwordCheck) throw new Error('所有欄位都是必填！')
    try {
      if (password !== passwordCheck) throw new Error('兩次密碼輸入不同！')

      const user = await User.findOne({ where: { email } })
      if (user) throw new Error('信箱已註冊！')

      const hash = await bcrypt.hash(req.body.password, 10)
      await User.create({
        name,
        email,
        password: hash,
        isAdmin: !!admin
      })

      req.flash('success_messages', '成功註冊帳號！')
      return cb(null)
    } catch (err) {
      return cb(err)
    }
  },
  getUsers: async (req, cb) => {
    try {
      // 從user資料表取出所有使用者資料 包含name email isAdmin
      const users = await User.findAll({
        raw: true,
        attributes: ['id', 'name', 'email', 'isAdmin']
      })

      return cb(null, { users })
    } catch (err) {
      return cb(err)
    }
  },
  patchUser: async (req, cb) => {
    try {
      const { id } = req.params
      const user = await User.findByPk(id)
      if (user.name === 'admin') throw new Error('無法修改admin！')
      if (!user) throw new Error('找不到該使用者！')
      await user.update({ isAdmin: !user.isAdmin })

      return cb(null)
    } catch (err) {
      return cb(err)
    }
  }
}

module.exports = userServices
