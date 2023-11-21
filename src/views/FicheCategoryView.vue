<script setup>
import {useRoute} from "vue-router"
import {onMounted, ref} from 'vue'
import axios from 'axios'

const userToken = ref(localStorage.getItem('user-token'));

const route = useRoute()
const id = route.params.id
let categorie = ref('')

onMounted(async () => {
  const categorieResponse = await axios.get(
      'http://localhost:8000/api/categories/' + id,
      {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${userToken.value}`
        }
      }
  )
  categorie.value = categorieResponse.data
})
</script>
<template>
  <div>
    <h1>{{ categorie.name }}</h1>
    <hr>
    <h2>Films dans cette catégorie</h2>
<!--    <article class="movies-container">-->
<!--      <div v-for="film in categorie.movies" :key="film.id" class="card-container">-->
<!--        <card-film :film="film"/>-->
<!--      </div>-->
<!--    </article>-->
  </div>
</template>