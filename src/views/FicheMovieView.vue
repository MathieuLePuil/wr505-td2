<script setup>
import {useRoute} from "vue-router"
import {onMounted, ref} from 'vue'
import axios from 'axios'
import CardActeur from "../components/CardActeur.vue";

const route = useRoute()
const id = route.params.id
let film = ref('')

const userToken = ref(localStorage.getItem('user-token'));

onMounted(async () => {
  const filmResponse = await axios.get(
      'http://localhost:8000/api/movie/' + id,
      {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${userToken.value}`
        }
      }
  )
  film.value = filmResponse.data
})

let posterPath = "/src/assets/posters/"; // Le chemin d'accès à l'image
</script>
<template>
  <div v-if="film === ''">Loading...</div>
  <section v-else>
    <article class="fiche-article">
      <img class="banniere" :src="posterPath+film.image" alt="affiche du film">
      <!--    <div class="banniere" :style="{ backgroundImage: `url(${posterPath + film.image})` }"></div>-->
      <div>
        <div class="tag">
          {{ film.category.name }}
        </div>
        <h1>{{ film.title }}</h1>
        <p>{{ film.description }}</p>
        <small>{{ film.duration }} minutes</small>
      </div>
    </article>
    <article>
    <h2>Acteurs figurants dans ce film</h2>
      <div v-for="acteur in film.actor" :key="acteur.id">
        <card-acteur :acteur="acteur"/>
      </div>
    </article>
  </section>
</template>