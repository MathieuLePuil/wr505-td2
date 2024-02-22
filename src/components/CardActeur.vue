<script setup>
import {onMounted, ref} from 'vue';
import axios from 'axios';
import { defineProps } from 'vue';

const props = defineProps(['acteur']);
const actor = props.acteur;

const movies = ref([]);

const getActorMovies = async () => {
    const token = localStorage.getItem('user-token');
    try {
        // Fetch the actor data
        const actorResponse = await axios.get(`http://127.0.0.1:8000/api/actor/${actor.id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json',
            },
        });

        // Extract the movies from the actor data
        movies.value = actorResponse.data.movies;
    } catch (error) {
        console.error('Erreur lors de la récupération des films de l\'acteur :', error);
    }
};

onMounted(() => {
    getActorMovies();
});
</script>

<template>
    <section class="py-12 bg-white dark:bg-gray-800 rounded-lg shadow-lg border-2 border-gray-300 dark:border-gray-700">
        <div class="container px-4 md:px-6">
            <div class="grid gap-6">
                <div class="flex flex-col space-y-4">
                    <h1 class="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">{{ actor.firstname }} {{ actor.lastname }}</h1>
                    <p class="max-w-[600px] text-zinc-500 md:text-xl dark:text-zinc-400">{{ actor.nationality }}</p>
                </div>
                <div class="flex flex-col space-y-4">
                    <h2 class="text-2xl font-bold tracking-tighter sm:text-3xl xl:text-4xl/none">Movies</h2>
                    <div v-for="movie in movies" :key="movie.id">
                        <div class="space-y-1">
                            <routerLink :to="'/fiche-movie/'+movie.id" class="link">{{ movie.title }}</routerLink>
                        </div>
                    </div>
                </div>
                <routerLink :to="'/fiche-actor/'+actor.id"  class="">
                    <div class="flex justify-center items-center h-8 mt-4 cursor-pointer bg-gray-600 text-white rounded-md hover:bg-gray-800">See more</div>
                </routerLink>
                <a @click="toggleActorDetails(actor.id)" class="cursor-pointer flex justify-center items-center h-8 mt-4 bg-gray-300 text-black rounded-md hover:bg-gray-400">Edit</a>
                <button @click="prepareDelete(actor)" class="bg-red-500 px-2 py-1 rounded-md text-white">Supprimer</button>

            </div>
        </div>
    </section>
    <div :class="[{ 'modal': selectedActorId, 'scale-0': !selectedActorId }]">
        <div class="modal-content" v-if="selectedActor">
            <h2 class="text-xl font-bold mb-2">{{ selectedActor.firstname }} {{ selectedActor.lastname }}</h2>
            <form @submit.prevent="updateActor">
                <div class="flex flex-col">
                    <label for="editActorFirstname">Prénom de l'acteur :</label>
                    <input
                        type="text"
                        class="border border-gray-300 p-2 rounded-md mb-2"
                        id="editActorFirstname"
                        v-model="selectedActor.firstname"
                    />
                    <label for="editActorLastname">Nom de l'acteur :</label>
                    <input
                        type="text"
                        class="border border-gray-300 p-2 rounded-md mb-2"
                        id="editActorLastname"
                        v-model="selectedActor.lastname"
                    />
                    <label for="editActorNationality">Nationalité de l'acteur :</label>
                    <input
                        type="text"
                        class="border border-gray-300 p-2 rounded-md mb-2"
                        id="editActorNationality"
                        v-model="selectedActor.nationality"
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
                                Supprimer l'acteur
                            </h3>
                            <div class="mt-2">
                                <p>Êtes-vous sûr de vouloir supprimer cet acteur ?</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button @click="deleteActor" type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                        Supprimer
                    </button>
                    <button @click="showDeleteConfirmation = false" type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                        Annuler
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
            actors: [],
            selectedActorId: null,
            selectedActor: null,
            editedActorName:'',
            showDeleteConfirmation: false,
        };
    },
    created() {
        this.getActors();
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
                const response = await axios.get('http://127.0.0.1:8000/api/actors', {
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
        async updateActor() {
            if (this.selectedActor) {
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

                    const actorToUpdate = {
                        firstname: this.selectedActor.firstname,
                        lastname: this.selectedActor.lastname,
                        nationality: this.selectedActor.nationality
                    };

                    await axios.patch(`http://127.0.0.1:8000/api/actors/${this.selectedActor.id}`, actorToUpdate, { headers });

                    const actorInList = this.actors.find(actor => actor.id === this.selectedActor.id);
                    if (actorInList) {
                        Object.assign(actorInList, this.selectedActor);
                    }

                    this.selectedActorId = null;
                } catch (error) {
                    console.error('Erreur lors de la mise à jour de l\'acteur :', error);
                }
            }
        },
        prepareDelete(actor) {
            this.selectedActor = actor;
            this.showDeleteConfirmation = true;
        },
        async deleteActor() {
            if (!this.selectedActor) {
                console.error('Aucun acteur sélectionné pour la suppression');
                return;
            }
            try {
                const token = localStorage.getItem('user-token');
                if (!token) {
                    this.$router.push('/');
                    return;
                }
                const headers = {
                    Authorization: `Bearer ${token}`,
                };

                await axios.delete(`http://127.0.0.1:8000/api/actors/${this.selectedActor.id}`, { headers });

                this.showDeleteConfirmation = false;

                this.$emit('refreshActors');

                // Refresh the list of actors
                this.getActors();
            } catch (error) {
                console.error('Erreur lors de la suppression de l\'acteur :', error);
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