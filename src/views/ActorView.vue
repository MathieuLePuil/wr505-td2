<template>
    <section>
        <article>
            <h1 class="text-3xl px-10 my-10 font-semibold">List of actors</h1>
            <div class="flex px-10 mt-5">
                <input v-model="searchText" type="text" placeholder="Search..." class="border-2 border-gray-300 bg-white h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none">
                <button @click="searchActors" class="bg-blue-500 text-white px-4 py-2 rounded">Search</button>
            </div>
            <div class="flex px-10 flex-wrap mt-5">
                <div v-for="actor in actors" :key="actor.id"  class="flex flex-col items-center w-1/3 px-3 mb-5">
                    <card-acteur :acteur="actor"/>
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
    </section>
    <div :class="[{ 'modal': selectedActorId, 'scale-0': !selectedActorId }]">
        <div class="modal-content" v-if="selectedActor">
            <h2 class="text-xl font-bold mb-2">{{ selectedActor.firstname }}</h2>
            <form @submit.prevent="updateActorName">
                <div class="flex flex-col">
                    <label for="editActorTitle">Nom de l'acteur :</label>
                    <input
                        type="text"
                        class="border border-gray-300 p-2 rounded-md mb-2"
                        id="editActorTitle"
                        v-model="editedActorName"
                    />
                </div>
                <button type="submit" class="bg-blue-500 px-2 py-1 rounded-md text-white">Modifier</button>
            </form>
        </div>
    </div>
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
                const response = await axios.get(`http://127.0.0.1:8000/api/actors?page=${this.currentPage}`, {
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

                    await axios.patch(`http://127.0.0.1:8000/api/actors/${this.selectedActor.id}`, updatedActor, { headers });

                    // Update the actor name in the local actors array
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
                const response = await axios.get(`http://127.0.0.1:8000/api/actors?lastname=${this.searchText}`, {
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