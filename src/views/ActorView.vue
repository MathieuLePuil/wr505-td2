<script setup>
import {onMounted, ref} from 'vue'
import axios from 'axios'
import CardActeur from "../components/CardActeur.vue";

let films = ref('')
let acteurs = ref('')

const userToken = ref(localStorage.getItem('user-token'));

onMounted(async () => {
  const acteurResponse = await axios.get(
      'http://localhost:8000/api/actors?page=1',
      {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${userToken.value}`
        }
      }
  )
  console.log(acteurResponse)
  acteurs.value = acteurResponse.data

})
</script>

<template>
  <section>
    <article>
      <h2>Acteurs</h2>
      <div class="movies-container">
        <div v-for="acteur in acteurs" :key="acteur.id" style="flex: 1">
          <card-acteur :acteur="acteur"/>
        </div>
      </div>
    </article>
  </section>
</template>
