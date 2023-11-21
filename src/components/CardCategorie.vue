<script setup>
const props = defineProps(['categorie'])
const categorie = props.categorie

</script>

<template>
    <routerLink :to="'/fiche-categorie/'+categorie.id" class="">
  <div>
    <h3>{{categorie.name}}</h3>
  </div>
    </routerLink>
</template>

<style scoped>

</style>