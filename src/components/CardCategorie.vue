<script setup>
const props = defineProps(['categorie'])
const categorie = props.categorie

</script>

<template>
    <routerLink :to="'/fiche-categorie/'+categorie.id" class="">
        <div class="ml-3 mb-2">
            <h3>- {{categorie.name}}</h3>
        </div>
    </routerLink>
</template>

<style scoped>

</style>