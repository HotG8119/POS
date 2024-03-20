const routerController = {
  asyncRoutes: (req, res, next) => {
    const systemRoutes = {
      path: '/system',
      meta: {
        icon: 'informationLine',
        title: '管理員後台',
        // showLink: false,
        rank: 99
      },
      children: [
        {
          path: '/system/users/index',
          name: '所有使用者',
          // component: () => import('@/views/system/users/index.vue'),
          meta: {
            icon: 'mdi:user-outline',
            title: '使用者管理',
            roles: ['admin']
          }
        },
        {
          path: '/system/menu',
          name: '菜單管理',
          // component: () => import('@/views/system/products/index.vue'),
          meta: {
            icon: 'material-symbols:menu-book-outline',
            title: '商品管理',
            roles: ['admin']
          },
          children: [
            {
              path: '/system/menu/products/index',
              name: '全部商品',
              meta: {
                icon: 'fluent-mdl2:product',
                title: '全部商品',
                roles: ['admin']
              }
            },
            {
              path: '/system/menu/categories/index',
              name: '商品分類',
              meta: {
                icon: 'carbon:category',
                title: '商品分類',
                roles: ['admin']
              }
            }
          ]
        }
      ]
    }

    res.json({
      success: true,
      message: '獲取動態路由成功',
      data: [systemRoutes]
    })
  }
}

module.exports = routerController
