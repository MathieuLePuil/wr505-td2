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
      'https://mmi21b12.mmi-troyes.fr/wr506/public/api/movies?online=true&page=1',
      {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
  )
  films.value = filmResponse.data

  const acteurResponse = await axios.get(
      'https://mmi21b12.mmi-troyes.fr/wr506/public/api/actors?page=1',
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
      <h1 class="text-3xl px-10 my-10 font-semibold">Selection of movies</h1>
    <article>
      <div class="flex px-10 flex-wrap mt-5">
        <div v-for="film in films.slice(0,4)" :key="film.id" class="w-1/3 px-3 mb-5">
          <card-film :film="film"/>
        </div>
      </div>
    </article>
  </section>

  <section>
      <h1 class="text-3xl px-10 my-10 font-semibold">Selection of actors</h1>
    <article>
      <div class="flex px-10 flex-wrap mt-5">
        <div v-for="acteur in acteurs.slice(0,4)" :key="acteur.id" class="px-3 mb-5">
          <card-acteur :acteur="acteur"/>
        </div>
      </div>
    </article>
  </section>
</template>
