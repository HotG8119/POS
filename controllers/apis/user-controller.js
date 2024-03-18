const jwt = require('jsonwebtoken')

const userServices = require('../../services/user-services')

const userController = {
  login: (req, res, next) => {
    try {
      const userData = req.user.toJSON()
      delete userData.password
      const accessToken = jwt.sign(userData, process.env.JWT_SECRET_ACCESS_TOKEN, { expiresIn: '7d' }) // 簽發 JWT，效期為 30 天
      const refreshToken = jwt.sign(userData, process.env.JWT_SECRET_REFRESH_TOKEN, { expiresIn: '30d' }) // 簽發 JWT，效期為 30 天
      // tokenExpires為token過期時間 XXXX/XX/XX XX:XX:XX
      const tokenExpires = new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000).toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' })
      res.status(200).json({
        success: true,
        data: {
          userId: userData.id,
          username: userData.name,
          roles: userData.isAdmin ? ['admin', 'common'] : ['common'],
          accessToken,
          refreshToken,
          tokenExpires
        }
      })
    } catch (err) {
      next(err)
    }
  },
  signUp: async (req, res, next) => {
    try {
      console.log('正在註冊帳號')
      const { name, email, password } = req.body
      if (!name || !email || !password) throw new Error('所有欄位都是必填！')
      // if (password !== passwordCheck) throw new Error('密碼與確認密碼不相符！')

      await userServices.signUp(req, (err, data) => {
        if (err) return res.status(200).json({ success: false, message: err.message })
        res.status(200).json({ success: true, message: '成功註冊帳號！' })
      })
    } catch (err) {
      console.log('err:', err.message)
      if (err.message) {
        return res.status(200).json({ success: false, message: err.message })
      }
      res.status(500).json({ success: false, message: '伺服器錯誤' })
    }
  },
  getUsers: (req, res, next) => {
    try {
      userServices.getUsers(req, (err, data) => {
        if (err) return res.status(400).json({ success: false, message: err.message })
        return res.status(200).json({ success: true, data })
      })
    } catch (err) {
      res.status(500).json({ success: false, message: '伺服器錯誤' })
    }
  },
  patchUserRole: (req, res, next) => {
    try {
      userServices.patchUserRole(req, (err, data) => {
        if (err) return res.status(400).json({ success: false, message: err.message })
        return res.status(200).json({ success: true, message: '更改成功' })
      })
    } catch (err) {
      res.status(500).json({ success: false, message: '伺服器錯誤' })
    }
  },
  patchUserInfo: (req, res, next) => {
    try {
      console.log('you are in patchUserInfo')
      userServices.patchUserInfo(req, (err, data) => {
        console.log('err:', err)
        if (err) return res.status(200).json({ success: false, message: err.message })
        return res.status(200).json({ success: true, message: '更改成功' })
      })
    } catch (err) {
      res.status(500).json({ success: false, message: '伺服器錯誤' })
    }
  },
  patchUserPassword: (req, res, next) => {
    try {
      userServices.patchUserPassword(req, (err, data) => {
        if (err) return res.status(200).json({ success: false, message: err.message })
        return res.status(200).json({ success: true, message: '更改成功' })
      })
    } catch (err) {
      res.status(500).json({ success: false, message: '伺服器錯誤' })
    }
  },
  deleteUser: (req, res, next) => {
    try {
      userServices.deleteUser(req, (err, data) => {
        if (err) return res.status(400).json({ success: false, message: err.message })
        return res.status(200).json({ success: true, message: '刪除成功' })
      })
    } catch (err) {
      res.status(500).json({ success: false, message: '伺服器錯誤' })
    }
  }
}

module.exports = userController
