const WebSocket = require('ws')
const wss = new WebSocket.Server({ port: 8080 })
const dayjs = require('dayjs')

// 暫存訊息放置處
const messages = []

wss.on('connection', function connection (ws) {
  ws.on('error', console.error)

  ws.on('message', function message (data) {
    // 由於 data 是 Buffer，所以要使用 toString 轉成字串，在轉成物件新增時間屬性
    const dataObj = JSON.parse(data.toString())
    dataObj.time = dayjs().format('HH:mm')
    messages.push(dataObj)
    // 當message.length>50時，刪除最舊的一筆
    if (messages.length > 50) {
      messages.shift()
    }

    // 將所有連線的 client 傳送訊息
    wss.clients.forEach(client => {
      // 由於 messages 往前端傳送時，會是 Blob，所以要先轉成字串
      client.send(JSON.stringify(messages) || [])
    })
  })

  // 當連線時，將所有訊息傳送給連線的 client，所以算是初始化訊息
  ws.send(JSON.stringify(messages) || [])
})
