import { createRouter, createWebHashHistory } from 'vue-router'
import main from '../pages/main.vue'
import App from '../App.vue'
import login from '../pages/login.vue'
const routes = [
  {
    path: '/',
    name: 'App',
    component: App,
    children:[
        {
            path: '/',
            name: 'Login',
            component: login
          }
    ]
  },
  {
    path: '/main',
    name: 'Main',
    component: main
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
