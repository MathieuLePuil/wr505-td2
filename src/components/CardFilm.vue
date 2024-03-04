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
        axios.get(`https://mmi21b12.sae105.ovh${url}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json',
            },
        }).then(response => response.data)
    );
    try {
        const actorsData = await Promise.all(requests);
        actors.value = actorsData;
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
            <a @click="showDeleteConfirmation = true" class="cursor-pointer flex justify-center items-center h-8 mt-4 bg-red-500 text-white rounded-md hover:bg-red-700">Delete</a>
        </div>
    </div>
    <div :class="[{ 'modal': selectedMovieId, 'scale-0': !selectedMovieId }]">
        <div class="modal-content" v-if="selectedMovie">
            <h2 class="text-xl font-bold mb-2">{{ selectedMovie.title }}</h2>
            <form @submit.prevent="updateMovie">
                <div class="flex flex-col">
                    <label for="editMovieTitle">Titre du film :</label>
                    <input
                        type="text"
                        class="border border-gray-300 p-2 rounded-md mb-2"
                        id="editMovieTitle"
                        v-model="editedMovieTitle"
                    />
                    <label for="editMovieDescription">Description :</label>
                    <textarea
                        class="border border-gray-300 p-2 rounded-md mb-2"
                        id="editMovieDescription"
                        v-model="selectedMovie.description"
                    ></textarea>
                    <label for="editMovieDuration">Durée :</label>
                    <input
                        type="number"
                        class="border border-gray-300 p-2 rounded-md mb-2"
                        id="editMovieDuration"
                        v-model="selectedMovie.duration"
                    />
                </div>
                <button type="submit" class="bg-blue-500 px-2 py-1 rounded-md text-white">Modifier</button>
            </form>
        </div>
    </div>
    <div v-if="showDeleteConfirmation" class="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
            <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div class="sm:flex sm:items-start">
                        <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                            <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                Delete Movie
                            </h3>
                            <div class="mt-2">
                                <p>Are you sure you want to delete this movie?</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button @click="deleteMovie" type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                        Delete
                    </button>
                    <button @click="showDeleteConfirmation = false" type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                        Cancel
                    </button>
                </div>
            </div>
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
            editedMovieTitle:'',
            showDeleteConfirmation: false,
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
                const response = await axios.get('https://mmi21b12.sae105.ovh/api/movies', {
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
        async updateMovie() {
            if (this.selectedMovie) {
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

                    const movieToUpdate = {
                        title: this.editedMovieTitle,
                    };

                    await axios.patch(`https://mmi21b12.sae105.ovh/api/movies/${this.selectedMovie.id}`, movieToUpdate, { headers });

                    const movieInList = this.movies.find(movie => movie.id === this.selectedMovie.id);
                    if (movieInList) {
                        Object.assign(movieInList, this.selectedMovie);
                        movieInList.title = this.editedMovieTitle;
                    }

                    this.selectedMovieId = null;
                    this.$emit('refreshMovies');
                } catch (error) {
                    console.error('Erreur lors de la mise à jour du film :', error);
                }
            }
        },
        async deleteMovie() {
            try {
                const token = localStorage.getItem('user-token');
                if (!token) {
                    this.$router.push('/');
                    return;
                }
                const headers = {
                    Authorization: `Bearer ${token}`,
                };

                await axios.delete(`https://mmi21b12.sae105.ovh/api/movies/${this.film.id}`, { headers });

                this.showDeleteConfirmation = false;

                this.$emit('refreshMovies');
            } catch (error) {
                console.error('Erreur lors de la suppression du film :', error);
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