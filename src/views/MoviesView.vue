<script setup>
import { onMounted, ref } from 'vue';
import axios from "axios";

const data = ref([]);

onMounted(async () => {
    const response = await axios.get('http://127.0.0.1:8000/api/movies');
    const movies = response.data['hydra:member'];

    for (let movie of movies) {
        if (movie.category) {
            const categoryResponse = await axios.get('http://127.0.0.1:8000' + movie.category);
            movie.categoryName = categoryResponse.data.name;
        }
        if (movie.actor && Array.isArray(movie.actor)) {
            const actorPromises = movie.actor.map(actorURL => axios.get('http://127.0.0.1:8000' + actorURL));
            const actorResponses = await Promise.all(actorPromises);
            movie.actorNames = actorResponses.map(response => response.data.firstName);
        }
        data.value = movies;
    }
});
</script>

<template>
    <main>
        <div v-for="movie in data" style="border: 1px black solid; padding: 10px; margin-bottom: 10px">
            <h2>{{ movie.title }}</h2>
            <p>{{ movie.description }}</p>
            <p>{{ movie.releaseDate }}</p>
            <p>{{ movie.duration }}</p>
            <p>{{ movie.categoryName }}</p>
            <p>{{ movie.actorNames.join(' ') }}</p >
        </div>
        <br>
    </main>
</template>
