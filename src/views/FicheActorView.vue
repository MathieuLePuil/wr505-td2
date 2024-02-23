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
  <div v-if="actor" class="mt-10 mx-10 space-y-2">
    <h1 class="font-bold text-4xl">{{ actor.firstname }} {{ actor.lastname }}</h1>
    <p class="">Nationalité : {{ actor.nationality }}</p>
    <hr>
    <h2 class="text-2xl font-semibold">Filmographie</h2>
    <ul>
      <li v-for="movie in actor.movies">
        <routerLink :to="'/fiche-movie/'+movie.id" class="link ml-2">- {{ movie.title }}</routerLink>
      </li>
    </ul>
  </div>
</template>