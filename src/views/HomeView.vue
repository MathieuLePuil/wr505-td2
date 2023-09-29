<script setup>
import { onMounted, ref } from 'vue';
import axios from "axios";

const data = ref([]);
const dataActors = ref([]);

onMounted(async () => {
    const response = await axios.get('http://127.0.0.1:8000/api/movies');
    const movies = response.data['hydra:member'];
    data.value = movies.slice(-4).reverse();

    const responseActor = await axios.get('http://127.0.0.1:8000/api/actors');
    const actors = responseActor.data['hydra:member'];
    dataActors.value = actors.slice(-4).reverse();
});
</script>

<template>
  <main>
      <div v-for="movie in data" style="border: 1px black solid; padding: 10px; margin-bottom: 10px">
          <h2>{{ movie.title }}</h2>
          <p>{{ movie.description }}</p>
      </div>
      <br>
      <div v-for="actor in dataActors" style="border: 1px black solid; padding: 10px; margin-bottom: 10px;">
          <h2>{{ actor.firstName }}</h2>
      </div>
  </main>
</template>
