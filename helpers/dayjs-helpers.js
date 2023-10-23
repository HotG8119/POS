const dayjs = require('dayjs')

module.exports = {
  localTime: () => {
    return dayjs().format('YYYY-MM-DD HH:mm:ss')
  }
}
