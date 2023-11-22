import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import FicheMovieView from "../views/FicheMovieView.vue";
import FicheActorView from "../views/FicheActorView.vue";
import FicheCategoryView from "../views/FicheCategoryView.vue";
import LoginView from "../views/LoginView.vue";

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
      path: '/fiche-categorie/:id',
      name: 'ficheCategorie',
      component: FicheCategoryView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
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
