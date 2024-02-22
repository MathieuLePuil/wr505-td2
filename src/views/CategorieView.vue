<script setup>
import {onMounted, ref} from 'vue'
import axios from 'axios'
import CardCategorie from "../components/CardCategorie.vue";

let categories = ref('')
let searchText = ref('')

const userToken = ref(localStorage.getItem('user-token'));

onMounted(async () => {
    const filmResponse = await axios.get(
        'http://localhost:8000/api/categories?page=1',
        {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${userToken.value}`
            }
        }
    )
    categories.value = filmResponse.data
})

const searchCategories = async () => {
    const response = await axios.get(
        `http://localhost:8000/api/categories?name=${searchText.value}`,
        {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${userToken.value}`
            }
        }
    )
    categories.value = response.data
}
</script>

<template>
    <section>
        <article class="mt-10 mx-10">
            <h2 class="font-bold text-4xl">Catégories</h2>
            <div class="movies-container mt-2">
                <input v-model="searchText" type="text" placeholder="Search..." class="border-2 border-gray-300 bg-white h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none">
                <button @click="searchCategories" class="bg-blue-500 text-white px-4 py-2 rounded">Search</button>
                <div v-for="categorie in categories" :key="categorie.id" class="card-container mt-3">
                    <card-categorie :categorie="categorie" />
                </div>
            </div>
        </article>
    </section>
</template>