const dayjs = require('dayjs')
const { Message } = require('../models')
const chatServices = require('../services/chat-services')

const chatController = {
  getChatRoomsPage: async (req, res, next) => {
    try {
      chatServices.getMessages(req, (err, data) => {
        if (err) return next(err)
        // 將data.createdAt轉換成dayjs格式
        data.forEach(message => {
          message.createdAt = dayjs(message.createdAt).format('MM-DD HH:mm')
        })
        console.log(data)
        return res.render('chat-rooms', { messages: data })
      })
      const io = req.app.io

      io.once('connection', socket => {
        console.log('使用者連接')
        socket.on('error', console.error)

        socket.on('chat message', msg => {
          msg.value.time = dayjs().format('MM-DD HH:mm')
          Message.create({
            content: msg.value.value,
            userId: req.user.id
          })

          io.emit('chat message', msg)
        })

        socket.on('disconnect', () => {
          console.log('使用者離開')
        }
        )
      })
    } catch (error) {
      console.error(error)
    }
  }
}

module.exports = chatController
