import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Leaderboard from '../views/Leaderboard.vue';
import Play from '../views/Play.vue';
import Me from '../views/Me.vue';
import About from '../views/About.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'play',
      component: Play
    },
    {
      path: '/me',
      name: 'me',
      component: Me
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/leaderboard',
      name: 'Leaderboard',
      component: Leaderboard
    },
    {
      path: '/about',
      name: 'About',
      component: About
    }
  ]
});

export default router;
