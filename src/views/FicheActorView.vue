<script setup>
import {useRoute} from "vue-router"
import {onMounted, ref} from 'vue'
import axios from 'axios'

const route = useRoute()
const id = route.params.id
let actor = ref('')

const userToken = ref(localStorage.getItem('user-token'));

onMounted(async () => {
  const actorResponse = await axios.get(
      'http://localhost:8000/api/actor/' + id,
      {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${userToken.value}`
        }
      }
  )
  actor.value = actorResponse.data
})

</script>
<template>
  <div v-if="actor">
    <h1>{{ actor.firstName }} {{ actor.lastName }}</h1>
    <em>Nationalité : {{ actor.nationalite.name }}</em>
    <hr>
    <h2>A joué dans les films</h2>
    <ul>
      <li v-for="movie in actor.movies">
        <routerLink :to="'/fiche-movie/'+movie.id" class="link">{{ movie.title }}</routerLink>
      </li>
    </ul>
  </div>
</template>