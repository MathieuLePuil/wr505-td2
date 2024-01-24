<script setup>
import {useRoute} from "vue-router"
import {onMounted, ref} from 'vue'
import axios from 'axios'
import CardActeur from "../components/CardActeur.vue";

const route = useRoute()
const id = route.params.id
let film = ref('')

const userToken = ref(localStorage.getItem('user-token'));

onMounted(async () => {
  const filmResponse = await axios.get(
      'http://localhost:8000/api/movie/' + id,
      {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${userToken.value}`
        }
      }
  )
  film.value = filmResponse.data
})

let posterPath = "/src/assets/posters/";
</script>
<template>
    <div v-if="film === ''">Loading...</div>
    <section v-else class="flex mx-10 mt-10">
        <div class="mx-5">
            <img src="/affiche.jpeg" alt="Affiche du film">
            <!--      <img class="banniere" :src="posterPath+film.image" alt="affiche du film">-->
        </div>
        <div>
            <article class="fiche-article">
                <div class="space-y-2">
                    <h1 class="font-bold text-3xl">{{ film.title }}</h1>
                    <p class="">{{ film.description }}</p>
                    <p class="text-gray-500">{{ film.category.name }}</p>
                    <small class="">{{ film.duration }} minutes</small>
                </div>
            </article>
            <article>
                <h2 class="font-medium text-2xl mt-5 mb-3">Acteurs</h2>
                <div v-for="acteur in film.actor" :key="acteur.id">
                    <routerLink :to="'/fiche-actor/'+acteur.id"  class="">
                        <p>- {{ acteur.firstName }} {{ acteur.lastName }}</p>
                    </routerLink>
                </div>
            </article>
        </div>

    </section>
</template>