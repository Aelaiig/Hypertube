import Vue from 'vue';
import Router from 'vue-router';

import Home from './views/Home.vue';
import SignUp from './views/SignUp.vue';
import SignUpOmniauth from './views/SignUpOmniauth.vue';
import SignIn from './views/SignIn.vue';
import ResetPassword from './views/ResetPassword.vue';
import Player from './views/Player.vue';
import UserProfile from './views/UserProfile.vue';
import Settings from './views/Settings.vue';
import ConfirmNewEmail from './views/ConfirmNewEmail.vue';
import ServerOffline from './views/ServerOffline.vue';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: {
        authRequire: false,
      },
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignUp,
    },
    {
      path: '/signupOmniauth',
      name: 'signupOmniauth',
      component: SignUpOmniauth,
    },
    {
      path: '/signin',
      name: 'signin',
      component: SignIn,
    },
    {
      path: '/player/:hash',
      name: 'player',
      component: Player,
      meta: {
        authRequire: true,
      },
    },
    {
      path: '/user/:id',
      name: 'user',
      component: UserProfile,
      meta: {
        authRequire: true,
      },
    },
    {
      path: '/settings',
      name: 'settings',
      component: Settings,
      meta: {
        authRequire: true,
      },
    },
    {
      path: '/confirmNewEmail/:newEmailToken',
      name: 'confirmNewEmail',
      component: ConfirmNewEmail,
    },
    {
      path: '/resetPassword/:authKey',
      name: 'resetPassword',
      component: ResetPassword,
    },
    {
      path: '/offline',
      name: 'offline',
      component: ServerOffline,
    },
  ],
});

router.beforeEach((to, from, next) => {
  if (to.meta.authRequire === true) {
    const token = localStorage.getItem('user-token');
    if (!token) {
      next('/signin');
      return;
    }
  }
  next();
});

export default router;
