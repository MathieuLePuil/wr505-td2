<script setup>
import {onMounted, ref} from 'vue'
import axios from 'axios'
import CardFilm from "../components/CardFilm.vue";

let films = ref('')
let acteurs = ref('')

const userToken = ref(localStorage.getItem('user-token'));

onMounted(async () => {
  const filmResponse = await axios.get(
      'http://localhost:8000/api/movies?online=true&order[title]=asc&page=1',
      {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${userToken.value}`
        }
      }
  )
  films.value = filmResponse.data
})
</script>

<template>
  <section>
    <article>
      <h2>Films à la Une</h2>
      <div class="movies-container">
        <div v-for="film in films" :key="film.id" class="card-container">
          <card-film :film="film"/>
        </div>
      </div>
    </article>
  </section>
</template>
