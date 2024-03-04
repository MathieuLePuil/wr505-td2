<template>
    <section>
        <article>
            <h1 class="text-3xl px-10 my-10 font-semibold">List of actors</h1>
            <div class="flex px-10 mt-5">
                <input v-model="searchText" type="text" placeholder="Search..." class="border-2 border-gray-300 bg-white h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none">
                <button @click="searchActors" class="bg-blue-500 text-white px-4 py-2 rounded">Search</button>
                <button @click="showAddActorForm = true" class="bg-blue-500 text-white px-4 py-2 rounded ml-10">Add Actor</button>
            </div>
            <div class="flex px-10 flex-wrap mt-5">
                <div v-for="actor in actors" :key="actor.id"  class="flex flex-col items-center w-1/3 px-3 mb-5">
                    <card-acteur :acteur="actor" @refreshActors="getActors" />
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
        <div v-if="showAddActorForm" class="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
                <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div class="sm:flex sm:items-start">
                            <form @submit.prevent="addActor">
                                <div class="mb-4">
                                    <label for="firstname" class="block text-gray-700 text-sm font-bold mb-2">First Name:</label>
                                    <input type="text" id="firstname" v-model="newActor.firstname" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                                </div>
                                <div class="mb-4">
                                    <label for="lastname" class="block text-gray-700 text-sm font-bold mb-2">Last Name:</label>
                                    <input type="text" id="lastname" v-model="newActor.lastname" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                                </div>
                                <div class="mb-4">
                                    <label for="nationality" class="block text-gray-700 text-sm font-bold mb-2">Nationality:</label>
                                    <input type="text" id="nationality" v-model="newActor.nationality" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                                </div>
                                <div class="mb-4">
                                    <label for="movies" class="block text-gray-700 text-sm font-bold mb-2">Movies:</label>
                                    <select multiple id="movies" v-model="newActor.movies" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                                        <option v-for="movie in movies" :key="movie.id" :value="movie.id">{{ movie.title }}</option>
                                    </select>
                                </div>
                                <div class="flex items-center justify-between">
                                    <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                                        Add Actor
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import axios from 'axios';
import CardActeur from "../components/CardActeur.vue";

export default {
    components: {CardActeur},
    data() {
        return {
            actors: [],
            selectedActorId: null,
            selectedActor: null,
            editedActorName:'',
            currentPage: 1,
            isSearching: false,
            showAddActorForm: false,
            newActor: {
                firstname: '',
                lastname: '',
                nationality: '',
                movies: []
            },
            movies: []
        };
    },
    created() {
        this.getActors();
        this.getMovies();
    },
    methods: {
        toggleActorDetails(actorId) {
            this.selectedActorId = this.selectedActorId === actorId ? null : actorId;
            this.selectedActor = this.actors.find(actor => actor.id === this.selectedActorId);
            this.editedActorName = this.selectedActor ? this.selectedActor.lastName : '';
        },
        async getActors() {
            try {
                const token = localStorage.getItem('user-token');
                const response = await axios.get(`https://mmi21b12.sae105.ovh/api/actors?page=${this.currentPage}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/json',
                    },
                });
                this.actors = response.data;
            } catch (error) {
                console.error('Error', error);
                console.log(error.response.data.code);
            }
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
        async addActor() {
            try {
                const token = localStorage.getItem('user-token');
                const headers = {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                };
                const moviePaths = this.newActor.movies.map(id => `/api/movie/${id}`);
                const actorData = { ...this.newActor, movies: moviePaths };
                const response = await axios.post('https://mmi21b12.sae105.ovh/api/actors', actorData, { headers });
                this.actors.push(response.data);
                this.showAddActorForm = false;
                this.newActor = { firstname: '', lastname: '', nationality: '', movies: [] };
            } catch (error) {
                console.error('Error while adding actor:', error);
            }
        },
        nextPage() {
            if (this.currentPage < 4) {
                this.currentPage++;
                this.getActors();
            }
        },
        previousPage() {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.getActors();
            }
        },
        async updateActorName() {
            if (this.selectedActor && this.editedActorName) {
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
                    const updatedActor = { lastName: this.editedActorName };

                    await axios.patch(`https://mmi21b12.sae105.ovh/api/actors/${this.selectedActor.id}`, updatedActor, { headers });

                    const actorToUpdate = this.actors.find(actor => actor.id === this.selectedActor.id);
                    if (actorToUpdate) {
                        actorToUpdate.lastName = this.editedActorName;
                    }

                    this.editedActorName = '';
                    this.selectedActorId = null;
                } catch (error) {
                    console.error('Erreur lors de la mise à jour du nom de l\'acteur :', error);
                }
            }
        },
        async searchActors() {
            try {
                const token = localStorage.getItem('user-token');
                const response = await axios.get(`https://mmi21b12.sae105.ovh/api/actors?lastname=${this.searchText}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/json',
                    },
                });
                this.actors = response.data;
            } catch (error) {
                console.error('Error', error);
                console.log(error.response.data.code);
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