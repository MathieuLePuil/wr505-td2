<script setup>
const props = defineProps(['acteur'])
const actor = props.acteur
</script>

<template>
    <section class="py-12 bg-white dark:bg-gray-800 rounded-lg shadow-lg border-2 border-gray-300 dark:border-gray-700">
        <div class="container px-4 md:px-6">
            <div class="grid gap-6">
                <div class="flex flex-col space-y-4">
                    <h1 class="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">{{ actor.firstName }} {{ actor.lastName }}</h1>
                    <p class="max-w-[600px] text-zinc-500 md:text-xl dark:text-zinc-400">{{ nationalite }}</p>
                </div>
                <div class="flex flex-col space-y-4">
                    <h2 class="text-2xl font-bold tracking-tighter sm:text-3xl xl:text-4xl/none">Movies</h2>
                    <div v-for="movie in actor.movies">
                        <div class="space-y-1">
                            <routerLink :to="'/fiche-movie/'+movie.id" class="link">{{ movie.title }}</routerLink>
                        </div>
                    </div>
                </div>
                <routerLink :to="'/fiche-actor/'+actor.id"  class="">
                    <div class="flex justify-center items-center h-8 mt-4 cursor-pointer bg-gray-600 text-white rounded-md">See more</div>
                </routerLink>
            </div>
        </div>
    </section>
</template>

<style scoped>

</style>