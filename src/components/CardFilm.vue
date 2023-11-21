<script setup>
const props = defineProps(['film'])
const movie = props.film

const date = new Date(movie.releaseDate)
const options = {year: 'numeric', month: 'numeric', day: 'numeric'};
movie.releaseDate = date.toLocaleDateString('fr-FR', options)

</script>

<template>
  <routerLink :to="'/fiche-movie/'+movie.id"  class="">
    <div>
      <p class="">{{movie.category.name}}</p>
      <div class="">

        <h3>{{ movie.title }}</h3>

        <em>{{ movie.description }}</em>

        <div>
          <small>Date de sortie : {{ movie.releaseDate }}</small>
          <br>
          <small>Durée : {{ movie.duration }} minutes</small>
        </div>
        <h4>Acteurs principaux</h4>
        <ul>
          <li v-for="acteur in movie.actor">{{ acteur.firstName }}</li>
        </ul>
      </div>
    </div>
  </routerLink>
</template>

<style scoped>

</style>