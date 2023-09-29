<script setup>
import {useRoute} from "vue-router"
import {onMounted, ref} from "vue";
import axios from "axios";

const route = useRoute()
const id = route.params.id
const data = ref([])

onMounted(async () => {
    const response = await axios.get('http://127.0.0.1:8000/api/actors/' + id)
    data.value = response.data;

    if (data.value.nationality) {
        const nationalityResponse = await axios.get('http://127.0.0.1:8000' + data.value.nationality);
        data.value.nationality = nationalityResponse.data.nationality;
    }

    if (data.value.movies && Array.isArray(data.value.movies)) {
        const moviePromises = data.value.movies.map(movieURL => axios.get('http://127.0.0.1:8000' + movieURL));
        const movieResponses = await Promise.all(moviePromises);
        data.value.movieNames = movieResponses.map(response => response.data.title);
    }
})
</script>

<template>
    <main>
        <h1>Acteur n°{{ id }}</h1>
        <br>
        <h2>{{ data.firstName }}</h2>
        <p>{{ data.lastName }}</p>
        <p>{{ data.nationality }}</p>
        <ul v-for="movie in data.movieNames">
            <li>{{ movie }}</li>
        </ul>


    </main>
</template>