
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
                    <card-film :film="movie"/>
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
                        <span v-for="page in 3" :key="page" class="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border hover:bg-gray-300 cursor-pointer leading-5 rounded-md transition duration-150 ease-in-out focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10"
                              :class="{ '!bg-gray-300': currentPage === page }" @click="goToPage(page)" :disabled="isSearching">
                {{ page }}
            </span>
                        <button @click="nextPage" :disabled="currentPage === 3 || isSearching" class="relative inline-flex items-center px-4 py-2 text-sm bg-gradient-to-r bg-gray-600 text-white border hover:bg-gray-800 font-semibold cursor-pointer leading-5 rounded-md transition duration-150 ease-in-out focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10">
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
                                        <input v-model="newMovie.duration" type="text" placeholder="Duration" required class="border-2">
                                        <input v-model="newMovie.image" type="text" placeholder="Image URL" required class="border-2">
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
            newMovie: {
                category_id: '',
                title: '',
                description: '',
                duration: '',
                image: '',
                online: true
            },
            categories: []
        };
    },
    created() {
        this.getMovies();
        this.getCategories();
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
                const response = await axios.get(`http://127.0.0.1:8000/api/movies?page=${this.currentPage}`, { // Modify this line
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
        // Add these methods
        nextPage() {
            if (this.currentPage < 3) {
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
                const response = await axios.get(`http://127.0.0.1:8000/api/movies?title=${this.searchText}`, {
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
            const response = await axios.get('http://localhost:8000/api/categories', {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                },
            });
            this.categories = response.data;
        },
        async addMovie() {
            try {
                const token = localStorage.getItem('user-token');
                const response = await fetch('http://127.0.0.1:8000/api/movies', {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(this.newMovie)
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
                        online: true
                    };
                }
            } catch (error) {
                console.error('Error while adding movie:', error);
            }
        }
    },
};
</script>
