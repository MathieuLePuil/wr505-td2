<script setup>
import {RouterLink, RouterView} from 'vue-router'
import {ref, computed} from 'vue';

const userToken = ref(localStorage.getItem('user-token'));

const isLoggedIn = computed(() => {
  return userToken.value != null;
});

const logout = () => {
  localStorage.removeItem('user-token');
  location.reload();
};
</script>
<template>
  <header>
    <div class="">
      <div>
        <h1>MoviesList</h1>
        <em>Liste de films
        </em>
      </div>
    </div>
  </header>

  <aside class="">
    <nav>
      <ul v-if="isLoggedIn">
        <li>
          <RouterLink to="/">
            Home
          </RouterLink>
        </li>
        <li>
          <RouterLink to="/movies">
            Movies
          </RouterLink>
        </li>
        <li>
          <RouterLink to="/acteurs">
            Actors
          </RouterLink>
        </li>
        <li>
          <RouterLink to="/categories">
            Categories
          </RouterLink>
        </li>
        <li @click="logout">
          Logout
        </li>
      </ul>
      <ul v-else>
        <li>
          <RouterLink to="/login">
            Login
          </RouterLink>
        </li>
      </ul>
    </nav>
  </aside>

  <RouterView/>

</template>

<style scoped>

</style>
