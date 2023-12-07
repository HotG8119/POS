const dayjs = require('dayjs')

const chatController = {
  getChatRoomsPage: async (req, res) => {
    try {
      const io = req.app.io

      io.once('connection', socket => {
        console.log('使用者連接')
        socket.on('error', console.error)

        socket.on('chat message', msg => {
          msg.value.time = dayjs().format('HH:mm')
          io.emit('chat message', msg)
        })

        socket.on('disconnect', () => {
          console.log('使用者離開')
        }
        )
      })

      res.render('chat-rooms')
    } catch (error) {
      console.error(error)
    }
  }
}

module.exports = chatController
