<script setup>
import {onMounted, ref} from 'vue'
import axios from 'axios'
import CardCategorie from "../components/CardCategorie.vue";

let categories = ref('')
let acteurs = ref('')

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
</script>

<template>
  <section>
    <article>
      <h2>Catégories</h2>
      <div class="movies-container">
        <div v-for="categorie in categories" :key="categorie.id" class="card-container">
          <card-categorie :categorie="categorie"/>
        </div>
      </div>
    </article>
  </section>
</template>
