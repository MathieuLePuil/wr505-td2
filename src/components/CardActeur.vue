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
                    <div class="flex justify-center items-center h-8 mt-4 cursor-pointer bg-gray-600 text-white rounded-md hover:bg-gray-800">See more</div>
                </routerLink>
                <a @click="toggleActorDetails(actor.id)" class="cursor-pointer flex justify-center items-center h-8 mt-4 bg-gray-300 text-black rounded-md hover:bg-gray-400">Edit</a>
            </div>
        </div>
    </section>
    <div :class="[{ 'modal': selectedActorId, 'scale-0': !selectedActorId }]">
        <div class="modal-content" v-if="selectedActor">
            <h2 class="text-xl font-bold mb-2">{{ selectedActor.name }}</h2>
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

export default {
    data() {
        return {
            actors: [],
            selectedActorId: null,
            selectedActor: null,
            editedActorName:''
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