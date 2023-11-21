<script setup>
import {onMounted, ref} from 'vue'
import axios from 'axios'
import CardFilm from "./CardFilm.vue";
import CardActeur from "./CardActeur.vue";

const token = localStorage.getItem('user-token');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

console.log(token)

let films = ref('')
let acteurs = ref('')

onMounted(async () => {
  const filmResponse = await axios.get(
      'http://localhost:8000/api/movies?online=true&page=1',
      {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
  )
  films.value = filmResponse.data

  const acteurResponse = await axios.get(
      'http://localhost:8000/api/actors?page=1',
      {
        headers: {
          'Accept': 'application/json'
        }
      }
  )
  console.log(acteurResponse)
  acteurs.value = acteurResponse.data

})
</script>

<template>
  <section>
    <article>
      <h2>Films à la Une</h2>
      <div class="">
        <div v-for="film in films.slice(0,4)" :key="film.id" class="">
          <card-film :film="film"/>
        </div>
      </div>
    </article>
  </section>

  <section>
    <article>
      <h2>4 acteurs (API)</h2>
      <div class="">
        <div v-for="acteur in acteurs.slice(0,4)" :key="acteur.id">
          <card-acteur :acteur="acteur"/>
        </div>
      </div>
    </article>
  </section>
</template>
