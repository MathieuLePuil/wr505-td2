import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import FicheMovieView from "../views/FicheMovieView.vue";
import FicheActorView from "../views/FicheActorView.vue";
import LoginView from "../views/LoginView.vue";
import AccountView from "@/views/AccountView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/movies',
      name: 'movies',
      component: () => import('../views/MovieView.vue')
    },
    {
      path: '/actors',
      name: 'actors',
      component: () => import('../views/ActorView.vue')
    },
    {
      path: '/categories',
      name: 'categories',
      component: () => import('../views/CategorieView.vue')
    },
    {
      path: '/fiche-movie/:id',
      name: 'ficheMovie',
      component: FicheMovieView
    },
    {
      path: '/fiche-actor/:id',
      name: 'ficheActor',
      component: FicheActorView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/account',
      name: 'account',
      component: AccountView
    },
  ]
})

router.beforeEach((to, from, next) => {
  const PUBLIC_PAGES = ['login'];
  const loggedIn = localStorage.getItem('user-token');

  if (!loggedIn && !PUBLIC_PAGES.includes(to.name)) {
    return next('/login');
  }

  next();
});

export default router
