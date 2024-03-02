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
          user: userData.name,
          role: userData.isAdmin ? 'admin' : 'common',
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
      const { name, email, password, passwordCheck } = req.body
      if (!name || !email || !password || !passwordCheck) throw new Error('所有欄位都是必填！')
      if (password !== passwordCheck) throw new Error('密碼與確認密碼不相符！')

      await userServices.signUp(req, (err, data) => {
        if (err) throw new Error(err.message)
        res.status(200).json({ success: true, message: '成功註冊帳號！' })
      })
    } catch (err) {
      if (err.message) {
        return res.status(400).json({ success: false, message: err.message })
      }
      res.status(500).json({ success: false, message: '伺服器錯誤' })
    }
  }
}

module.exports = userController
