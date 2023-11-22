<script setup>
    const props = defineProps(['film'])
    const movie = props.film

    const date = new Date(movie.releaseDate)
    const options = {year: 'numeric', month: 'numeric', day: 'numeric'};
    movie.releaseDate = date.toLocaleDateString('fr-FR', options)
</script>

<template>
    <div class="rounded-lg border bg-card text-card-foreground shadow-sm" data-v0-t="card">
        <div class="flex flex-col space-y-1.5 p-6">
            <h3 class="text-2xl font-semibold leading-none tracking-tight">{{ movie.title }}</h3>
            <p class="text-sm text-muted-foreground">{{ movie.description }}</p>
        </div>
        <div class="p-6 grid gap-4 border-y py-4">
            <div class="space-y-2">
                <p class="text-sm">Release Date: {{ movie.releaseDate }}</p>
                <p class="text-sm">Duration: {{ movie.duration }} minutes</p>
            </div>
            <h4 class="text-lg font-semibold mt-4">Cast:</h4>
            <ul v-for="actor in movie.actor" class="space-y-2">
                <li>
                    {{ actor.firstName }} {{ actor.lastName }}  
                </li>
            </ul>
            <routerLink :to="'/fiche-movie/'+movie.id"  class="">
                <div class="flex justify-center items-center h-8 mt-4 cursor-pointer bg-gray-600 text-white rounded-md">See more</div>
            </routerLink>
        </div>
    </div>
</template>

<style scoped>

</style>