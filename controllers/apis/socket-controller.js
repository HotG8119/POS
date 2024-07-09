const dayjs = require('dayjs')
const { Server } = require('socket.io')
// const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000'
// const { Message } = require('../../models')
// const chatServices = require('../services/chat-services')

const socketController = {
  getOrderProductSocketConnect: async (req, res, next) => {
    try {
      console.log('連接 socket.io')

      const io = new Server({ /* options */ })

      console.log('io', io)
      io.once('connection', socket => {
        console.log('使用者連接')
        socket.send('歡迎使用聊天室！')

        socket.on('error', console.error)

        socket.on('chat message', msg => {
          msg.value.time = dayjs().format('MM-DD HH:mm')
          //   Message.create({
          //     content: msg.value.value,
          //     userId: req.user.id
          //   })

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

module.exports = socketController
