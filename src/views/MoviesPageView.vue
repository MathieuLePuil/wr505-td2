<script setup>
import {useRoute} from "vue-router"
import {onMounted, ref} from "vue";
import axios from "axios";

const route = useRoute()
const id = route.params.id
const data = ref([])

onMounted(async () => {
    const response = await axios.get('http://127.0.0.1:8000/api/movies/' + id)
    data.value = response.data;

    if (data.value.category) {
        const categoryResponse = await axios.get('http://127.0.0.1:8000' + data.value.category);
        data.value.categoryName = categoryResponse.data.name;
    }
    if (data.value.actor && Array.isArray(data.value.actor)) {
        const actorPromises = data.value.actor.map(actorURL => axios.get('http://127.0.0.1:8000' + actorURL));
        const actorResponses = await Promise.all(actorPromises);
        data.value.actorNames = actorResponses.map(response => response.data.firstName);
    }
})
</script>

<template>
    <main>
        <h1>Film n°{{ id }}</h1>
        <br>
        <h2>{{ data.title }}</h2>
        <p>{{ data.description }}</p>
        <p>{{ data.releaseDate }}</p>
        <p>{{ data.duration }}</p>
        <p>{{ data.categoryName }}</p>
        <ul v-for="actor in data.actorNames">
            <li>{{ actor }}</li>
        </ul>


    </main>
</template>