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
        'https://mmi21b12.sae105.ovh/api/movie/' + id,
        {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${userToken.value}`
            }
        }
    )
    film.value = filmResponse.data

    let actorPromises = film.value.actor.map(actor => axios.get('https://mmi21b12.sae105.ovh' + actor, {
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${userToken.value}`
        }
    }));

    let actorResponses = await Promise.all(actorPromises);

    film.value.actor = actorResponses.map(response => response.data);
})
</script>

<template>
    <div v-if="film === ''">Loading...</div>
    <section v-else class="flex mx-10 mt-10">
        <div class="mx-5">
            <img :src="'https://mmi21b12.sae105.ovh' + film.imageUrl" alt="Affiche du film">
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
                        <p>- {{ acteur.firstname }} {{ acteur.lastname }}</p>
                    </routerLink>
                </div>
            </article>
        </div>
    </section>
</template>