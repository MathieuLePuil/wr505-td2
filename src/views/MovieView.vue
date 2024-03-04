
<template>
    <section>
        <article>
            <h1 class="text-3xl px-10 my-10 font-semibold">List of movies</h1>
            <div class="flex px-10 mt-5">
                <input v-model="searchText" type="text" placeholder="Search..." class="border-2 border-gray-300 bg-white h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none">
                <button @click="searchMovies" class="bg-blue-500 text-white px-4 py-2 rounded">Search</button>
                <button @click="showAddMovieForm = true" class="bg-blue-500 text-white px-4 py-2 rounded ml-10">Add Movie</button>
            </div>
            <div class="flex px-10 flex-wrap mt-5">
                <div v-for="movie in movies" :key="movie.id" class="flex flex-col items-center w-1/3 px-3 mb-5">
                    <card-film :film="movie" @refreshMovies="getMovies"/>
                </div>
            </div>
        </article>
        <div class="bg-gradient-to-r flex items-center justify-center">
            <div class="max-w-full md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl mx-auto bg-white p-6 rounded-lg">
                <div class="flex justify-center" v-if="!isSearching">
                    <nav class="flex space-x-2" aria-label="Pagination">
                        <button @click="previousPage" :disabled="currentPage === 1 || isSearching" class="relative inline-flex items-center px-4 py-2 text-sm bg-gradient-to-r bg-gray-600 text-white border hover:bg-gray-800 font-semibold cursor-pointer leading-5 rounded-md transition duration-150 ease-in-out focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10">
                            Previous
                        </button>
                        <button @click="nextPage" :disabled="currentPage === 4 || isSearching" class="relative inline-flex items-center px-4 py-2 text-sm bg-gradient-to-r bg-gray-600 text-white border hover:bg-gray-800 font-semibold cursor-pointer leading-5 rounded-md transition duration-150 ease-in-out focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10">
                            Next
                        </button>
                    </nav>
                </div>
            </div>
        </div>
        <div v-if="showAddMovieForm" class="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
                <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div class="sm:flex sm:items-start">
                            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                    Add Movie
                                </h3>
                                <div class="mt-2">
                                    <form @submit.prevent="addMovie" class="flex flex-col space-y-2">
                                        <select v-model="newMovie.category_id" required class="border-2">
                                            <option v-for="category in categories" :value="category.id" :key="category.id">{{ category.name }}</option>
                                        </select>
                                        <input v-model="newMovie.title" type="text" placeholder="Title" required class="border-2">
                                        <textarea v-model="newMovie.description" placeholder="Description" required class="border-2"></textarea>
                                        <input v-model="newMovie.duration" type="number" placeholder="Duration" required class="border-2">
                                        <input v-model="newMovie.director" type="text" placeholder="Director" required class="border-2">
                                        <input v-model="newMovie.budget" type="number" placeholder="Budget" required class="border-2">
                                        <input v-model="newMovie.entries" type="number" placeholder="Entries" required class="border-2">
                                        <div v-for="actor in actors" :key="actor.id">
                                            <input type="checkbox" :id="actor.id" :value="actor.id" v-model="selectedActors">
                                            <label :for="actor.id">{{ actor.firstname }} {{ actor.lastname }}</label>
                                        </div>
                                        <input type="file" ref="fileInput" />
                                        <input type="hidden" v-model="newMovie.online">
                                        <button type="submit">Submit</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button @click="showAddMovieForm = false" type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import axios from 'axios';
import CardFilm from "@/components/CardFilm.vue";

export default {
    components: {CardFilm},
    data() {
        return {
            movies: [],
            selectedMovieId: null,
            selectedMovie: null,
            editedMovieTitle:'',
            currentPage: 1,
            searchText: '',
            isSearching: false,
            showAddMovieForm: false,
            actors: [],
            selectedActors: [],
            newMovie: {
                category_id: '',
                title: '',
                description: '',
                duration: '',
                image: '',
                director: '',
                budget: '',
                entries: '',
                actors: [],
                online: true
            },
            categories: []
        };
    },
    created() {
        this.getMovies();
        this.getCategories();
        this.getActors();
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
                const response = await axios.get(`https://mmi21b12.sae105.ovh/api/movies?page=${this.currentPage}`, {
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
        nextPage() {
            if (this.currentPage < 4) {
                this.currentPage++;
                this.getMovies();
            }
        },
        previousPage() {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.getMovies();
            }
        },
        goToPage(page) {
            this.currentPage = page;
            this.getMovies();
        },
        async searchMovies() {
            this.isSearching = true;
            try {
                const token = localStorage.getItem('user-token');
                const response = await axios.get(`https://mmi21b12.sae105.ovh/api/movies?title=${this.searchText}`, {
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
        async getCategories() {
            const token = localStorage.getItem('user-token');
            const response = await axios.get('https://mmi21b12.sae105.ovh/api/categories', {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                },
            });
            this.categories = response.data;
        },
        async getActors() {
            const token = localStorage.getItem('user-token');
            const response = await axios.get('https://mmi21b12.sae105.ovh/api/actors/all', {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                },
            });
            this.actors = response.data;
        },
        async addMovie() {
            try {
                console.log(this.selectedActors);
                const imageId = await this.uploadImage();
                this.newMovie.image = imageId;
                const token = localStorage.getItem('user-token');

                const actorPaths = this.selectedActors.map(id => `/api/actor/${id}`);
                const categoryPath = `/api/categories/${this.newMovie.category_id}`;

                const response = await fetch('https://mmi21b12.sae105.ovh/api/movies', {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({...this.newMovie, actor: actorPaths, category: categoryPath})
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    console.error('Error data:', errorData);
                } else {
                    this.showAddMovieForm = false;
                    this.newMovie = {
                        category_id: '',
                        title: '',
                        description: '',
                        duration: '',
                        image: '',
                        director: '',
                        budget: '',
                        entries: '',
                        online: true
                    };
                    this.selectedActors = [];
                }
            } catch (error) {
                console.error('Error while adding movie:', error);
            }
        },
        async uploadImage() {
            const fileInput = this.$refs.fileInput;
            const file = fileInput.files[0];

            if (!file) {
                console.log("Veuillez sélectionner une image");
                return;
            }

            const formData = new FormData();
            formData.append("file", file);

            return await this.uploadToApi(formData);
        },
        async uploadToApi(formData) {
            try {
                const token = localStorage.getItem("user-token");
                const headers = new Headers();
                headers.append('Authorization', `Bearer ${token}`);
                const response = await fetch("https://mmi21b12.sae105.ovh/api/media_objects", {
                    method: 'POST',
                    headers: headers,
                    body: formData
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                console.log("Réponse de l'API :", data);
                return data['@id'];
            } catch (error) {
                console.error("Erreur lors de l'envoi de l'image :", error);
            }
        },
    },
};
</script>
