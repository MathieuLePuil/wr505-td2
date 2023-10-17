<script setup>
import {useRoute} from "vue-router"
import {onMounted, ref} from "vue";
import axios from "axios";

const route = useRoute()
const id = route.params.id
const data = ref([])

onMounted(async () => {
    const response = await axios.get('http://127.0.0.1:8000/api/movies/' + id)
    const movies = response.data;

    for (let movie of movies) {
        if (movie.category) {
            const categoryResponse = await axios.get('http://127.0.0.1:8000' + movie.category);
            movie.categoryName = categoryResponse.data.name;
        }
        data.value = movies;

    }

})
</script>

<template>
    <main>
        <h1>Film n°{{ id }}</h1>
        <div v-for="movie in data">
            <h2>{{ movie.title }}</h2>
<!--            <p>{{ data.description }}</p>-->
<!--            <p>{{ data.releaseDate }}</p>-->
<!--            <p>{{ data.duration }}</p>-->
<!--            <p>{{ data.category }}</p>-->
<!--            <p>{{ data.actor }}</p >-->
        </div>

    </main>
</template>