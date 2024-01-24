
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
    </section>
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
import CardFilm from "@/components/CardFilm.vue";

export default {
    components: {CardFilm},
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

                    // Update the movie title in the local movies array
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