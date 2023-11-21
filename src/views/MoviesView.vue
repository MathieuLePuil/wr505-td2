<script setup>
import {onMounted, ref} from 'vue';
import axios from "axios";

const data = ref([]);

onMounted(async () => {
    const response = await axios.get('http://127.0.0.1:8000/api/movies?online=1');
    data.value = response.data['hydra:member'];
});
</script>

<template>
    <main>
        <div v-for="movie in data" style="border: 1px black solid; padding: 10px; margin-bottom: 10px">
            <h2>{{ movie.title }}</h2>
        </div>
        <br>
    </main>
</template>
