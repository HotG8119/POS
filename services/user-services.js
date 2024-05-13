const bcrypt = require('bcryptjs')
const { User } = require('../models')

const userServices = {
  signUp: async (req, cb) => {
    const { name, email, password, admin } = req.body
    try {
      const user = await User.findOne({ where: { email } })
      if (user) throw new Error('信箱已註冊！')

      const hash = await bcrypt.hash(password, 10)
      await User.create({
        name,
        email,
        password: hash,
        isAdmin: !!admin
      })
      return cb(null)
    } catch (err) {
      return cb(err)
    }
  },
  getUsers: async (req, cb) => {
    const { pageSize, currentPage } = req.body
    try {
      // 從user資料表取出所有使用者資料 包含name email isAdmin
      const users = await User.findAndCountAll({
        raw: true,
        attributes: ['id', 'name', 'email', 'isAdmin'],
        limit: pageSize,
        offset: (currentPage - 1) * pageSize
      })

      return cb(null, users)
    } catch (err) {
      return cb(err)
    }
  },
  patchUserRole: async (req, cb) => {
    try {
      const { id } = req.params
      const user = await User.findByPk(id)
      if (!user) throw new Error('找不到該使用者！')
      if (user.name === 'admin') throw new Error('無法修改admin！')
      await user.update({ isAdmin: !user.isAdmin })

      return cb(null)
    } catch (err) {
      return cb(err)
    }
  },
  patchUserInfo: async (req, cb) => {
    try {
      const { id } = req.params
      const { name, email } = req.body
      if (!name || !email) throw new Error('所有欄位都是必填！')
      const user = await User.findByPk(id)

      if (!user) throw new Error('找不到該使用者！')
      if (user.name === 'admin') throw new Error('無法修改admin！')

      await user.update({ name, email })

      return cb(null)
    } catch (err) {
      return cb(err)
    }
  },
  patchUserPassword: async (req, cb) => {
    try {
      const { id } = req.params
      const { password } = req.body
      if (!password) throw new Error('密碼是必填！')
      const user = await User.findByPk(id)
      if (!user) throw new Error('找不到該使用者！')
      if (user.name === 'admin') throw new Error('無法修改admin！')

      const hash = await bcrypt.hash(password, 10)
      await user.update({ password: hash })

      return cb(null)
    } catch (err) {
      return cb(err)
    }
  },
  deleteUser: async (req, cb) => {
    try {
      const { id } = req.params
      const user = await User.findByPk(id)
      if (!user) throw new Error('找不到該使用者！')
      if (user.name === 'admin') throw new Error('無法刪除admin！')

      await user.destroy()

      return cb(null)
    } catch (err) {
      return cb(err)
    }
  }
}

module.exports = userServices
