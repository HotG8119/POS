const { Message, User } = require('../models')

const chatServices = {
  getMessages: async (req, cb) => {
    try {
      const messages = await Message.findAll({
        raw: true,
        nest: true,
        order: [['createdAt', 'ASC']],
        attributes: ['id', 'content', 'createdAt', 'message_type'],
        include: [
          User,
          { model: User, attributes: ['name'] }
        ]
      })

      return cb(null, messages)
    } catch (err) {
      return cb(err)
    }
  }
}

module.exports = chatServices
