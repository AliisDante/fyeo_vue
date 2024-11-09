import { createRouter, createWebHistory } from 'vue-router'
import FilesView from '../views/FilesView.vue'
import { only_with_auth_token } from './rules.js'
import { add_message } from '../messages.js'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue')
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/organisation_signup',
      name: 'organisation_signup',
      component: () => import('../views/OrganisationSignupView.vue')
    },
    {
      path: '/create_user',
      name: 'create_user',
      component: () => import('../views/UserCreateView.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/files/:folder*',
      name: 'files',
      component: FilesView
    },
    {
      path: '/drm',
      name: 'drm',
      component: () => import('../views/DRMView.vue')
    },
    {
      path: '/keys',
      name: 'keys',
      component: () => import('../views/KeysView.vue')
    },
    {
      path: '/classification',
      name: 'classification',
      component: () => import('../views/ClassificationView.vue')
    },
    {
      path: '/users',
      name: 'user',
      component: () => import('../views/UsersView.vue')
    },
    {
      path: '/policies',
      name: 'policies',
      component: () => import('../views/PoliciesView.vue')
    },
    {
      path: '/logout',
      name: 'logout',
      component: () => import('../views/LogoutView.vue')
    },
    {
      path: '/editor',
      name: 'editor',
      component: () => import('../views/EditorView.vue')
    },
    {
      path: '/policywriting',
      name: 'writing',
      component: () => import('../views/PolicyWritingView.vue')
    },
    {
      path: '/image',
      name: 'image',
      component: () => import('../views/ImageEditorView.vue')
    },
    {
      path: '/watermarktest',
      name: 'watermarktest',
      component: () => import('../views/WatermarkTestView.vue')
    },
    {
      path: '/watermark',
      name: 'watermark',
      component: () => import('../views/WatermarkView.vue')
    },
    {
      path: '/debugging',
      name: 'debugging',
      component: () => import('../views/Debug.vue')
    },
    {
      path: '/camera',
      name: 'camera',
      component: () => import('../views/CameraCapture.vue')
    },{
      path: '/admin',
      name: 'admin',
      component: () => import('../views/AdminView.vue')
    },{
      path: '/tools',
      name: 'tools',
      component: () => import('../views/ToolView.vue')
    },{
      path: '/:pathMatch(.*)*',
      component: () => import('../views/ToolView.vue')
    }
  ]
})

router.beforeEach((to) => {
  let valid_navigation = only_with_auth_token(to)
  if (!valid_navigation) {
    add_message('error', 'Login required before accessing this page')
    // return 'login'
    // Allow page access anyway for development purposes
    return true
  }
  else {
    return valid_navigation
  }
})

export default router
