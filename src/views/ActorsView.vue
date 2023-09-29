<script setup>
import { onMounted, ref } from 'vue';
import axios from "axios";

const data = ref([]);

onMounted(async () => {
    const response = await axios.get('http://127.0.0.1:8000/api/actors');
    const actors = response.data['hydra:member'];

    for (let actor of actors) {
        if (actor.nationality) {
            const categoryResponse = await axios.get('http://127.0.0.1:8000' + actor.nationality);
            actor.Nationality = categoryResponse.data.nationality;
        }
        data.value = actors;
    }
});
</script>

<template>
    <main>
        <div v-for="actor in data" style="border: 1px black solid; padding: 10px; margin-bottom: 10px">
            <h2>{{ actor.firstName }} {{ actor.lastName }}</h2>
            <p>{{ actor.Nationality }}</p>
        </div>
        <br>
    </main>
</template>
