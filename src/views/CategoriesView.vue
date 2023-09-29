<script setup>
import { onMounted, ref } from 'vue';
import axios from "axios";

const data = ref([]);
const dataActors = ref([]);

onMounted(async () => {
    const response = await axios.get('http://127.0.0.1:8000/api/categories');
    data.value = response.data['hydra:member'];
});
</script>

<template>
    <main>
        <div v-for="category in data" style="border: 1px black solid; padding: 10px; margin-bottom: 10px">
            <h2>{{ category.name }}</h2>
        </div>
        <br>
    </main>
</template>
