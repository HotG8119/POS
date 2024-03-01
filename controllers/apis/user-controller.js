const jwt = require('jsonwebtoken')

const userServices = require('../../services/user-services')

const userController = {
  signUp: (req, res, next) => {
    try {
      userServices.signUp(req, (err, data) => {
        if (err) return next(err)
        res.status(200).json({
          status: 'success',
          message: '成功註冊帳號！'
        })
      })
    } catch (err) {
      console.log(err)
    }

    // userServices.signUp(req, (err, data) => {

    //     res.status(200).json({
    //       status: 'success',
    //       message: '成功註冊帳號！'
    //     })
    //   } catch (err) {
    //     // console.log(err)
    //     res.status(500).json({
    //       status: 'error',
    //       message: '伺服器錯誤'
    //     })
    //     next(err)
    //   }

    //   if (err) return next(err)
    //   return res.redirect('/admins/index')
    // })
  },
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

      // res.json({
      //   status: 'success',
      //   data: {
      //     user: userData,
      //     accessToken
      //   }
      // })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = userController
