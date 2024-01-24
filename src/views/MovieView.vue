
<template>
    <section>
        <article>
            <h1 class="text-3xl px-10 my-10 font-semibold">List of movies</h1>
            <div class="flex px-10 flex-wrap mt-5">
                <div v-for="movie in movies" :key="movie.id" class="flex flex-col items-center w-1/3 px-3 mb-5">
                    <card-film :film="movie"/>
                </div>
            </div>
        </article>
        <div class="bg-gradient-to-r flex items-center justify-center">
            <div class="max-w-full md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl mx-auto bg-white p-6 rounded-lg">
                <div class="flex justify-center">
                    <nav class="flex space-x-2" aria-label="Pagination">
                        <button @click="previousPage" :disabled="currentPage === 1" class="relative inline-flex items-center px-4 py-2 text-sm bg-gradient-to-r bg-gray-600 text-white border hover:bg-gray-800 font-semibold cursor-pointer leading-5 rounded-md transition duration-150 ease-in-out focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10">
                            Previous
                        </button>
                        <span v-for="page in 3" :key="page" class="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border hover:bg-gray-300 cursor-pointer leading-5 rounded-md transition duration-150 ease-in-out focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10"
                              :class="{ '!bg-gray-300': currentPage === page }" @click="goToPage(page)">
                            {{ page }}
                        </span>
                        <button @click="nextPage" :disabled="currentPage === 3" class="relative inline-flex items-center px-4 py-2 text-sm bg-gradient-to-r bg-gray-600 text-white border hover:bg-gray-800 font-semibold cursor-pointer leading-5 rounded-md transition duration-150 ease-in-out focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10">
                            Next
                        </button>
                    </nav>
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
            currentPage: 1, // Add this line
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
    },
};
</script>
