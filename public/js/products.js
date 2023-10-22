const menu = document.getElementById('menu')
const cart = document.getElementById('cart')
const totalAmount = document.getElementById('total-amount')
const button = document.getElementById('submit-button')
const resetCartButton = document.getElementById('reset-cart-button')

let total = 0
const cartItems = []

function addToCart (event) {
  const id = event.target.dataset.id
  if (!id) return
  const name = event.target.dataset.name
  const price = Number(event.target.dataset.price)
  // 加入購物車變數cartItems 分：有按過、沒按過
  const targetCartItem = cartItems.find(item => item.id === id)
  // 有按過 換數量的值
  if (targetCartItem) {
    targetCartItem.quantity += 1
  } else {
  // 沒按過 加入新資料
    cartItems.push({
      id,
      name,
      price,
      quantity: 1
    })
  }

  // 畫面顯示購物車清單
  cart.innerHTML = cartItems.map(item => `
  <li class="list-group-item">
    ${item.name} X ${item.quantity} 共：${item.price * item.quantity}
    <button type="button" class="delete-all-button btn btn-danger btn-sm float-end" data-id="${item.id}">删除</button>
    <button type="button" class="delete-button btn btn-secondary btn-sm float-end me-2" data-id="${item.id}">-1</button>
  </li>
`).join('')

  // 計算總金額
  calculateTotal(cartItems)
}

function deleteCartItem (event) {
  const id = event.target.dataset.id
  const deleteAll = event.target.classList.contains('delete-all-button')
  if (!id) return
  // 從cartItems刪除資料
  const targetCartItem = cartItems.find(item => item.id === id)

  if (targetCartItem.quantity > 1 && !deleteAll) {
    targetCartItem.quantity -= 1
    // 購物車的數量要跟著變
    cart.innerHTML = cartItems.map(item => `
    <li class="list-group-item">
      ${item.name} X ${item.quantity} 共：${item.price * item.quantity}
      <button type="button" class="delete-all-button btn btn-danger btn-sm float-end" data-id="${item.id}">删除</button>
      <button type="button" class="delete-button btn btn-secondary btn-sm float-end me-2" data-id="${item.id}">-1</button>
    </li>
  `).join('')
    //
  } else {
    cartItems.splice(cartItems.indexOf(targetCartItem), 1)
    // 購物車刪除資料對應的li
    event.target.parentElement.remove()
  }
  // 計算總金額
  calculateTotal(cartItems)
}

// 7.計算總金額
function calculateTotal (cartItems) {
  // 所有cartItem array裡的price * quantity相加
  total = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  totalAmount.textContent = total
}

// // 8.送出訂單
// function submit () {
//   if (cartItems.length === 0) {
//     return alert('請先加入商品')
//   }
//   const cartItemsData = JSON.stringify(cartItems)
//   // const cartItemsData = JSON.stringify(cartItems.map(item => ({
//   //   id: item.id,
//   //   quantity: item.quantity
//   // })))
//   console.log(cartItemsData)

//   axios.post('/orders', {
//     cartItems: cartItemsData,
//     total
//   })
//     .then(res => {
//       if (res.data.status === 'success') {
//         alert('訂單送出成功')
//         reset()
//       } else {
//         alert('訂單送出失敗')
//       }
//     })
//     .catch(err => {
//       console.log(err)
//       alert('訂單送出失敗')
//     })
// }

// 9.重置資料
function reset () {
  total = 0
  cartItems.length = 0
  cart.innerHTML = ''
  totalAmount.textContent = total
}

function addCartItemsToValue (cartItems) {
  const cartItemsData = JSON.stringify(cartItems)
  // 將cartItems轉成成 {[item.id, item.quantity], [item.id, item.quantity]...} 並轉成JSON格式
  // const cartItemsData = JSON.stringify(cartItems.map(item => [Number(item.id), Number(item.quantity)]))
  // 存到input的value裡
  const cartItemsInput = document.getElementById('cartItems')
  const totalAmountInput = document.getElementById('totalAmount')
  cartItemsInput.value = cartItemsData
  totalAmountInput.value = total
}

// 10. 加入事件監聽
menu.addEventListener('click', addToCart)
cart.addEventListener('click', deleteCartItem)
button.addEventListener('click', () => {
  addCartItemsToValue(cartItems)
  // reset()
})
resetCartButton.addEventListener('click', reset)
