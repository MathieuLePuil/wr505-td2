<script setup>
import {onMounted, ref} from 'vue';
import axios from 'axios';
import { defineProps } from 'vue';

const props = defineProps(['film']);
const movie = props.film;

const date = new Date(movie.releaseDate);
const options = { year: 'numeric', month: 'long', day: 'numeric' };
movie.releaseDate = date.toLocaleDateString('fr-FR', options);

const actors = ref([]);

const getActorsInfo = async (actorUrls) => {
    const token = localStorage.getItem('user-token');
    const requests = actorUrls.map(url =>
        axios.get(`http://127.0.0.1:8000${url}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json',
            },
        }).then(response => response.data)
    );
    try {
        const actorsData = await Promise.all(requests);
        actors.value = actorsData;
        console.log(actorsData);
    } catch (error) {
        console.error('Erreur lors de la récupération des infos des acteurs :', error);
    }
};

onMounted(() => {
    if (movie.actor && movie.actor.length > 0) {
        getActorsInfo(movie.actor);
    }
});
</script>


<template>
    <div class="rounded-lg border bg-card text-card-foreground shadow-sm" data-v0-t="card">
        <div class="flex flex-col space-y-1.5 p-6">
            <img :src="'http://localhost:8000' + movie.imageUrl" alt="Affiche du film" class="mb-3">
            <h3 class="text-2xl font-semibold leading-none tracking-tight">{{ movie.title }}</h3>
            <p class="text-sm text-muted-foreground">{{ movie.description }}</p>
        </div>
        <div class="p-6 grid gap-4 border-y py-4">
            <div class="space-y-2">
                <p class="text-sm">Duration: {{ movie.duration }} minutes</p>
                <ul>
                    <li v-for="actor in actors" :key="actor.id">
                        <routerLink :to="'/fiche-actor/'+actor.id"  class="">
                            <p>- {{ actor.firstname }} {{ actor.lastname }}</p>
                        </routerLink>
                    </li>
                </ul>
            </div>
            <routerLink :to="'/fiche-movie/'+movie.id"  class="">
                <div class="flex justify-center items-center h-8 mt-4 cursor-pointer bg-gray-600 text-white rounded-md hover:bg-gray-800">See more</div>
            </routerLink>
            <a @click="toggleDetails(movie.id)" class="cursor-pointer flex justify-center items-center h-8 mt-4 bg-gray-300 text-black rounded-md hover:bg-gray-400">Edit</a>
        </div>
    </div>
    <div :class="[{ 'modal': selectedMovieId, 'scale-0': !selectedMovieId }]">
        <div class="modal-content" v-if="selectedMovie">
            <h2 class="text-xl font-bold mb-2">{{ selectedMovie.title }}</h2>
            <form @submit.prevent="updateMovieTitle">
                <div class="flex flex-col">
                    <label for="editMovieTitle">Titre du film :</label>
                    <input
                        type="text"
                        class="border border-gray-300 p-2 rounded-md mb-2"
                        id="editMovieTitle"
                        v-model="editedMovieTitle"
                    />
                </div>
                <button type="submit" class="bg-blue-500 px-2 py-1 rounded-md text-white">Modifier</button>
            </form>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            movies: [],
            selectedMovieId: null,
            selectedMovie: null,
            editedMovieTitle:''
        };
    },
    created() {
        this.getMovies();
    },
    methods: {
        toggleDetails(movieId) {
            this.selectedMovieId = this.selectedMovieId === movieId ? null : movieId;
            this.selectedMovie = this.movies.find(movie => movie.id === this.selectedMovieId);
            this.editedMovieTitle = this.selectedMovie ? this.selectedMovie.title : '';
        },
        async getMovies() {
            try {
                const token = localStorage.getItem('user-token');
                const response = await axios.get('http://127.0.0.1:8000/api/movies', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/json',
                    },
                });
                this.movies = response.data;
            } catch (error) {
                console.error('Error', error);
                console.log(error.response.data.code);
            }
        },
        async updateMovieTitle() {
            if (this.selectedMovie && this.editedMovieTitle) {
                try {
                    const token = localStorage.getItem('user-token');
                    if (!token) {
                        this.$router.push('/');
                        return;
                    }
                    const headers = {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/merge-patch+json',
                    };
                    const updatedMovie = { title: this.editedMovieTitle };

                    await axios.patch(`http://127.0.0.1:8000/api/movies/${this.selectedMovie.id}`, updatedMovie, { headers });

                    const movieToUpdate = this.movies.find(movie => movie.id === this.selectedMovie.id);
                    if (movieToUpdate) {
                        movieToUpdate.title = this.editedMovieTitle;
                    }

                    this.editedMovieTitle = '';
                    this.selectedMovieId = null;
                } catch (error) {
                    console.error('Erreur lors de la mise à jour du titre du film :', error);
                }
            }
        },
    },
};
</script>

<style scoped>
.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.5);
    transition: opacity 0.3s ease;
}

.modal-content {
    background-color: white;
    padding: 20px;
    border-radius: 4px;
}
</style>