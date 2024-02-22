<script setup>
const props = defineProps(['categorie'])
const categorie = props.categorie

</script>

<template>
    <section class="py-12 bg-white dark:bg-gray-800 rounded-lg shadow-lg border-2 border-gray-300 dark:border-gray-700">
        <div class="container px-4 md:px-6">
            <div class="grid gap-6">
                <div class="flex flex-col space-y-4">
                    <h1 class="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">{{ categorie.name }}</h1>
                </div>
                <routerLink :to="'/fiche-categorie/'+categorie.id"  class="">
                    <div class="flex justify-center items-center h-8 mt-4 cursor-pointer bg-gray-600 text-white rounded-md hover:bg-gray-800">See more</div>
                </routerLink>
                <a @click="toggleCategorieDetails(categorie.id)" class="cursor-pointer flex justify-center items-center h-8 mt-4 bg-gray-300 text-black rounded-md hover:bg-gray-400">Edit</a>
                <button @click="showDeleteConfirmation = true" class="bg-red-500 px-2 py-1 rounded-md text-white">Delete</button>
            </div>
        </div>
        <div v-if="showDeleteConfirmation" class="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
                <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div class="sm:flex sm:items-start">
                            <h2 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                Delete Category
                            </h2>
                            <div class="mt-2">
                                <p>Are you sure you want to delete this category?</p>
                            </div>
                        </div>
                    </div>
                    <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button @click="deleteCategory(categorie)" type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                            Confirm
                        </button>
                        <button @click="showDeleteConfirmation = false" type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="showEditForm" class="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
                <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div class="sm:flex sm:items-start">
                            <form @submit.prevent="updateCategory(categorie)">
                                <div class="mb-4">
                                    <label for="editCategoryName" class="block text-gray-700 text-sm font-bold mb-2">Name:</label>
                                    <input type="text" id="editCategoryName" v-model="categorie.name" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                                </div>
                                <div class="flex items-center justify-between">
                                    <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                                        Update Category
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

export default {
    data() {
        return {
            categorie: {},
            showEditForm: false,
            showDeleteConfirmation: false,
        };
    },
    methods: {
        toggleCategorieDetails() {
            this.showEditForm = !this.showEditForm;
        },
        async updateCategory(categorie) {
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

                const categoryToUpdate = {
                    name: categorie.name,
                };

                await axios.patch(`http://127.0.0.1:8000/api/categories/${categorie.id}`, categoryToUpdate, { headers });

                this.$emit('refreshCategories');

                this.showEditForm = false;
            } catch (error) {
                console.error('Error while updating category:', error);
            }
        },
        async deleteCategory(categorie) {
            try {
                const token = localStorage.getItem('user-token');
                if (!token) {
                    this.$router.push('/');
                    return;
                }
                const headers = {
                    Authorization: `Bearer ${token}`,
                };

                await axios.delete(`http://127.0.0.1:8000/api/categories/${categorie.id}`, { headers });

                this.showDeleteConfirmation = false;

                this.$emit('refreshCategories');
            } catch (error) {
                console.error('Error while deleting category:', error);
            }
        },
    },
};
</script>